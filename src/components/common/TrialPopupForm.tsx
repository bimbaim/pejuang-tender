// This file should be saved EXACTLY as: src/components/common/PopupForm.tsx
"use client"; // This component uses React hooks, so it must be a Client Component.

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// IMPORTANT: This path './PopupForm.css' is relative to the location of THIS .tsx file.
// So, PopupForm.css MUST be in the SAME directory as PopupForm.tsx.
import './TrialPopupForm.css';

interface PopupFormProps {
  isOpen: boolean; // Controls whether the popup is visible
  onClose: () => void; // Function to call when the popup needs to be closed
}

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  
  // State to manage all form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    category: '', // For radio buttons, will hold the selected category string
    targetSpse: '', // For select dropdown
    keywords: [] as string[], // Initial keywords (explicitly typed as string[])
  });

  // If the popup is not open, render nothing
  if (!isOpen) {
    return null;
  }

  // Handle changes for text inputs and select dropdown
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle changes for radio buttons
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  // Handle changes for individual keyword inputs
  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData(prev => ({ ...prev, keywords: newKeywords }));
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Handle adding a new empty keyword input (you might want a dedicated button for this)
  const handleAddKeyword = () => {
    setFormData(prev => ({
      ...prev,
      keywords: [...prev.keywords, ''] // Add an empty string for a new keyword input
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // 1. Fetch the ID of the 'Free Trial' package dynamically
      const { data: trialPackage, error: packageError } = await supabase
        .from('packages')
        .select('id')
        .eq('name', 'Free Trial') // Assuming your trial package is named 'Free Trial'
        .single();

      if (packageError || !trialPackage) {
        console.error("Error fetching trial package:", packageError?.message || "Trial package not found.");
        throw new Error("Trial package not found in the database. Please ensure a package named 'Free Trial' exists.");
      }

      const package_id = trialPackage.id; // Get the ID

      // 2. Check for existing user or create a new one
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

      // 3. Insert the new trial subscription using the dynamically fetched package_id
      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .insert([
          {
            user_id,
            package_id: package_id, // Use the dynamically fetched ID here
            payment_status: "free-trial", // Set payment status to 'trial'
            start_date: new Date().toISOString().split("T")[0],
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
          },
        ]);

      if (subscriptionError) throw subscriptionError;

      // 4. Close the popup and optionally redirect the user
      onClose();
      // You can redirect to a success page or display a success message
      router.push('/thank-you');

    } catch (error: any) {
      console.error("Error creating trial account:", error.message);
      alert("❌ Terjadi kesalahan saat mendaftar akun trial, silakan coba lagi: " + error.message);
    }
  };

  return (
    // Popup Overlay (fixed position to cover the whole screen)
    // Clicking on the overlay (outside the content) will close the popup
    <div className="popup-overlay" onClick={onClose}>
      {/* Popup Content Container */}
      {/* Clicking inside the content prevents the overlay's click from closing it */}
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button at the top right */}
        <button className="close-button" onClick={onClose} aria-label="Close popup">
          {/* SVG for a simple 'X' icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Header Section */}
        <div className="header-section">
          <h2 className="main-title">DAFTAR AKUN TRIAL 7 HARI</h2>
          <p className="subtitle">
            Buat akun gratis Anda sekarang dan dapatkan notifikasi harian untuk tender dari LPSE target Anda. Tidak perlu kartu kredit untuk memulai.
          </p>
        </div>

        {/* Wrapper for the scrollable form content */}
        <div className="form-wrapper">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="trial-form">
            {/* Nama (Name) Input */}
            <div className="input-group">
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

            {/* Email Input */}
            <div className="input-group">
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

            {/* Nomor Whatsapp Input */}
            <div className="input-group">
              <label htmlFor="whatsapp">Nomor Whatsapp</label>
              <input
                type="tel" // Use type="tel" for phone numbers
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="Masukkan nomor Whatsapp Anda"
                required
              />
            </div>

            {/* Kategori (Category) Radio Buttons */}
            <div className="radio-group">
              <label>Kategori</label>
              <div className="radio-options-grid">
                {[
                  'Pengadaan Barang',
                  'Pekerjaan Konstruksi',
                  'Jasa Konsultansi Badan Usaha Konstruksi',
                  'Jasa Konsultansi Perorangan Konstruksi',
                  'Jasa Konsultansi Badan Usaha Non Konstruksi',
                  'Jasa Konsultansi Perorangan Non Konstruksi',
                  'Pekerjaan Konstruksi Terintegrasi',
                  'Jasa Lainnya'
                ].map((category, index) => (
                  <label key={index} className="radio-option">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={formData.category === category}
                      onChange={handleRadioChange}
                      required // Make sure at least one category is selected
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Target SPSE (Select Dropdown) */}
            <div className="input-group">
              <label htmlFor="targetSpse">Target SPSE (https://spse.inaproc/......)</label>
              <div className="select-wrapper">
                <select
                  id="targetSpse"
                  name="targetSpse"
                  value={formData.targetSpse}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih SPSE</option>
                  <option value="LPSE A">LPSE A</option>
                  <option value="LPSE B">LPSE B</option>
                  <option value="LPSE C">LPSE C</option>
                  <option value="LPSE D">LPSE D</option>
                  {/* Add more LPSE options as needed */}
                </select>
                {/* Dummy arrow for the select dropdown, matched image */}
                {/* <img src="https://placehold.co/16x16/cccccc/ffffff?text=V" alt="Dropdown arrow" className="select-arrow" /> */}
              </div>
            </div>

            {/* Target Kata Kunci (Keywords) */}
            <div className="input-group">
              <label>Target Kata Kunci</label>
              <div className="keywords-input-area">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="keyword-tag">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    <button type="button" onClick={() => handleRemoveKeyword(index)} className="remove-keyword-btn" aria-label={`Remove keyword ${keyword}`}>
                      &times;
                    </button>
                  </div>
                ))}
                {/* Button to add more keyword inputs */}
                <button type="button" onClick={handleAddKeyword} className="add-keyword-btn">
                  + Add Keyword
                </button>
              </div>
            </div>

            {/* Submit Button */}
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