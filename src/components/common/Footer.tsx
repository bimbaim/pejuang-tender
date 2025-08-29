import React from "react";
import Image from "next/image";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left Section: Logo, Links, and Copyright */}
        <div className={styles.brandInfo}>
          <div className={styles.brandInfoWrapper}>
            <div className={styles.logoGroup}>
              <Image
                src="/images/logo-footer.png"
                alt="Pejuang Tender Logo"
                width={44}
                height={44}
              />
              <p className={styles.logoText}>PEJUANG Tender</p>
            </div>
            <div className={styles.links}>
              <p className={styles.copyright}>
                © 2025 Pejuang Tender. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
