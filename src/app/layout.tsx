// app/layout.tsx

import type { Metadata } from 'next';
import { Saira } from 'next/font/google';
import { Quicksand } from 'next/font/google';
import './globals.css';

// Import komponen GTM
import { GoogleTagManager } from '@next/third-parties/google';

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
        {children}
      </body>
      
      {/* Tambahkan Google Tag Manager di sini */}
      <GoogleTagManager gtmId="GTM-5VLSLXN3" />
    </html>
  );
}