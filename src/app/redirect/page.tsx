// src/app/redirect/page.tsx
import { Suspense } from 'react';
import RedirectClient from './RedirectClient';

// This is the parent Server Component
export default function RedirectPage() {
  return (
    // CRITICAL: The Suspense boundary prevents the build from failing
    // by deferring the rendering of the client hook until the browser.
    <Suspense fallback={<div>Loading redirect...</div>}>
      <RedirectClient />
    </Suspense>
  );
}

// Optional, but recommended for pages dependent on search params
export const dynamic = 'force-dynamic';