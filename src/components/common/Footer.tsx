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
              <div className={styles.navFooter}>
                <a href="#" className={styles.link}>
                  Privacy Policy
                </a>
                <a href="#" className={styles.link}>
                  Terms of Service
                </a>
                <a href="#" className={styles.link}>
                  Cookies Settings
                </a>
              </div>
              <p className={styles.copyright}>
                © 2025 Pejuang Tender. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Payment Partners */}
        <div className={styles.paymentPartners}>
          <p className={styles.paymentTitle}>Partner Pembayaran Kami</p>
          <div className={styles.partnerLogos}>
            <Image
              src="/images/payment-partners.png"
              alt="Payment Partners"
              width={350} // Adjust width to fit your image
              height={50} // Adjust height to fit your image
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
