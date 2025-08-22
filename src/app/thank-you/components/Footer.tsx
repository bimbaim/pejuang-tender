import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.credits}>
          <div className={styles.row}>
            <div className={styles.group4}>
              <div className={styles.logo}>
                <Image
                  src="/images/logo-footer.png" // Placeholder for the small mascot logo in the footer
                  alt="Company Logo"
                  width={44}
                  height={44}
                />
              </div>
              <div className={styles.group5}>
                <div className={styles.footerLinks}>
                  <p className={styles.text7}>Privacy Policy</p>
                  <p className={styles.text8}>Terms of Service</p>
                  <p className={styles.text9}>Cookies Settings</p>
                </div>
                <p className={styles.text10}>© 2025 Pejuang Tender. All rights reserved.</p>
              </div>
            </div>
            <div className={styles.group6}>
              <p className={styles.text15}>Partner Pembayaran Kami</p>
              <Image
                src="/images/payment-partners.png" // Placeholder for the combined payment logos
                alt="Payment Partners"
                width={300} // Adjust these dimensions to your actual image
                height={50}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;