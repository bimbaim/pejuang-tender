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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const pageSize = 5; // per page
  const limit = 15;   // max total fetched

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      setError(null);

      const start = (page - 1) * pageSize;
      const end = Math.min(start + pageSize - 1, limit - 1);

      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1).toISOString();

      // Count query
      let countQuery = supabase
        .from("lpse_tenders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfYear);

      // Filter by category
      if (selectedCategory) {
        countQuery = countQuery.eq("category", selectedCategory);
      }

      const { count, error: countError } = await countQuery;
      if (countError) {
        console.error(countError);
        setError("Gagal memuat total data tender.");
        setLoading(false);
        return;
      }
      setTotalTenders(Math.min(count || 0, limit));

      // Data query
      let dataQuery = supabase
        .from("lpse_tenders")
        .select(
          "id, title, agency, budget, source_url, qualification_method, created_at, category"
        )
        .gte("created_at", startOfYear)
        .order("id", { ascending: false })
        .range(start, end);

      if (selectedCategory) {
        dataQuery = dataQuery.eq("category", selectedCategory);
      }

      const { data, error: dataError } = await dataQuery;

      if (dataError) {
        console.error(dataError);
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
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setPage(1); // reset ke halaman 1
            setSelectedCategory(cat);
          }}
        />

        <div className={styles.tenderList}>
          {loading && <p>Memuat data tender...</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          {!loading && !error && tenders.length === 0 && (
            <p>Tidak ada data tender.</p>
          )}

          {tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))}

          {tenders.length > 0 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderContent;
