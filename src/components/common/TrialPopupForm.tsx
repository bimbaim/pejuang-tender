"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CustomMultiSelect from "@/components/common/CustomMultiSelect";
import "./TrialPopupForm.css";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedError extends Error {
  message: string;
}

interface LpseLocation {
  id: number;
  value: string;
  name: string;
}

// Define the limits as constants
const spseLimit = 10;
const keywordLimit = 3;

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  // State to manage all form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    category: "",
    targetSpse: [] as string[],
    keywords: [] as string[],
  });

  // State untuk melacak status validasi setiap field
  const [validationState, setValidationState] = useState({
    name: null as boolean | null,
    email: null as boolean | null,
    whatsapp: null as boolean | null,
    category: null as boolean | null,
    targetSpse: null as boolean | null,
    keywords: null as boolean | null,
  });

  // State untuk LPSE options
  const [lpseOptions, setLpseOptions] = useState<LpseLocation[]>([]);

  // State to track form submission attempt
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch LPSE data from Supabase when the popup is opened
  useEffect(() => {
    if (!isOpen) return;

    const fetchLpseOptions = async () => {
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

    fetchLpseOptions();
  }, [isOpen]);

  // If the popup is not open, render nothing
  if (!isOpen) {
    return null;
  }

  // --- Fungsi Validasi Baru ---
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = formData.name.trim() !== "";
    const isEmailValid = emailRegex.test(formData.email);
    const isWhatsappValid = formData.whatsapp.trim() !== "";
    const isCategoryValid = formData.category !== "";
    const isSpseValid = formData.targetSpse.length > 0;
    const isKeywordsValid = formData.keywords.some(keyword => keyword.trim() !== "");

    const newValidationState = {
      name: isNameValid,
      email: isEmailValid,
      whatsapp: isWhatsappValid,
      category: isCategoryValid,
      targetSpse: isSpseValid,
      keywords: isKeywordsValid,
    };

    setValidationState(newValidationState);
    
    return isNameValid && isEmailValid && isWhatsappValid && isCategoryValid && isSpseValid && isKeywordsValid;
  };
  // --- Akhir Fungsi Validasi Baru ---

  // Handle changes for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      // Re-validate if form has been submitted
      validateForm();
    }
  };

  // Handle changes for radio buttons
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
    if (isSubmitted) {
      validateForm();
    }
  };

  // Handle changes for individual keyword inputs
  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
    if (isSubmitted) {
      validateForm();
    }
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, index) => index !== indexToRemove),
    }));
    if (isSubmitted) {
      validateForm();
    }
  };

  // Handle adding a new empty keyword input
  const handleAddKeyword = () => {
    if (formData.keywords.length < keywordLimit) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, ""],
      }));
    }
  };

  // New handler to update targetSpse from the CustomMultiSelect component
  const handleLpseChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      targetSpse: selectedValues,
    }));
    if (isSubmitted) {
      validateForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true); // Tandai form sebagai sudah disubmit

    const isFormValid = validateForm();
    if (!isFormValid) {
      // Jika form tidak valid, hentikan proses submit
      console.log("Form is not valid. Please correct the errors.");
      return;
    }

    try {
      const { data: trialPackage, error: packageError } = await supabase
        .from("packages")
        .select("id")
        .eq("name", "Free Trial")
        .single();

      if (packageError || !trialPackage) {
        console.error("Error fetching trial package:", packageError?.message || "Trial package not found.");
        throw new Error("Trial package not found in the database. Please ensure a package named 'Free Trial' exists.");
      }

      const package_id = trialPackage.id;

      let user_id;
      const { data: existingUsers, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email);

      if (userError) throw userError;

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
          .select("id")
          .single();

        if (insertUserError) throw insertUserError;
        user_id = newUser.id;
      }

      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const endDateISO = endDate.toISOString().split("T")[0];
      const endDateFormatted = endDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id,
            package_id,
            payment_status: "free-trial",
            start_date: new Date().toISOString().split("T")[0],
            end_date: endDateISO,
            category: [formData.category],
            keyword: formData.keywords,
            spse: formData.targetSpse,
          },
        ]);

      if (subscriptionError) throw subscriptionError;

      try {
        const response = await fetch("/api/sendgrid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: formData.email,
            subject: "Trial 7 Hari pejuangtender.id : Update Tender Setiap Hari di Email Anda",
            templateName: "trialWelcome",
            data: {
              name: formData.name,
              trialEndDate: endDateFormatted,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send email via API.");
        }

        console.log("Email berhasil dikirim via API!");
      } catch (apiError: unknown) {
        const err = apiError as ExtendedError;
        console.error("Gagal mengirim email via API:", err.message);
      }

      onClose();
      router.push("/thank-you");
    } catch (error: unknown) {
      const err = error as ExtendedError;
      console.error("Error creating trial account:", err.message);
      alert(
        "❌ Terjadi kesalahan saat mendaftar akun trial, silakan coba lagi: " +
          err.message
      );
    }
  };

  const multiSelectLpseOptions = lpseOptions.map((lpse) => ({
    value: lpse.value,
    label: lpse.name,
  }));

  // Helper untuk mendapatkan kelas validasi
  const getValidationClass = (field: keyof typeof validationState) => {
    if (!isSubmitted) return '';
    const state = validationState[field];
    return state === true ? 'valid' : state === false ? 'invalid' : '';
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close popup"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <div className="header-section">
          <h2 className="main-title">DAFTAR AKUN TRIAL 7 HARI</h2>
          <p className="subtitle">
            Buat akun gratis Anda sekarang dan dapatkan notifikasi harian untuk
            tender dari LPSE target Anda. Tidak perlu kartu kredit untuk
            memulai.
          </p>
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="trial-form">
            {/* Nama */}
            <div className={`input-group ${getValidationClass('name')}`}>
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                required
              />
            </div>

            <div className="form-group-inline">
              {/* Email */}
              <div className={`input-group ${getValidationClass('email')}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Masukkan email Anda"
                  required
                />
              </div>

              {/* Whatsapp */}
              <div className={`input-group ${getValidationClass('whatsapp')}`}>
                <label htmlFor="whatsapp">Nomor Whatsapp</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Masukkan nomor Whatsapp Anda"
                  required
                />
              </div>
            </div>

            {/* Kategori */}
            <div className={`radio-group ${getValidationClass('category')}`}>
              <label>Kategori (maks 1)</label>
              <div className="radio-options-grid">
                {[
                  "Pengadaan Barang",
                  "Pekerjaan Konstruksi",
                  "Jasa Konsultansi Badan Usaha Konstruksi",
                  "Jasa Konsultansi Perorangan Konstruksi",
                  "Jasa Konsultansi Perorangan Non Konstruksi",
                  "Jasa Konsultansi Badan Usaha Non Konstruksi",
                  "Pekerjaan Konstruksi Terintegrasi",
                  "Jasa Lainnya",
                ].map((category, index) => (
                  <label key={index} className="radio-option">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={formData.category === category}
                      onChange={handleRadioChange}
                      required
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Target SPSE from Supabase */}
            <div className={`input-group ${getValidationClass('targetSpse')}`}>
              <label>Target SPSE (maks {spseLimit})</label>
              <CustomMultiSelect
                options={multiSelectLpseOptions}
                defaultValue={formData.targetSpse}
                onChange={handleLpseChange}
                placeholder="Pilih SPSE"
                limit={spseLimit}
              />
            </div>

            {/* Kata Kunci */}
            <div className={`input-group ${getValidationClass('keywords')}`}>
              <label>Target Kata Kunci (maks {keywordLimit})</label>
              <div className="keywords-input-area">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="keyword-tag">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
                      className="remove-keyword-btn"
                      aria-label={`Remove keyword ${keyword}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {formData.keywords.length < keywordLimit && (
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="add-keyword-btn"
                  >
                    + Tambah Kata Kunci
                  </button>
                )}
              </div>
              {formData.keywords.length >= keywordLimit && (
                <p className="keyword-limit-msg">
                  Maksimal {keywordLimit} kata kunci
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="submit-button">
              DAFTAR SEKARANG
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;