import React from 'react';
// import Navbar from './components/Navbar';
import ThankYouBody from './components/ThankYouBody';
// import Footer from './components/Footer';
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