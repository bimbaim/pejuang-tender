// This file should be saved EXACTLY as: src/components/common/PackagePopupForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import CustomMultiSelect from "@/components/common/CustomMultiSelect";
import "./PackagePopupForm.css";

// Tentukan antarmuka untuk fitur-fitur paket
interface PackageFeatures {
  kategori?: number;
  lpse?: number;
  keywords?: number;
  email_notifikasi?: boolean;
  wa_notifikasi?: boolean;
}

// Tentukan antarmuka untuk paket yang dipilih
interface SelectedPackage {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  features?: PackageFeatures;
}

// Tentukan antarmuka untuk properti komponen
interface PackagePopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: SelectedPackage | null;
}

// Antarmuka untuk menangani kesalahan
interface ExtendedError extends Error {
  message: string;
}

// Antarmuka untuk lokasi LPSE
interface LpseLocation {
  id: number;
  value: string;
  name: string;
}

const PackagePopupForm: React.FC<PackagePopupFormProps> = ({
  isOpen,
  onClose,
  selectedPackage,
}) => {
  // Kelola status formulir menggunakan state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    category: [] as string[],
    targetSpse: [] as string[],
    keywords: [] as string[],
  });

  // 🔹 State untuk mengelola status loading dan progress bar
  const [isLoading, setIsLoading] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);

  // Kelola opsi LPSE yang diambil dari database
  const [lpseOptions, setLpseOptions] = useState<LpseLocation[]>([]);

  // Gunakan useEffect untuk mengambil data LPSE saat popup dibuka
  useEffect(() => {
    const fetchLpseOptions = async () => {
      // Ambil lokasi LPSE dari Supabase
      const { data, error } = await supabase
        .from("lpse_locations")
        .select("id, value, name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching LPSE locations:", error.message);
      } else {
        setLpseOptions(data || []);
      }
    };

    if (isOpen) {
      fetchLpseOptions();
    } else {
      // Reset formulir saat popup ditutup
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        category: [],
        targetSpse: [],
        keywords: [],
      });
      setIsLoading(false);
      setShowProgressBar(false);
    }
  }, [isOpen]);

  // Jangan render komponen jika popup tidak terbuka atau tidak ada paket yang dipilih
  if (!isOpen || !selectedPackage) return null;

  // Ambil batasan fitur dari data paket yang dipilih
  const spseLimit = selectedPackage.features?.lpse ?? 20;
  const keywordLimit = selectedPackage.features?.keywords ?? 5;
  const categoryLimit = selectedPackage.features?.kategori ?? 1;

  // Tangani perubahan input teks dan email
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tangani perubahan pada pilihan LPSE
  const handleLpseChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      targetSpse: selectedValues,
    }));
  };

  // Tangani perubahan pada input kata kunci
  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
  };

  // Hapus kata kunci dari daftar
  const handleRemoveKeyword = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== indexToRemove),
    }));
  };

  // Tambah kata kunci baru jika batas belum tercapai
  const handleAddKeyword = () => {
    if (formData.keywords.length < keywordLimit) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, ""],
      }));
    }
  };

  // Tangani perubahan pada pilihan kategori dengan batasan
  const handleCategoryChange = (category: string) => {
    let newCategories = [...formData.category];
    if (newCategories.includes(category)) {
      // Hapus kategori jika sudah dipilih
      newCategories = newCategories.filter((c) => c !== category);
    } else if (newCategories.length < categoryLimit) {
      // Tambah kategori jika batas belum tercapai
      newCategories.push(category);
    }
    setFormData((prev) => ({ ...prev, category: newCategories }));
  };

  // Tangani pengiriman formulir
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPackage) return;

    // 🔹 Mulai loading dan tampilkan progress bar
    setIsLoading(true);
    setShowProgressBar(true);

    try {
      const package_id = selectedPackage.id;

      // 1. Periksa apakah pengguna sudah ada di database
      const { data: existingUsers, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email);

      if (userError) throw userError;

      let user_id: string;
      if (existingUsers && existingUsers.length > 0) {
        // Gunakan user_id yang sudah ada
        user_id = existingUsers[0].id;
      } else {
        // Buat pengguna baru jika belum ada
        const { data: newUser, error: insertUserError } = await supabase
          .from("users")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              phone: formData.whatsapp,
            },
          ])
          .select("id")
          .single();

        if (insertUserError) throw insertUserError;
        user_id = newUser.id;
      }

      // 2. Hitung tanggal mulai dan akhir langganan
      const start_date = new Date();
      const end_date = new Date();
      end_date.setMonth(
        start_date.getMonth() + (selectedPackage.duration_months || 0)
      );

      // 3. Masukkan langganan baru dengan status 'pending'
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .insert([
            {
              user_id,
              package_id,
              payment_status: "pending",
              start_date: start_date.toISOString().split("T")[0],
              end_date: end_date.toISOString().split("T")[0],
              keyword: formData.keywords,
              category: formData.category,
              spse: formData.targetSpse,
            },
          ])
          .select("id")
          .single();

      if (subscriptionError) throw subscriptionError;

      // 4. Panggil API untuk membuat invoice Xendit
      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPackage.price,
          currency: "IDR",
          customer: {
            email: formData.email,
            name: formData.name,
            whatsapp: formData.whatsapp,
          },
          subscriptionId: subscriptionData.id,
        }),
      });

      // Antarmuka untuk respons invoice
      interface InvoiceResponse {
        invoiceUrl?: string;
        error?: string;
      }
      const responseData: InvoiceResponse = await response.json();

      if (!responseData.invoiceUrl) {
        throw new Error(responseData.error || "Gagal membuat invoice Xendit");
      }

      // 5. Perbarui langganan dengan URL pembayaran dari Xendit
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ payment_url: responseData.invoiceUrl })
        .eq("id", subscriptionData.id);

      if (updateError) throw updateError;

      // 6. Redirect ke URL pembayaran Xendit
      window.location.href = responseData.invoiceUrl;
    } catch (error: unknown) {
      const err = error as ExtendedError;
      console.error("Error creating subscription or invoice:", err.message);
      alert(`❌ Terjadi kesalahan: ${err.message || "Silakan coba lagi."}`);
      // 🔹 Matikan loading dan sembunyikan progress bar jika ada error
      setIsLoading(false);
      setShowProgressBar(false);
    }
  };

  // Format opsi LPSE agar sesuai dengan komponen CustomMultiSelect
  const multiSelectLpseOptions = lpseOptions.map((lpse) => ({
    value: lpse.value,
    label: lpse.name,
  }));

  // Format harga menjadi format mata uang Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const allCategories = [
    "Pengadaan Barang",
    "Pekerjaan Konstruksi",
    "Jasa Konsultansi Badan Usaha Konstruksi",
    "Jasa Konsultansi Perorangan Konstruksi",
    "Jasa Konsultansi Badan Usaha Non Konstruksi",
    "Pekerjaan Konstruksi Terintegrasi",
    "Jasa Lainnya",
  ];

  return (
    <div className="package-popup-overlay" onClick={onClose}>
      {/* 🔹 Tampilkan progress bar jika showProgressBar true */}
      {showProgressBar && <div className="loading-bar"></div>}

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
            <p className="package-price">
              IDR {formatPrice(selectedPackage.price)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="package-trial-form">
          <div className="package-input-group">
            <label>Nama</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="package-text-input"
            />
          </div>

          <div className="package-inline-inputs">
            <div className="package-field-inline">
              <label>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="package-text-input"
              />
            </div>
            <div className="package-field-inline">
              <label>Nomor Whatsapp</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="package-text-input"
              />
            </div>
          </div>

          <div className="radio-group">
            <label>Kategori (maks {categoryLimit})</label>
            <div className="radio-options-grid">
              {allCategories.map((cat, index) => (
                <label key={index} className="radio-option">
                  <input
                    type="checkbox"
                    checked={formData.category.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    disabled={
                      !formData.category.includes(cat) &&
                      formData.category.length >= categoryLimit
                    }
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className="package-input-group">
            <div className="package-field-input">
              <label>Target SPSE (https://spse.inaproc/......)</label>
              <CustomMultiSelect
                options={multiSelectLpseOptions}
                defaultValue={formData.targetSpse}
                onChange={handleLpseChange}
                placeholder="Pilih SPSE"
                limit={spseLimit}
              />
            </div>
          </div>

          <div className="package-input-group">
            <div className="package-field-input">
              <label>Target Kata Kunci (maks {keywordLimit})</label>
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

                {/* Tampilkan tombol "Tambah" hanya jika batas belum tercapai */}
                {formData.keywords.length < keywordLimit && (
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="package-add-keyword-btn"
                  >
                    + Tambah Kata Kunci
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Kolom tersembunyi untuk data paket */}
          <input
            type="hidden"
            name="selectedPackage"
            value={JSON.stringify(selectedPackage)}
          />
          <input
            type="hidden"
            name="amount"
            value={selectedPackage?.price ?? ""}
          />
          <input
            type="hidden"
            name="duration_months"
            value={selectedPackage?.duration_months ?? ""}
          />
          <input
            type="hidden"
            name="package_id"
            value={selectedPackage?.id ?? ""}
          />

          <div className="package-submit-button-wrapper">
            <button
              type="submit"
              className="package-submit-button"
              disabled={isLoading} // 🔹 Matikan tombol saat loading
            >
              {/* 🔹 Ubah teks tombol saat loading */}
              {isLoading ? "LOADING..." : "DAFTAR SEKARANG"}
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