import type { Metadata } from 'next';
import { Saira } from 'next/font/google';
import { Quicksand } from 'next/font/google';
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
      <body className={`${saira.className} ${quicksand.className}`}>
        {children}
      </body>
    </html>
  );
}