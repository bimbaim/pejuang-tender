// src/app/term-of-use/page.tsx
"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import TermOfUseHero from "./components/TermOfUseHero"; // 1. Import the Hero Banner component
import TermOfUseBody from "./components/TermOfUseBody";

// 2. Renamed function from ThankYouPage to TermOfUsePage
export default function TermOfUsePage() {
  return (
    <main>
      <Navbar />
      
      {/* 3. Added the Hero Banner component */}
      <TermOfUseHero />
      
      {/* TODO: Add the full Terms of Use document content here */}
      <TermOfUseBody />
      
      <Footer />
    </main>
  );
}