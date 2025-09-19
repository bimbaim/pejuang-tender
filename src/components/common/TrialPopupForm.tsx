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

  // State untuk melacak field yang sudah disentuh (touched)
  const [touchedState, setTouchedState] = useState({
    name: false,
    email: false,
    whatsapp: false,
    category: false,
    targetSpse: false,
    keywords: false,
  });

  // State untuk LPSE options
  const [lpseOptions, setLpseOptions] = useState<LpseLocation[]>([]);

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

  if (!isOpen) {
    return null;
  }

  const validateForm = (data: typeof formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = data.name.trim() !== "";
    const isEmailValid = emailRegex.test(data.email);
    const isWhatsappValid = data.whatsapp.trim() !== "";
    const isCategoryValid = data.category !== "";
    const isSpseValid = data.targetSpse.length > 0;
    const isKeywordsValid = data.keywords.some(keyword => keyword.trim() !== "");

    return {
      name: isNameValid,
      email: isEmailValid,
      whatsapp: isWhatsappValid,
      category: isCategoryValid,
      targetSpse: isSpseValid,
      keywords: isKeywordsValid,
    };
  };

  // Fungsi untuk memicu validasi pada field yang disentuh
  const handleBlur = (field: keyof typeof touchedState) => {
    setTouchedState(prev => ({ ...prev, [field]: true }));
    const newValidationState = validateForm(formData);
    setValidationState(newValidationState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
    handleBlur('category');
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData(prev => ({ ...prev, keywords: newKeywords }));
  };
  
  const handleRemoveKeyword = (indexToRemove: number) => {
    const newKeywords = formData.keywords.filter((_, index) => index !== indexToRemove);
    setFormData(prev => ({ ...prev, keywords: newKeywords }));
    handleBlur('keywords');
  };
  
  const handleAddKeyword = () => {
    if (formData.keywords.length < keywordLimit) {
      setFormData(prev => ({ ...prev, keywords: [...prev.keywords, ""] }));
      handleBlur('keywords');
    }
  };
  
  const handleLpseChange = (selectedValues: string[]) => {
    setFormData(prev => ({ ...prev, targetSpse: selectedValues }));
    handleBlur('targetSpse');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Tandai semua field sebagai touched sebelum validasi akhir
    setTouchedState({
      name: true,
      email: true,
      whatsapp: true,
      category: true,
      targetSpse: true,
      keywords: true,
    });
    
    // Jalankan validasi terakhir
    const formValidationResult = validateForm(formData);
    setValidationState(formValidationResult);

    const isFormValid = Object.values(formValidationResult).every(Boolean);
    if (!isFormValid) {
      console.log("Form is not valid. Please correct the errors.");
      return;
    }

    // Lanjutkan dengan logika submit ke Supabase
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
        // user_id = existingUsers[0].id;
        alert("❌ Akun Anda sudah memiliki langganan trial gratis. Silakan login atau hubungi dukungan untuk informasi lebih lanjut.");
        onClose(); // Close the form
        return; // Stop the function from proceeding
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
  
  const getValidationClass = (field: keyof typeof validationState) => {
    // Validasi hanya jika field sudah disentuh DAN status validasinya tidak null
    const state = validationState[field];
    const isTouched = touchedState[field];
    
    if (isTouched && state !== null) {
      return state === true ? 'valid' : 'invalid';
    }
    return '';
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
                onBlur={() => handleBlur('name')}
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
                  onBlur={() => handleBlur('email')}
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
                  onBlur={() => handleBlur('whatsapp')}
                  placeholder="Masukkan nomor Whatsapp Anda"
                  required
                />
              </div>
            </div>

            {/* Kategori */}
            <div className={`radio-group ${getValidationClass('category')}`}>
              <label>Kategori (maks 1)</label>
              <div className="radio-options-grid" onBlur={() => handleBlur('category')}>
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
                onBlur={() => handleBlur('targetSpse')}
                placeholder="Pilih SPSE"
                limit={spseLimit}
              />
            </div>

            {/* Kata Kunci */}
            <div className={`input-group ${getValidationClass('keywords')}`}>
              <label>Target Kata Kunci (maks {keywordLimit})</label>
              <div className="keywords-input-area" onBlur={() => handleBlur('keywords')}>
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