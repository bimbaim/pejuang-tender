// src/app/term-of-use/page.tsx
"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import TermsOfServiceHero from "./components/TermsOfServiceHero"; // 1. Import the Hero Banner component
import TermsOfServiceBody from "./components/TermsOfServiceBody"; // 2. Import the Body component


// 2. Renamed function from ThankYouPage to TermOfUsePage
export default function TermOfUsePage() {
  return (
    <main>
      <Navbar />
      
      {/* 3. Added the Hero Banner component */}
      <TermsOfServiceHero />
      
      {/* TODO: Add the full Terms of Use document content here */}
      <TermsOfServiceBody />
      
      <Footer />
    </main>
  );
}