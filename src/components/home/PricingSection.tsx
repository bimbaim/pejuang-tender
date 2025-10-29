"use client";

import React, { useEffect, useState } from "react";
import CheckIcon from "../common/CheckIcon";
import styles from "./PricingSection.module.css";
// import { supabase } from "@/lib/supabase"; // 🚫 TIDAK DIGUNAKAN LAGI

// Definisikan tipe untuk fitur paket
interface Features {
  kategori?: number;
  lpse?: number;
  keywords?: number;
  email_notifikasi?: boolean;
  wa_notifikasi?: boolean;
}

// Definisikan tipe untuk data paket dari Supabase
interface Plan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  amount: number;
  features: Features;
  isHighlighted: boolean;
  category: string;
  duration: number;
}

interface PricingSectionProps {
  onOpenPackagePopup: (plan: Plan) => void;
  // 🚀 PERUBAHAN: Menerima data dan status loading sebagai props
  plansData: Plan[]; 
  loading: boolean;
  loadingSubscription?: boolean;
}

// Fungsi untuk mengirim event ke DataLayer
const pushViewItemListEvent = (plans: Plan[], duration: number) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    const items = plans.map(plan => ({
      item_id: `${plan.name.toLowerCase().replace(/\s/g, '_')}_${plan.duration_months}m`,
      item_name: `${plan.name} - ${plan.duration_months} Bulan`,
      price: plan.price,
      item_category: "Tender Package",
      item_variant: `${plan.duration_months} Bulan`
    }));

    window.dataLayer.push({
      event: "view_item_list",
      ecommerce: {
        item_list_id: `subscription_packages_${duration}m`,
        item_list_name: `Tender Packages - ${duration} Bulan`,
        items: items
      }
    });
  }
};

const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenPackagePopup,
  plansData, // Dari props
  loading,   // Dari props
}) => {
  // 🚫 HAPUS SEMUA STATE & FETCHING LAMA

  const [activeTab, setActiveTab] = useState<number>(3); // default 3 bulan

  // Efek untuk mengirim event DataLayer - menggunakan plansData dari props
  useEffect(() => {
    if (plansData.length > 0) {
      const filtered = plansData.filter((p) => p.duration_months === activeTab);
      pushViewItemListEvent(filtered, activeTab);
    }
  }, [plansData, activeTab]);

  // 🚀 PERBAIKAN: Hanya satu blok loading check
  if (loading) { 
    return <p className={styles.loading}>Loading packages...</p>;
  }

  // 🚀 PERBAIKAN: Deklarasi filteredPlans yang benar
  const filteredPlans = plansData.filter((p: Plan) => p.duration_months === activeTab);
  
  // 🚀 PERBAIKAN: Mengurutkan plansData berdasarkan harga secara ASCENDING (terkecil ke terbesar).
  // Menggunakan spread operator [...] untuk membuat salinan array agar tidak memodifikasi state props secara langsung.
  const finalPlans = [...filteredPlans].sort((a, b) => a.price - b.price); 
  
  const formatPrice = (amount: number) => {
    if (amount >= 1000) {
      const amountInK = amount / 1000;
      return `IDR ${amountInK.toLocaleString("id-ID")}K`;
    }
    return `IDR ${amount.toLocaleString("id-ID")}`;
  };

  const renderFeatures = (features: Features) => {
    const list: string[] = [];
    if (features.kategori) list.push(`Maks ${features.kategori} Kategori`);
    if (features.lpse) list.push(`Maks ${features.lpse} LPSE`);
    if (features.keywords) list.push(`Maks ${features.keywords} Keywords`);
    if (features.email_notifikasi) list.push("Email Notifikasi");
    if (features.wa_notifikasi) list.push("WhatsApp Notifikasi");
    return list;
  };

  // Hardcoded names dan highlight harus disesuaikan dengan urutan tampilan: [Prajurit, Komandan, Jendral]
  const finalHardcodedNames = [
    "Prajurit Tender",
    "Komandan Tender",
    "Jendral Tender",
  ];
  const finalHardcodedHighlight = [false, true, false];


  return (
    <section id="paket" className={styles.pricingSection}>
      <div className={styles.container}>
        <div className={styles.titleGroup}>
          <p className={styles.subtitle}>Pilih Paket Anda</p>
          <h2 className={styles.mainTitle}>INFO Tender Sesuai TARGET Anda</h2>
          <p className={styles.description}>
            Akses data tender dari ratusan LPSE, notifikasi harian sesuai
            kebutuhan, hindari ketinggalan jadwal, dan memaksimalkan kemenangan
            Anda.
          </p>
        </div>
        <div className={styles.pricingContent}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabButton} ${
                activeTab === 3 ? styles.active : ""
              }`}
              onClick={() => setActiveTab(3)}
            >
              3 Bulan
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 12 ? styles.active : ""
              }`}
              onClick={() => setActiveTab(12)}
            >
              12 Bulan
            </button>
          </div>
          <div className={styles.pricingCards}>
            {/*
              ACTION: Menggunakan finalPlans yang sudah diurutkan berdasarkan harga (ascending)
            */}
            {finalPlans.map((plan, index) => {
              const customPlan: Plan = {
                ...plan,
                name: finalHardcodedNames[index] ?? plan.name,
                isHighlighted: finalHardcodedHighlight[index] ?? false,
              };

              return (
                <div
                  key={customPlan.id}
                  className={`${styles.pricingCard} ${
                    customPlan.isHighlighted ? styles.highlightedCard : ""
                  }`}
                >
                  <div className={styles.priceHeader}>
                    <h3 className={styles.planName}>{customPlan.name}</h3>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.priceDetails}>
                    <p className={styles.price}>
                      {formatPrice(customPlan.price)}
                    </p>
                    <button
                      className={`${styles.ctaButton} ${
                        customPlan.isHighlighted ? styles.highlightedButton : ""
                      }`}
                      onClick={() => onOpenPackagePopup(customPlan)}
                    >
                      PILIH PAKET
                    </button>
                  </div>
                  <div className={styles.divider} />
                  <ul className={styles.featureList}>
                    {renderFeatures(customPlan.features).map((feature, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <CheckIcon />
                        <p className={styles.featureText}>{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {filteredPlans.length === 0 && (
              <p className={styles.noPlans}>
                Tidak ada paket untuk {activeTab} bulan
              </p>
            )}
          </div>
        </div>
        <div className={styles.taxNoteContainer}>
          <p className={styles.taxNote}>
            <i>*Harga belum termasuk PPN 11%</i>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
