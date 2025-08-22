"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TenderCard from "./TenderCard";
import TenderSidebar from "./TenderSidebar";
import styles from "./TenderContent.module.css";

interface Tender {
  id: number;
  title: string;
  agency: string;
  budget: number;
  source_url: string;
  qualification_method: string;
  category: string;
  created_at: string;
}

const TenderContent = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalTenders, setTotalTenders] = useState(0);

  // 🔹 Fetch kategori unik
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
        // Normalisasi kategori, hapus "- TA 20xx"
        const normalized = data.map((t) =>
          t.category.replace(/ - TA \d{4}$/, "")
        );

        // Buat unik
        const uniqueCategories = Array.from(new Set(normalized));
        setCategories(uniqueCategories);
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Fetch tender berdasarkan kategori + pagination
  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      setError(null);

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1).toISOString();

      // Hitung total
      let countQuery = supabase
        .from("lpse_tenders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfYear);

      if (selectedCategory) {
        countQuery = countQuery.ilike("category", `${selectedCategory}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error("Error fetching total count:", countError);
        setError("Gagal memuat total data tender.");
        setLoading(false);
        return;
      }

      setTotalTenders(count || 0);

      // Ambil data
      let dataQuery = supabase
        .from("lpse_tenders")
        .select(
          "id, title, agency, budget, source_url, qualification_method, category, created_at"
        )
        .gte("created_at", startOfYear)
        .order("id", { ascending: false })
        .range(start, end);

      if (selectedCategory) {
        dataQuery = dataQuery.ilike("category", `${selectedCategory}%`);
      }

      const { data, error: dataError } = await dataQuery;

      if (dataError) {
        console.error("Error fetching tenders:", dataError);
        setError("Gagal memuat data tender. Silakan coba lagi nanti.");
      } else {
        setTenders(data as Tender[]);
      }
      setLoading(false);
    };

    fetchTenders();
  }, [page, pageSize, selectedCategory]);

  return (
    <div className={styles.container}>
      <TenderSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className={styles.content}>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && tenders.length === 0 && <p>Tidak ada tender ditemukan.</p>}
        {!loading &&
          tenders.map((tender) => <TenderCard key={tender.id} tender={tender} />)}

        {/* 🔹 Pagination */}
        {totalTenders > pageSize && (
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {page} of {Math.ceil(totalTenders / pageSize)}
            </span>
            <button
              disabled={page === Math.ceil(totalTenders / pageSize)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderContent;
