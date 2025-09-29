// src/app/redirect/page.tsx
'use client'; 

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RedirectPage() {
  const searchParams = useSearchParams();
  
  // 💡 Check if searchParams exists before trying to access its methods
  const urlParam = searchParams ? searchParams.get('url') : null;

  useEffect(() => {
    // We already check for null in the urlParam definition above,
    // but the null check here is still good practice.
    if (urlParam) {
      try {
        // Decode the URL parameter
        const target = decodeURIComponent(urlParam as string);
        
        // Perform the immediate redirect
        window.location.href = target;
      } catch (error) {
        console.error("Failed to decode or redirect:", error);
        // Add a fallback action here if needed
      }
    }
  }, [urlParam]); // Dependencies array simplified to just urlParam

  // Display a loading message while the effect runs
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Redirecting...</h1>
      <p>Please wait while we send you to the SPSE page.</p>
    </div>
  );
}