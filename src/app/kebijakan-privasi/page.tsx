// src/app/privacy-policy/page.tsx
"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PrivacyPolicyBanner from "./components/PrivacyPolicyBanner"; // 1. Import the Hero Banner component
import PrivacyPolicyBody from "./components/PrivacyPolicyBody";


// 2. Renamed function from ThankYouPage to TermOfUsePage
export default function TermOfUsePage() {
  return (
    <main>
      <Navbar />
        {/* 3. Added the Hero Banner component */}
        <PrivacyPolicyBanner />
        <PrivacyPolicyBody />
      <Footer />
    </main>
  );
}