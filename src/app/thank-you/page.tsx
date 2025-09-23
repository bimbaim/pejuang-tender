// src/app/thank-you/page.tsx
"use client";

import React, { Suspense } from 'react';
import ThankYouBody from './components/ThankYouBody';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function ThankYouPage() {
  return (
    <main>
      <Navbar />
      {/* Wrap the client component that uses useSearchParams
        in a Suspense boundary to prevent the build error.
      */}
      <Suspense fallback={<div>Loading...</div>}>
        <ThankYouBody />
      </Suspense>
      <Footer />
    </main>
  );
}