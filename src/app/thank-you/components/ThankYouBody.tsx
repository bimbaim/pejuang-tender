// src/app/thank-you/components/ThankYouBody.tsx
"use client";

import React, { useEffect } from 'react';
import styles from './ThankYouBody.module.css';
import { useSearchParams } from 'next/navigation';

// Hapus definisi tipe PurchaseItem dan PurchaseData
// Hapus juga fungsi trackPurchase

const ThankYouBody = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Gunakan sessionStorage untuk melacak apakah event sudah dikirim
    const isPurchaseEventSent = sessionStorage.getItem('purchaseEventSent');

    // Jika event sudah pernah dikirim, jangan kirim lagi
    if (isPurchaseEventSent) {
      return;
    }

    const subscriptionId = searchParams.get('subscription_id');

    // Fokus hanya pada validasi subscription_id
    if (!subscriptionId) {
      console.error("Missing required URL parameter: subscription_id.");
      return;
    }

    const fetchAndTrackPurchase = async () => {
      try {
        const res = await fetch(`/api/get-transaction-data?subscription_id=${subscriptionId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch transaction data:", data.error);
          return;
        }

        const { transactionId, value, items, tax, shipping } = data;

        if (!transactionId || !value || !items) {
          console.error("Incomplete transaction data from API.");
          return;
        }

        // Panggil fungsi trackPurchase dengan data yang sudah lengkap dari API
        // Catatan: Fungsi trackPurchase dan tipe-tipenya perlu dipindahkan ke sini atau diimpor
        trackPurchase({
          transaction_id: transactionId,
          value,
          items,
          tax: tax || 0,
          shipping: shipping || 0,
        });

        // Tandai bahwa event sudah berhasil dikirim
        sessionStorage.setItem('purchaseEventSent', 'true');

      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchAndTrackPurchase();

  }, [searchParams]);

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.textContainer}>
          <h1 className={styles.mainTitle}>TERIMA KASIH! PENDAFTARAN ANDA BERHASIL</h1>
          <p className={styles.description}>Selamat bergabung bersama Pejuang Tender. Akun Anda sudah aktif dan akan mendapatkan notifikasi harian sesuai dengan target LPSE Anda dari seluruh Indonesia.</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouBody;

// Pindahkan atau impor kembali tipe dan fungsi pelacakan di sini jika diperlukan
interface PurchaseItem {
  item_id: string;
  item_name: string;
  price: number;
  item_category: string;
  item_variant: string;
  quantity: number;
}

interface PurchaseData {
  transaction_id: string;
  value: number;
  items: PurchaseItem[];
  tax: number;
  shipping: number;
}

function trackPurchase({ transaction_id, value, items, tax, shipping }: PurchaseData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ ecommerce: null });
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