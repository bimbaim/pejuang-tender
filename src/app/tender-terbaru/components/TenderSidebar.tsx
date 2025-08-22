import React from "react";
import styles from "./TenderSidebar.module.css";

interface TenderSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const TenderSidebar: React.FC<TenderSidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.categoryCard}>
        <p className={styles.categoryTitle}>Semua Kategori</p>
        <div className={styles.categoryLinks}>
          <button
            onClick={() => onSelectCategory(null)}
            className={selectedCategory === null ? styles.activeLink : styles.link}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={selectedCategory === cat ? styles.activeLink : styles.link}
            >
              {cat}
            </button>
          ))}
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
