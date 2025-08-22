// File: src/app/page.tsx
"use client";

import React, { useState } from 'react';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import PricingSection from "@/components/home/PricingSection";
import TrialPopupForm from "@/components/common/TrialPopupForm";
import PackagePopupForm from "@/components/common/PackagePopupForm";

export default function HomePage() {
  // --- Trial Popup State ---
  const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);
  const handleOpenTrialPopup = () => setIsTrialPopupOpen(true);
  const handleCloseTrialPopup = () => setIsTrialPopupOpen(false);

  // --- Package Popup State ---
  const [isPackagePopupOpen, setIsPackagePopupOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    category: string;
    price: string;
    amount: number;
    duration: number; // 3 or 12 months
  } | null>(null);

  // Open popup + pass package data
  const handleOpenPackagePopup = (pkg: { name: string; category: string; price: string; amount: number; duration: number; }) => {
    setSelectedPackage(pkg);
    setIsPackagePopupOpen(true);
  };

  const handleClosePackagePopup = () => {
    setIsPackagePopupOpen(false);
    setSelectedPackage(null);
  };


  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhyUsSection />
      <CallToActionSection onOpenPopup={handleOpenTrialPopup} />
      
      {/* PricingSection now passes selected package */}
      <PricingSection onOpenPackagePopup={handleOpenPackagePopup} />
      
      <Footer />

      {/* Popups */}
      <TrialPopupForm isOpen={isTrialPopupOpen} onClose={handleCloseTrialPopup} />

      <PackagePopupForm
        isOpen={isPackagePopupOpen}
        onClose={handleClosePackagePopup}
        selectedPackage={selectedPackage} // 👈 pass paket data here
        // selectedPackage={selectedPackage} // 👈 pass paket data here

      />
    </main>
  );
}
