// This file should be saved EXACTLY as: src/components/common/TrialPopupForm.tsx
"use client"; // This component uses React hooks, so it must be a Client Component.

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CustomMultiSelect from "@/components/common/CustomMultiSelect";
import "./TrialPopupForm.css";

// Interface to define the features of the selected package
interface PackageFeatures {
  lpse?: number;
  keywords?: number;
}

// Interface for the selected package (simplified for this component)
interface SelectedPackage {
  features?: PackageFeatures;
}

// Defines the component's props, now including the selectedPackage
interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: SelectedPackage | null; // The selected package, now a required prop
}

// Interface to handle errors
interface ExtendedError extends Error {
  message: string;
}

// Interface for LPSE locations
interface LpseLocation {
  id: number;
  value: string;
  name: string;
}

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose, selectedPackage }) => {
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

  // State for LPSE options
  const [lpseOptions, setLpseOptions] = useState<LpseLocation[]>([]);

  // 🔹 Get feature limits from the selected package, with defaults
  const spseLimit = selectedPackage?.features?.lpse ?? 10;
  const keywordLimit = selectedPackage?.features?.keywords ?? 3;

  // Fetch LPSE data from Supabase when the popup opens
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

  // Handle changes for text inputs and select dropdown
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for radio buttons
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  // Handle changes for individual keyword inputs
  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData((prev) => ({ ...prev, keywords: newKeywords }));
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle adding a new empty keyword input, checking against the limit
  const handleAddKeyword = () => {
    if (formData.keywords.length < keywordLimit) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, ""],
      }));
    }
  };

  // Handler to update targetSpse from the CustomMultiSelect component
  const handleLpseChange = (selectedValues: string[]) => {
    setFormData((prev) => ({
      ...prev,
      targetSpse: selectedValues,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 1. Fetch the ID of the 'Free Trial' package dynamically
      const { data: trialPackage, error: packageError } = await supabase
        .from("packages")
        .select("id")
        .eq("name", "Free Trial")
        .single();

      if (packageError || !trialPackage) {
        console.error(
          "Error fetching trial package:",
          packageError?.message || "Trial package not found."
        );
        throw new Error(
          "Trial package not found in the database. Please ensure a package named 'Free Trial' exists."
        );
      }

      const package_id = trialPackage.id;

      // 2. Check for an existing user or create a new one
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

      // 3. Insert the new trial subscription
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
            category: [formData.category], // Convert to array
            keyword: formData.keywords,    // Already an array
            spse: formData.targetSpse,     // Already an array
          },
        ]);

      if (subscriptionError) throw subscriptionError;

      // 4. Call the API Route to send the email
      try {
        const response = await fetch('/api/sendgrid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: formData.email,
            subject: "7-Day Trial with pejuangtender.id: Daily Tender Updates in Your Email",
            templateName: "trialWelcome",
            data: {
              name: formData.name,
              trialEndDate: endDateFormatted,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to send email via API.');
        }

        console.log('Email sent successfully via API!');
      } catch (apiError: unknown) {
        const err = apiError as ExtendedError;
        console.error("Failed to send email via API:", err.message);
      }

      // 5. Close popup & redirect
      onClose();
      router.push("/thank-you");
    } catch (error: unknown) {
      const err = error as ExtendedError;
      console.error("Error creating trial account:", err.message);
      alert(
        "❌ An error occurred while registering the trial account, please try again: " +
          err.message
      );
    }
  };

  // Format LPSE options to be compatible with the CustomMultiSelect component
  const multiSelectLpseOptions = lpseOptions.map((lpse) => ({
    value: lpse.value,
    label: lpse.name,
  }));
  

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
          <h2 className="main-title">REGISTER FOR A 7-DAY TRIAL ACCOUNT</h2>
          <p className="subtitle">
            Create your free account now and get daily tender notifications from your target LPSE. No credit card required to start.
          </p>
        </div>

        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="trial-form">
            {/* Name */}
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group-inline">
              {/* Email */}
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Whatsapp */}
              <div className="input-group">
                <label htmlFor="whatsapp">Whatsapp Number</label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Enter your Whatsapp number"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="radio-group">
              <label>Category (max 1 for trial)</label>
              <div className="radio-options-grid">
                {[
                  "Pengadaan Barang",
                  "Pekerjaan Konstruksi",
                  "Jasa Konsultansi Badan Usaha Konstruksi",
                  "Jasa Konsultansi Perorangan Konstruksi",
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

            {/* 🔹 Target SPSE from Supabase */}
            <div className="input-group">
              <label>Target SPSE</label>
              <CustomMultiSelect
                options={multiSelectLpseOptions}
                defaultValue={formData.targetSpse}
                onChange={handleLpseChange}
                placeholder="Select SPSE"
                limit={spseLimit}
              />
            </div>

            {/* Keywords */}
            <div className="input-group">
              <label>Target Keywords</label>
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
              
                {/* Limit the number of keywords */}
                {formData.keywords.length < keywordLimit && (
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="add-keyword-btn"
                  >
                    + Add Keyword
                  </button>
                )}
              </div>
            
              {/* Info message if the limit has been reached */}
              {formData.keywords.length >= keywordLimit && (
                <p className="keyword-limit-msg">Maximum {keywordLimit} keywords</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="submit-button">
              REGISTER NOW
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;