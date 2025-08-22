import React from 'react';
import Image from 'next/image'; // Import the Next.js Image component
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.group10}>
            <Image
              src="/images/company-logo.png" // Path to your image in the public directory
              alt="Company Logo"
              width={100} // Set the width of the image
              height={44} // Set the height of the image
            />
            <p className={styles.text2}>PEJUANG Tender</p>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.link}>
            <p className={styles.text3}>BERANDA</p>
          </div>
          <div className={styles.link}>
            <p className={styles.text4}>TENDER TERBARU</p>
          </div>
        </div>
        <div className={styles.actions} />
      </div>
    </div>
  );
};

export default Navbar;