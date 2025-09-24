// src/components/common/PackagePopupForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import CustomMultiSelect from "@/components/common/CustomMultiSelect";
import "./PackagePopupForm.css";

// Definisikan tipe untuk fitur paket
interface PackageFeatures {
  kategori?: number;
  lpse?: number;
  keywords?: number;
  email_notifikasi?: boolean;
  wa_notifikasi?: boolean;
}

// Definisikan tipe untuk data paket
interface SelectedPackage {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  features?: PackageFeatures;
}

interface PackagePopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: SelectedPackage | null;
}

interface ExtendedError extends Error {
  message: string;
}

interface LpseLocation {
  id: number;
  value: string;
  name: string;
}

// Fungsi untuk mengirim event 'add_to_cart'
function trackAddToCart(selectedPackage: SelectedPackage) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
    const item: DataLayerItem = {
      item_id: `${selectedPackage.name.toLowerCase().replace(/\s/g, '_')}_${selectedPackage.duration_months}m`,
      item_name: `${selectedPackage.name} - ${selectedPackage.duration_months} Bulan`,
      price: selectedPackage.price,
      item_category: "Tender Package",
      item_variant: `${selectedPackage.duration_months} Bulan`,
    };

    const eventData: DataLayerEvent = {
      event: "add_to_cart",
      ecommerce: {
        currency: "IDR",
        value: selectedPackage.price,
        items: [item]
      }
    };

    window.dataLayer.push(eventData);
  }
}

// Fungsi untuk mengirim event 'view_cart'
function trackViewCart(selectedPackage: SelectedPackage) {
  if (typeof window !== "undefined" && window.dataLayer) {
    const item: DataLayerItem = {
      item_id: `${selectedPackage.name.toLowerCase().replace(/\s/g, '_')}_${selectedPackage.duration_months}m`,
      item_name: `${selectedPackage.name} - ${selectedPackage.duration_months} Bulan`,
      price: selectedPackage.price,
      item_category: "Tender Package",
      item_variant: `${selectedPackage.duration_months} Bulan`,
    };

    const eventData: DataLayerEvent = {
      event: "view_cart",
      ecommerce: {
        currency: "IDR",
        value: selectedPackage.price,
        items: [item]
      }
    };

    window.dataLayer.push(eventData);
  }
}

// Tambahkan fungsi untuk event 'begin_checkout'
function trackBeginCheckout(selectedPackage: SelectedPackage) {
  if (typeof window !== "undefined" && window.dataLayer) {
    const item: DataLayerItem = {
      item_id: `${selectedPackage.name.toLowerCase().replace(/\s/g, '_')}_${selectedPackage.duration_months}m`,
      item_name: `${selectedPackage.name} - ${selectedPackage.duration_months} Bulan`,
      price: selectedPackage.price,
      item_category: "Tender Package",
      item_variant: `${selectedPackage.duration_months} Bulan`,
    };

    const eventData: DataLayerEvent = {
      event: "begin_checkout",
      ecommerce: {
        currency: "IDR",
        value: selectedPackage.price,
        items: [item]
      }
    };

    window.dataLayer.push(eventData);
  }
}

const PackagePopupForm: React.FC<PackagePopupFormProps> = ({
  isOpen,
  onClose,
  selectedPackage,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    category: [] as string[],
    targetSpse: [] as string[],
    keywords: [] as string[],
  });

  const [validationState, setValidationState] = useState({
    name: null as boolean | null,
    email: null as boolean | null,
    whatsapp: null as boolean | null,
    category: null as boolean | null,
    targetSpse: null as boolean | null,
    keywords: null as boolean | null,
  });

  const [touchedState, setTouchedState] = useState({
    name: false,
    email: false,
    whatsapp: false,
    category: false,
    targetSpse: false,
    keywords: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [lpseOptions, setLpseOptions] = useState<LpseLocation[]>([]);

  useEffect(() => {
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

    if (isOpen) {
      fetchLpseOptions();
      if (selectedPackage) {
        // ✅ Add the trackAddToCart event here
        trackAddToCart(selectedPackage);
        // ✅ The view_cart event can be triggered here as well
        trackViewCart(selectedPackage);
      }
    } else {
      setFormData({
        name: "",
        email: "",
        whatsapp: "",
        category: [],
        targetSpse: [],
        keywords: [],
      });
      setValidationState({
        name: null,
        email: null,
        whatsapp: null,
        category: null,
        targetSpse: null,
        keywords: null,
      });
      setTouchedState({
        name: false,
        email: false,
        whatsapp: false,
        category: false,
        targetSpse: false,
        keywords: false,
      });
      setIsLoading(false);
      setShowProgressBar(false);
    }
  }, [isOpen, selectedPackage]);

  if (!isOpen || !selectedPackage) return null;

  const spseLimit = selectedPackage.features?.lpse ?? 20;
  const keywordLimit = selectedPackage.features?.keywords ?? 5;
  const categoryLimit = selectedPackage.features?.kategori ?? 1;

  const validateForm = (data: typeof formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = data.name.trim() !== "";
    const isEmailValid = emailRegex.test(data.email);
    const isWhatsappValid = data.whatsapp.trim() !== "";
    const isCategoryValid = data.category.length > 0;
    const isSpseValid = data.targetSpse.length > 0;
    const isKeywordsValid = data.keywords.some(
      (keyword) => keyword.trim() !== ""
    );

    return {
      name: isNameValid,
      email: isEmailValid,
      whatsapp: isWhatsappValid,
      category: isCategoryValid,
      targetSpse: isSpseValid,
      keywords: isKeywordsValid,
    };
  };

  const handleBlur = (field: keyof typeof touchedState) => {
    setTouchedState((prev) => ({ ...prev, [field]: true }));
    setValidationState(validateForm(formData));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLpseChange = (selectedValues: string[]) => {
    setFormData((prev) => ({ ...prev, targetSpse: selectedValues }));
    handleBlur("targetSpse");
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
    handleBlur("keywords");
  };

  const handleAddKeyword = () => {
    if (formData.keywords.length < keywordLimit) {
      setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, ""] }));
      handleBlur("keywords");
    }
  };

  const handleCategoryChange = (category: string) => {
    let newCategories: string[] = [];

    if (categoryLimit === 1) {
      newCategories = [category];
    } else {
      newCategories = [...formData.category];
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter((c) => c !== category);
      } else if (newCategories.length < categoryLimit) {
        newCategories.push(category);
      }
    }
    setFormData((prev) => ({ ...prev, category: newCategories }));
    handleBlur("category");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setTouchedState({
      name: true,
      email: true,
      whatsapp: true,
      category: true,
      targetSpse: true,
      keywords: true,
    });

    const formValidationResult = validateForm(formData);
    setValidationState(formValidationResult);

    const isFormValid = Object.values(formValidationResult).every(Boolean);
    if (!isFormValid) {
      console.log("Form is not valid. Please correct the errors.");
      return;
    }

    trackBeginCheckout(selectedPackage);

    setIsLoading(true);
    setShowProgressBar(true);

    try {
      const package_id = selectedPackage.id;
      const { data: existingUsers, error: userError } = await supabase
        .from("users")
        .select("id")
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
          .select("id")
          .single();

        if (insertUserError) throw insertUserError;
        user_id = newUser.id;
      }

      const start_date = new Date();
      const end_date = new Date();
      end_date.setMonth(
        start_date.getMonth() + (selectedPackage.duration_months || 0)
      );

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

      const basePrice = selectedPackage.price;
      const totalPrice = basePrice * 1.11;

      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalPrice),
          currency: "IDR",
          customer: {
            email: formData.email,
            name: formData.name,
            whatsapp: formData.whatsapp,
          },
          subscriptionId: subscriptionData.id,
        }),
      });

      interface InvoiceResponse {
        invoiceUrl?: string;
        error?: string;
      }
      const responseData: InvoiceResponse = await response.json();

      if (!responseData.invoiceUrl) {
        throw new Error(responseData.error || "Gagal membuat invoice Xendit");
      }

      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ payment_url: responseData.invoiceUrl })
        .eq("id", subscriptionData.id);

      if (updateError) throw updateError;

      window.location.href = responseData.invoiceUrl;
    } catch (error: unknown) {
      const err = error as ExtendedError;
      console.error("Error creating subscription or invoice:", err.message);
      alert(`❌ Terjadi kesalahan: ${err.message || "Silakan coba lagi."}`);
      setIsLoading(false);
      setShowProgressBar(false);
    }
  };

  const multiSelectLpseOptions = lpseOptions.map((lpse) => ({
    value: lpse.value,
    label: lpse.name,
  }));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const totalPrice = selectedPackage.price * 1.11;

  const allCategories = [
    "Pengadaan Barang",
    "Pekerjaan Konstruksi",
    "Jasa Konsultansi Badan Usaha Konstruksi",
    "Jasa Konsultansi Perorangan Konstruksi",
    "Jasa Konsultansi Perorangan Non Konstruksi",
    "Jasa Konsultansi Badan Usaha Non Konstruksi",
    "Pekerjaan Konstruksi Terintegrasi",
    "Jasa Lainnya",
  ];

  const getValidationClass = (field: keyof typeof validationState) => {
    const state = validationState[field];
    const isTouched = touchedState[field];

    if (isTouched && state !== null) {
      return state === true ? "valid" : "invalid";
    }
    return "";
  };
  return (
    <div className="package-popup-overlay" onClick={onClose}>
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
            <sub>
              <i>*Harga belum termasuk 11% PPN</i>
            </sub>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="package-trial-form">
          <div className={`package-input-group ${getValidationClass("name")}`}>
            <label>Nama</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              required
              className="package-text-input"
            />
          </div>

          <div className="package-inline-inputs">
            <div
              className={`package-field-inline ${getValidationClass("email")}`}
            >
              <label>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                required
                className="package-text-input"
              />
            </div>
            <div
              className={`package-field-inline ${getValidationClass(
                "whatsapp"
              )}`}
            >
              <label>Nomor Whatsapp</label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                onBlur={() => handleBlur("whatsapp")}
                required
                className="package-text-input"
              />
            </div>
          </div>

          <div className={`radio-group ${getValidationClass("category")}`}>
            <label>Kategori (maks {categoryLimit})</label>
            <div
              className="radio-options-grid"
              onBlur={() => handleBlur("category")}
            >
              {allCategories.map((cat, index) => (
                <label key={index} className="radio-option">
                  <input
                    type={categoryLimit === 1 ? "radio" : "checkbox"}
                    name="category"
                    checked={
                      categoryLimit === 1
                        ? formData.category[0] === cat
                        : formData.category.includes(cat)
                    }
                    onChange={() => handleCategoryChange(cat)}
                    disabled={
                      categoryLimit > 1 &&
                      !formData.category.includes(cat) &&
                      formData.category.length >= categoryLimit
                    }
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div
            className={`package-input-group ${getValidationClass(
              "targetSpse"
            )}`}
          >
            <div className="package-field-input">
              <label>Target SPSE (maks {spseLimit})</label>
              <CustomMultiSelect
                options={multiSelectLpseOptions}
                defaultValue={formData.targetSpse}
                onChange={handleLpseChange}
                onBlur={() => handleBlur("targetSpse")}
                placeholder="Pilih SPSE"
                limit={spseLimit}
              />
            </div>
          </div>

          <div
            className={`package-input-group ${getValidationClass("keywords")}`}
          >
            <div className="package-field-input">
              <label>Target Kata Kunci (maks {keywordLimit})</label>
              <div
                className="package-keywords-input-area"
                onBlur={() => handleBlur("keywords")}
              >
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

          <input
            type="hidden"
            name="selectedPackage"
            value={JSON.stringify(selectedPackage)}
          />
          <input type="hidden" name="amount" value={Math.round(totalPrice)} />
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
              disabled={isLoading}
            >
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