import React from "react";
import styles from "./TenderSidebar.module.css";

interface TenderSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

const TenderSidebar: React.FC<TenderSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.categoryCard}>
        <p className={styles.categoryTitle}>Kategori</p>
        <div className={styles.categoryLinks}>
          <button
            className={!selectedCategory ? styles.activeLink : styles.link}
            onClick={() => onSelectCategory(null)}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                selectedCategory === cat ? styles.activeLink : styles.link
              }
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ctaCard}>
        <p className={styles.ctaTitle}>
          Ingin Akses Lengkap sesuai kata kunci usaha Anda
        </p>
        <button className={styles.ctaButton}>COBA SEKARANG</button>
      </div>
    </div>
  );
};

export default TenderSidebar;
