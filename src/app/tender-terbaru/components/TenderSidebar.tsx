// File: src/components/tender/TenderSidebar.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./TenderSidebar.module.css";
import { supabase } from "@/lib/supabase";

interface TenderSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const TenderSidebar: React.FC<TenderSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("lpse_tenders")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      if (data) {
        // Extract unique categories
        const unique = Array.from(
          new Set(data.map((item) => item.category).filter(Boolean))
        ) as string[];
        setCategories(unique);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.categoryCard}>
        <p className={styles.categoryTitle}>Semua Kategori</p>
        <div className={styles.categoryLinks}>
          <button
            onClick={() => onSelectCategory(null)}
            className={
              selectedCategory === null ? styles.activeLink : styles.link
            }
          >
            Semua
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={
                selectedCategory === cat ? styles.activeLink : styles.link
              }
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
