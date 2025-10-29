// src/app/providers/MantineProviderWrapper.tsx
"use client"; // INI WAJIB

import { MantineProvider } from '@mantine/core';

export function MantineProviderWrapper({ children }: { children: React.ReactNode }) {
  // Anda dapat menambahkan konfigurasi tema di sini
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  );
}