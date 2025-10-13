"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const pathname = usePathname(); // Get the current path

  const [isOpen, setIsOpen] = useState(false);
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

        <div className={styles.navMobile}>
          <button
            className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
            onClick={toggleMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </button>
        </div>

        {/* Menu */}
        <div className={`${styles.navLinks} ${isOpen ? styles.showMenu : ""}`}>
          <Link
            href="/"
            className={`${styles.navLink} ${
              pathname === "/" ? styles.activeLink : ""
            }`}
            onClick={closeMenu}
          >
            BERANDA
          </Link>
          <Link
            href="/tender-terbaru"
            className={`${styles.navLink} ${
              pathname === "/tender-terbaru" ? styles.activeLink : ""
            }`}
            onClick={closeMenu}
          >
            TENDER TERBARU
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
