import React from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.contentContainer}>
        <div className={styles.textColumn}>
          <h1 className={styles.mainHeading}>
            PANITIA MENGUMUMKAN TENDER <span className={styles.highlightText}>BARU</span>, ANDA LANGSUNG DAPAT <span className={styles.highlightText}>NOTIF</span>.
          </h1>
          <p className={styles.description}>
            Aplikasi kami memantau tender pemerintah terbaru di ratusan laman SPSE setiap hari dan langsung mengirimkan notifikasi sesuai kata kunci Anda. Tidak ada lagi tender terlewat.
          </p>
          <div className={styles.actions}>
            <button className={styles.button}>
              PILIH PAKET
            </button>
          </div>
        </div>
        <div className={styles.imageColumn}>
          <Image
            src="/images/hero-image.png" // Replace with your hero image path
            alt="Hero Image"
            width={600}
            height={600}
            className={styles.heroImage}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;