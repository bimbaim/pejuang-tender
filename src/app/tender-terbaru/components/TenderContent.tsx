"use client";

import React, { useEffect, useState } from "react";
import styles from "./TenderContent.module.css";
import TenderSidebar from "./TenderSidebar";
import TenderCard from "./TenderCard";
import type { Tender } from "@/types/tender";
import { supabase } from "@/lib/supabase";

const TenderContent = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalTenders, setTotalTenders] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const pageSize = 5;
  const limit = 15; // max item


// ✅ Fetch kategori sekali saja (tahun berjalan)
useEffect(() => {
  const fetchCategories = async () => {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).toISOString();

    const { data, error } = await supabase
      .from("lpse_tenders")
      .select("category")
      .gte("created_at", startOfYear)
      .not("category", "is", null);

    if (!error && data) {
      const normalizedCategories = data.map((t) =>
        t.category.replace(/\s*-\s*.*$/, "") // hapus " - ..." termasuk tanda "-"
      );
      const uniqueCategories = Array.from(new Set(normalizedCategories));

      // ✅ Urutkan Z → A
      let sortedCategories = uniqueCategories.sort((a, b) =>
        b.localeCompare(a)
      );

      // ✅ Pastikan "Jasa Lainnya" selalu di akhir
      sortedCategories = sortedCategories.filter(cat => cat !== "Jasa Lainnya");
      sortedCategories.push("Jasa Lainnya");

      setCategories(sortedCategories);
    }

  };

  fetchCategories();
}, []);



  // ✅ Fetch tender tiap kali page/category berubah
  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      setError(null);

      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1).toISOString();

      const start = (page - 1) * pageSize;
      const end = Math.min(start + pageSize - 1, limit - 1);

      let countQuery = supabase
        .from("lpse_tenders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfYear);

      if (selectedCategory) {
        countQuery = countQuery.ilike("category", `${selectedCategory}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        setError("Gagal memuat total data tender.");
        setLoading(false);
        return;
      }
      setTotalTenders(Math.min(count || 0, limit));

      let dataQuery = supabase
        .from("lpse_tenders")
        .select("id, title, agency, budget, source_url, qualification_method, created_at, category")
        .gte("created_at", startOfYear)
        .order("id", { ascending: false })
        .range(start, end);

      if (selectedCategory) {
        dataQuery = dataQuery.ilike("category", `${selectedCategory}%`);
      }

      const { data, error: dataError } = await dataQuery;

      if (dataError) {
        setError("Gagal memuat data tender.");
      } else {
        setTenders(data as Tender[]);
      }

      setLoading(false);
    };

    fetchTenders();
  }, [page, pageSize, selectedCategory]);

  const totalPages = Math.ceil(totalTenders / pageSize);

  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>
        <TenderSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setPage(1);
          }}
        />
        <div className={styles.tenderList}>
          {loading ? (
            <p>Memuat data tender...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : tenders.length === 0 ? (
            <p>Tidak ada data tender ditemukan.</p>
          ) : (
            <>
              {tenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
              <div className={styles.pagination}>
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                  Previous
                </button>
                <span>Halaman {page} dari {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderContent;
