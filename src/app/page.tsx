"use client";

import React, { Suspense } from "react";
import HomePageContent from "@/components/home/HomePageContent";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading halaman...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
