"use client";

import React, { useEffect } from 'react';
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

// Fungsi untuk push event 'purchase' ke dataLayer
function trackPurchase({ transaction_id, value, items, tax, shipping }: PurchaseData) {
  if (typeof window !== 'undefined' && window.dataLayer) {
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

  useEffect(() => {
    // 1. Ambil subscription_id dari URL
    const subscriptionId = searchParams.get('subscription_id');
    const amountStr = searchParams.get('amount');
    const packageName = searchParams.get('package_name');
    const packagePriceStr = searchParams.get('package_price');
    const packageDuration = searchParams.get('package_duration');
    const taxStr = searchParams.get('tax');

    // 2. Pastikan data penting yang dibutuhkan dari URL sudah ada
    if (
      !subscriptionId ||
      !amountStr ||
      !packageName ||
      !packagePriceStr ||
      !packageDuration
    ) {
      console.error("Missing required URL parameters for purchase tracking.");
      return;
    }

    const fetchTransactionId = async () => {
      try {
        // 3. Panggil API baru untuk mendapatkan transaction_id dari backend
        const res = await fetch(`/api/get-transaction-data?subscription_id=${subscriptionId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch transaction ID:", data.error);
          return;
        }

        const { transactionId } = data;

        if (!transactionId) {
          console.error("Transaction ID is missing in the API response.");
          return;
        }

        // 4. Ubah string ke number dengan aman
        const amount = parseFloat(amountStr);
        const packagePrice = parseFloat(packagePriceStr);
        const tax = taxStr ? parseFloat(taxStr) : 0;

        // Pastikan nilai-nilai numerik valid
        if (isNaN(amount) || isNaN(packagePrice)) {
          console.error("Invalid numeric parameters in URL.");
          return;
        }

        // 5. Buat item untuk pelacakan menggunakan data yang lengkap
        const items: PurchaseItem[] = [{
          item_id: `${packageName.toLowerCase().replace(/\s/g, '_')}_${packageDuration}m`,
          item_name: `${packageName} - ${packageDuration} Bulan`,
          price: packagePrice,
          item_category: "Tender Package",
          item_variant: `${packageDuration} Bulan`,
          quantity: 1
        }];
        
        // 6. Panggil fungsi pelacakan dengan data yang sudah divalidasi dan memiliki tipe
        trackPurchase({
          transaction_id: transactionId,
          value: amount,
          items,
          tax,
          shipping: 0,
        });

      } catch (error) {
        console.error("Error fetching transaction ID:", error);
      }
    };

    fetchTransactionId();

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