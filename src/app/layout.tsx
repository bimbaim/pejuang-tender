import type { Metadata } from 'next';
import { Saira } from 'next/font/google';
import { Quicksand } from 'next/font/google';
import Script from 'next/script'; // Import the Script component
import './globals.css';

const saira = Saira({ subsets: ['latin'] });
const quicksand = Quicksand({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pejuang Tender',
  description: 'Sistem notifikasi tender otomatis',
  icons: {
    icon: '/logo-footer.png', // Favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-CRE8KHKB2J"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CRE8KHKB2J');
          `}
        </Script>
      </head>
      <body className={`${saira.className} ${quicksand.className}`}>
        {children}
      </body>
    </html>
  );
}