"use client"; 

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import { usePathname } from 'next/navigation'; // Import usePathname hook
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoGroup}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/company-logo.png"
              alt="Pejuang Tender Logo"
              width={130}
              height={44}
            />
          </Link>
        </div>
        <div className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.activeLink : ''}`}>
            BERANDA
          </Link>
          <Link href="/tender-terbaru" className={`${styles.navLink} ${pathname === '/tender-terbaru' ? styles.activeLink : ''}`}>
            PAKET LELANG TERBARU
          </Link>
        </div>
        <div className={styles.actions}>
          {/* Add actions like login/signup buttons here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;