import React from 'react';
import styles from './TenderHeader.module.css';

const TenderHeader = () => {
  return (
    <div className={styles.headerSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.mainTitle}>Tender Pengadaan Barang dan Jasa Pemerintah Terbaru</h1>
          <p className={styles.subtitle}>Lihat detail 5 tender terbaru untuk setiap kategori</p>
        </div>
      </div>
    </div>
  );
};

export default TenderHeader;