// File: src/app/page.tsx
"use client";

import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import PricingSection from "@/components/home/PricingSection";
import TrialPopupForm from "@/components/common/TrialPopupForm";
import PackagePopupForm from "@/components/common/PackagePopupForm";

import Testimonial from "@/components/home/Testimonial";
import HowItWorks from "@/components/home/HowItWorks";

import type { Plan } from "@/types/plan";

export default function HomePage() {
  // --- Trial Popup State ---
  const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);
  const handleOpenTrialPopup = () => setIsTrialPopupOpen(true);
  const handleCloseTrialPopup = () => setIsTrialPopupOpen(false);

  // --- Package Popup State ---
  const [isPackagePopupOpen, setIsPackagePopupOpen] = useState(false);
  
  // const [selectedPackage, setSelectedPackage] = useState<{
  //   id: string;
  //   name: string;
  //   category: string;
  //   price: number;
  //   amount: number;
  //   duration: number; // 3 or 12 months
  //   duration_months?: number; // Optional, for compatibility with existing code
  // } | null>(null);

  const [selectedPackage, setSelectedPackage] = useState<Plan | null>(null);

  const handleOpenPackagePopup = (pkg: Plan) => {
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
      <Testimonial />
      <HowItWorks />
      <CallToActionSection onOpenPopup={handleOpenTrialPopup} />

      {/* PricingSection now passes selected package */}
      <PricingSection onOpenPackagePopup={handleOpenPackagePopup} />

      <Footer />

      {/* Popups */}
      <TrialPopupForm
        isOpen={isTrialPopupOpen}
        onClose={handleCloseTrialPopup}
      />

      <PackagePopupForm
        isOpen={isPackagePopupOpen}
        onClose={handleClosePackagePopup}
        selectedPackage={selectedPackage} // 👈 pass paket data here
        // selectedPackage={selectedPackage} // 👈 pass paket data here
      />
    </main>
  );
}
