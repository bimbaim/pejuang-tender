import React from 'react';
import Link from 'next/link';
import styles from './TenderSidebar.module.css';

const TenderSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.categoryCard}>
        <p className={styles.categoryTitle}>Semua Kategori</p>
        <div className={styles.categoryLinks}>
          <Link href="#" className={styles.activeLink}>Pengadaan Barang</Link>
          <Link href="#" className={styles.link}>Pekerjaan Konstruksi</Link>
          <Link href="#" className={styles.link}>Jasa Konsultansi Badan Usaha Konstruksi</Link>
          <Link href="#" className={styles.link}>Jasa Konsultansi Perorangan Konstruksi</Link>
          <Link href="#" className={styles.link}>Jasa Konsultansi Badan Usaha Non Konstruksi</Link>
          <Link href="#" className={styles.link}>Jasa Konsultansi Perorangan Non Konstruksi</Link>
          <Link href="#" className={styles.link}>Pekerjaan Konstruksi Terintegrasi</Link>
          <Link href="#" className={styles.link}>Jasa Lainnya</Link>
        </div>
      </div>
      <div className={styles.ctaCard}>
        <p className={styles.ctaTitle}>Ingin Akses Lengkap sesuai kata kunci usaha Anda</p>
        <button className={styles.ctaButton}>COBA SEKARANG</button>
      </div>
    </div>
  );
};

export default TenderSidebar;