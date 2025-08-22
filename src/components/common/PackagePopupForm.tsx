"use client";

import React, { useState } from "react";
import Image from "next/image";
// Removed useRouter import and usage as it was not used
import { supabase } from "@/lib/supabase";
import "./PackagePopupForm.css";

// Define a specific interface for the features object, based on your usage
interface PackageFeatures {
  kategori?: number;
  lpse?: number;
  keywords?: number;
  email_notifikasi?: boolean;
  wa_notifikasi?: boolean;
  // Add any other feature properties here if they exist in your data
}

interface SelectedPackage {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  features?: PackageFeatures; // Changed from Record<string, any> to PackageFeatures
}

interface PackagePopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: SelectedPackage | null;
}

// Interface for safely handling generic errors
interface ExtendedError extends Error {
  message: string;
}

const PackagePopupForm: React.FC<PackagePopupFormProps> = ({
  isOpen,
  onClose,
  selectedPackage,
}) => {
  // const router = useRouter(); // Removed as it was assigned but never used

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    category: "",
    targetSpse: "",
    keywords: [] as string[],
  });

  if (!isOpen || !selectedPackage) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleAddKeyword = () => {
    setFormData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPackage) return;

    try {
      const package_id = selectedPackage.id;

      // 1️⃣ Cek user
      const { data: existingUsers, error: userError } = await supabase
        .from("users")
        .select("id") // Select only id as other fields are not used from existingUsers
        .eq("email", formData.email);

      if (userError) throw userError;

      let user_id: string;
      if (existingUsers && existingUsers.length > 0) {
        user_id = existingUsers[0].id;
      } else {
        const { data: newUser, error: insertUserError } = await supabase
          .from("users")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.whatsapp,
            },
          ])
          .select("id") // Select only id for the new user
          .single();

        if (insertUserError) throw insertUserError;
        user_id = newUser.id;
      }

      // 2️⃣ Hitung tanggal mulai/akhir
      const start_date = new Date();
      const end_date = new Date();
      // Ensure duration_months is a number before adding to months
      end_date.setMonth(start_date.getMonth() + (selectedPackage.duration_months || 0));

      // 3️⃣ Insert subscription pending
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id,
            package_id,
            payment_status: "pending",
            start_date: start_date.toISOString().split("T")[0],
            end_date: end_date.toISOString().split("T")[0],
          },
        ])
        .select("id") // Select only id as only subscriptionData.id is used
        .single();

      if (subscriptionError) throw subscriptionError;

      // 4️⃣ Buat Xendit invoice melalui API route yang sudah ada
      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPackage.price,
          currency: "IDR",
          customer: {
            email: formData.email,
            name: formData.name,
            whatsapp: formData.whatsapp, // Include whatsapp for Xendit customer details
          },
          subscriptionId: subscriptionData.id,
        }),
      });

      // Type the response data expected from your API route
      interface InvoiceResponse {
        invoiceUrl?: string;
        error?: string;
      }

      const responseData: InvoiceResponse = await response.json();

      if (!responseData.invoiceUrl) {
        throw new Error(responseData.error || "Gagal membuat invoice Xendit");
      }

      // 5️⃣ Update subscription dengan payment_url
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ payment_url: responseData.invoiceUrl })
        .eq("id", subscriptionData.id);

      if (updateError) throw updateError;

      // 6️⃣ Redirect ke Xendit payment URL
      window.location.href = responseData.invoiceUrl;
    } catch (error: unknown) { // Changed 'any' to 'unknown'
      const err = error as ExtendedError; // Safely cast to ExtendedError
      console.error("Error creating subscription or invoice:", err.message);
      alert(`❌ Terjadi kesalahan: ${err.message || "Silakan coba lagi."}`);
    }
  };


  return (
    <div className="package-popup-overlay" onClick={onClose}>
      <div
        className="package-popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="package-close-button" onClick={onClose}>
          ✕
        </button>

        <div className="package-popup-header-wrapper">
          <div className="package-header-left">
            <h2 className="package-main-title">
              DAFTAR PAKET <br /> {selectedPackage.name.toUpperCase()}
            </h2>
            <p className="package-form-description">
              Buat akun dengan {selectedPackage.name}
            </p>
          </div>

          <div className="package-header-right">
            <p className="package-plan">{selectedPackage.name}</p>
            <p className="package-duration">
              {selectedPackage.duration_months ?? ""} Bulan
            </p>
            <p className="package-price">{selectedPackage.price}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="package-trial-form">
          <div className="package-input-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama"
              required
              className="package-text-input"
            />
          </div>

          <div className="package-inline-inputs">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="package-text-input"
            />
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Nomor Whatsapp"
              required
              className="package-text-input"
            />
          </div>

          <div className="package-radio-group">
            <label className="package-label">Kategori</label>
            <div className="package-radio-options-grid">
              {[
                "Pengadaan Barang",
                "Pekerjaan Konstruksi",
                "Jasa Konsultansi Badan Usaha Konstruksi",
                "Jasa Konsultansi Perorangan Konstruksi",
                "Jasa Konsultansi Badan Usaha Non Konstruksi",
                "Jasa Konsultansi Perorangan Non Konstruksi",
                "Pekerjaan Konstruksi Terintegrasi",
                "Jasa Lainnya",
              ].map((category, index) => (
                <label key={index} className="package-radio-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={formData.category === category}
                    onChange={handleRadioChange}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="package-input-group">
            <select
              id="targetSpse"
              name="targetSpse"
              value={formData.targetSpse}
              onChange={handleChange}
              className="package-select-input"
              required
            >
              <option value="">Pilih SPSE</option>
              <option value="LPSE A">LPSE A</option>
              <option value="LPSE B">LPSE B</option>
              <option value="LPSE C">LPSE C</option>
            </select>
          </div>

          <div className="package-input-group">
            <div className="package-keywords-input-area">
              {formData.keywords.map((keyword, index) => (
                <div key={index} className="package-keyword-tag">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) =>
                      handleKeywordChange(index, e.target.value)
                    }
                    placeholder={`Keyword ${index + 1}`}
                    className="package-keyword-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(index)}
                    className="package-remove-keyword-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddKeyword}
                className="package-add-keyword-btn"
              >
                + Tambah Keyword
              </button>
            </div>
          </div>

          {/* ✅ Hidden fields */}
          {/* Note: These hidden fields are typically used when submitting forms directly to a server.
              Since you're using fetch API, the data is explicitly sent in the body of the fetch call.
              These might not be strictly necessary for the current handleSubmit implementation.
          */}
          <input
            type="hidden"
            name="selectedPackage"
            value={JSON.stringify(selectedPackage)}
          />
          <input type="hidden" name="amount" value={selectedPackage?.price ?? ""} />
          <input
            type="hidden"
            name="duration_months"
            value={selectedPackage?.duration_months ?? ""}
          />
          <input type="hidden" name="package_id" value={selectedPackage?.id ?? ""} />

          <div className="package-submit-button-wrapper">
            <button type="submit" className="package-submit-button">
              DAFTAR SEKARANG
            </button>

            <div className="package-payment-partners">
              <p className="package-payment-title">Partner Pembayaran Kami</p>
              <div className="package-payment-icons">
                <Image
                  src="/images/form-payment-partner.png"
                  alt="Payment Partners"
                  width={437}
                  height={40}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackagePopupForm;