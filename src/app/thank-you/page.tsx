"use client";

import React from 'react';
import ThankYouBody from './components/ThankYouBody';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ThankYouPage() {
  return (
    <main>
      <Navbar />
      <ThankYouBody />
      <Footer />
    </main>
  );
}