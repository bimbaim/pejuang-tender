// File: src/app/tender/page.tsx
"use client";

import React, { useState } from 'react';
import TenderHeader from './components/TenderHeader';
import TenderContent from './components/TenderContent';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import TrialPopupForm from '@/components/common/TrialPopupForm'; // Import popup

export default function TenderTerbaruPage() {
  const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);

  const handleOpenTrialPopup = () => setIsTrialPopupOpen(true);
  const handleCloseTrialPopup = () => setIsTrialPopupOpen(false);

  return (
    <main>
      <Navbar />
      <TenderHeader />
      {/* Teruskan fungsi pembuka popup ke TenderContent */}
      <TenderContent onOpenPopup={handleOpenTrialPopup} /> 
      <Footer />

      {/* Render popup di sini, dikontrol oleh state */}
      <TrialPopupForm
        isOpen={isTrialPopupOpen}
        onClose={handleCloseTrialPopup}
      />
    </main>
  );
}