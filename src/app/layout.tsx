// src/app/layout.tsx

import type { Metadata } from 'next';
import { Saira } from 'next/font/google';
import { Quicksand } from 'next/font/google';
import './globals.css';

// 🚀 Tambahan Mantine
import '@mantine/core/styles.css'; // WAJIB: Import CSS Mantine
import { MantineProviderWrapper } from './providers/MantineProviderWrapper'; // Import Provider

// Import kedua komponen
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

const saira = Saira({ subsets: ['latin'] });
const quicksand = Quicksand({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pejuang Tender',
  description: 'Sistem notifikasi tender otomatis',
  icons: {
    icon: '/logo-footer.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${saira.className} ${quicksand.className}`}>
        {/* 🚀 Bungkus children dengan MantineProviderWrapper */}
        <MantineProviderWrapper>
          {children}
        </MantineProviderWrapper>
      </body>
      
      {/* Tambahkan Google Tag Manager */}
      <GoogleTagManager gtmId="GTM-5VLSLXN3" />

      {/* Tambahkan Google Analytics */}
      {/* <GoogleAnalytics gaId="G-CRE8KHKB2J" /> */}
    </html>
  );
}