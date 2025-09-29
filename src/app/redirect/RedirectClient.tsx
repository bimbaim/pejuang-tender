// src/app/redirect/RedirectClient.tsx
'use client'; // CRITICAL: Required for useSearchParams and useEffect

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RedirectClient() {
  const searchParams = useSearchParams();
  
  // Safely check for searchParams before calling .get()
  const urlParam = searchParams ? searchParams.get('url') : null;

  useEffect(() => {
    if (urlParam) {
      try {
        const target = decodeURIComponent(urlParam as string);
        window.location.href = target;
      } catch (error) {
        console.error("Failed to decode or redirect:", error);
      }
    }
  }, [urlParam]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Redirecting...</h1>
    </div>
  );
}