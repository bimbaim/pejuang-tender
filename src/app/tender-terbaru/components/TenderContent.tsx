// File: src/components/tender/TenderContent.tsx

"use client";

import React, { useEffect, useState } from "react";
import styles from "./TenderContent.module.css";
import TenderSidebar from "./TenderSidebar";
import TenderCard from "./TenderCard";
import type { Tender } from "@/types/tender";

import { supabase } from "@/lib/supabase";

const TenderContent = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalTenders, setTotalTenders] = useState(0);

  const pageSize = 5; // 5 item per halaman
  const maxLimit = 15; // maksimal 15 item total

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      setError(null);

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1).toISOString();

      // Ambil total count untuk tahun berjalan
      const { count, error: countError } = await supabase
        .from("lpse_tenders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfYear);

      if (countError) {
        console.error("Error fetching total count:", countError);
        setError("Gagal memuat total data tender.");
        setLoading(false);
        return;
      }

      // Batasi maksimal hanya 15 item
      const limitedCount = Math.min(count || 0, maxLimit);
      setTotalTenders(limitedCount);

      // Ambil data tender untuk halaman saat ini (max 15 item saja)
      const { data, error: dataError } = await supabase
        .from("lpse_tenders")
        .select(
          "id, title, agency, budget, source_url, qualification_method, created_at"
        )
        .gte("created_at", startOfYear)
        .order("id", { ascending: false })
        .range(start, Math.min(end, maxLimit - 1)); // batasi max 15 item total

      if (dataError) {
        console.error("Error fetching tenders:", dataError);
        setError("Gagal memuat data tender. Silakan coba lagi nanti.");
      } else {
        setTenders(data as Tender[]);
      }
      setLoading(false);
    };

    fetchTenders();
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalTenders / pageSize);

  if (loading) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <TenderSidebar />
          <div className={styles.tenderList}>
            <p>Memuat data tender...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <TenderSidebar />
          <div className={styles.tenderList}>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (tenders.length === 0 && totalTenders === 0) {
    return (
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <TenderSidebar />
          <div className={styles.tenderList}>
            <p>Tidak ada data tender yang ditemukan.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <div className={styles.container}>
        <TenderSidebar />
        <div className={styles.tenderList}>
          {tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}

          {/* Navigasi Halaman */}
          <div className={styles.pagination}>
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Halaman {page} dari {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prevPage) => Math.min(prevPage + 1, totalPages))
              }
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderContent;
