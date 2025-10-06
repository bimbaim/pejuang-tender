"use client";

import React, { useEffect, useMemo } from 'react';
import styles from './ThankYouBody.module.css';
import { useSearchParams } from 'next/navigation';

// Mendefinisikan tipe untuk item yang akan dikirim ke dataLayer
interface PurchaseItem {
  item_id: string;
  item_name: string;
  price: number;
  item_category: string;
  item_variant: string;
  quantity: number;
}

// Mendefinisikan tipe untuk data yang akan dikirim ke fungsi trackPurchase
interface PurchaseData {
  transaction_id: string;
  value: number;
  items: PurchaseItem[];
  tax: number;
  shipping: number;
}

// Static data untuk Free Trial (sesuai permintaan user)
const FREE_TRIAL_ITEM: PurchaseItem = {
  item_id: "free_trial_7d",
  item_name: "Free Trial - 7 Hari",
  price: 0,
  item_category: "Trial Package",
  item_variant: "7 Hari",
  quantity: 1
};


// Fungsi untuk push event 'purchase' ke dataLayer
function trackPurchase({ transaction_id, value, items, tax, shipping }: PurchaseData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    // Reset objek ecommerce untuk menghindari penggabungan dengan event sebelumnya
    window.dataLayer.push({ ecommerce: null });

    // Langsung push objek dengan literal string yang benar
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id,
        affiliation: "Tender Subscriptions",
        currency: "IDR",
        value,
        tax,
        shipping,
        items
      }
    });
  }
}

const ThankYouBody = () => {
  const searchParams = useSearchParams();
  
  // Ambil parameter dari URL
  const subscriptionId = searchParams?.get('subscription_id') || null;
  const packageType = searchParams?.get('package') || null;
  
  // Tentukan konten yang akan ditampilkan berdasarkan tipe paket
  const isTrial = packageType === 'trial';

  // Isi dinamis untuk UI
  const { title, description } = useMemo(() => {
    if (isTrial) {
      return {
        title: "SELAMAT! AKUN TRIAL ANDA SUDAH AKTIF",
        description: "Selamat bergabung bersama Pejuang Tender. Akun Trial 7 hari Anda sudah aktif dan akan mendapatkan notifikasi harian sesuai dengan target LPSE Anda dari seluruh Indonesia. Silakan cek email Anda untuk detail aktivasi.",
      };
    }
    // Konten untuk langganan berbayar
    return {
      title: "TERIMA KASIH! PEMBAYARAN ANDA BERHASIL",
      description: "Selamat bergabung bersama Pejuang Tender. Akun Anda sudah aktif dan akan mendapatkan notifikasi harian sesuai dengan target LPSE Anda dari seluruh Indonesia.",
    };
  }, [isTrial]);

  useEffect(() => {
    const sessionStorageKey = `purchaseEventSent_${subscriptionId}`;
    const isPurchaseEventSent = sessionStorage.getItem(sessionStorageKey);

    // Gunakan subscriptionId dalam kunci sessionStorage agar setiap langganan baru dicatat
    if (isPurchaseEventSent || !subscriptionId) {
      if (!subscriptionId) {
        console.error("Missing required URL parameter: subscription_id.");
      }
      return;
    }
    
    // --- Logika untuk Trial (package=trial) ---
    if (isTrial) {
      const trialData: PurchaseData = {
        // Menggunakan subscriptionId sebagai bagian dari transaction_id untuk unik
        transaction_id: `TRIAL-${subscriptionId}`, 
        value: 0,
        tax: 0,
        shipping: 0,
        items: [FREE_TRIAL_ITEM]
      };

      trackPurchase(trialData);
      sessionStorage.setItem(sessionStorageKey, 'true');
      console.log("Free Trial purchase event tracked statically.");
      return;
    }
    // --- Akhir Logika Trial ---

    // --- Logika untuk Langganan Berbayar (Default) ---
    const fetchAndTrackPurchase = async () => {
      try {
        // Panggil API untuk mendapatkan semua data transaksi yang diperlukan
        const res = await fetch(`/api/get-transaction-data?subscription_id=${subscriptionId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch transaction data:", data.error);
          return;
        }
        
        // Memeriksa kelengkapan data dari API
        const { transactionId, value, items, tax, shipping } = data;
        if (!transactionId || !value || !items) {
          console.error("Incomplete transaction data from API.");
          return;
        }

        // Panggil fungsi trackPurchase dengan data yang sudah lengkap dari API
        trackPurchase({
          transaction_id: transactionId,
          value,
          items,
          tax: tax || 0,
          shipping: shipping || 0,
        });

        // Tandai bahwa event sudah berhasil dikirim
        sessionStorage.setItem(sessionStorageKey, 'true');
        console.log("Paid purchase event tracked dynamically.");

      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchAndTrackPurchase();

  }, [isTrial, subscriptionId]); // Dependensi diperbarui

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.textContainer}>
          {/* Judul dinamis berdasarkan packageType */}
          <h1 className={styles.mainTitle}>{title}</h1> 
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouBody;
