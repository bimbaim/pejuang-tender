// src/components/common/ThankYouBody.tsx

"use client";

import React, { useEffect } from 'react';
import styles from './ThankYouBody.module.css';
import { useSearchParams } from 'next/navigation';

// Pastikan file deklarasi global Anda sudah benar dan tidak ada import
// Anda tidak memerlukan import di sini jika tsconfig.json sudah benar

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
// Sekarang fungsi ini sepenuhnya aman dan memiliki tipe yang jelas
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
    // Ambil data, pastikan untuk menangani kemungkinan null dengan aman
    const transactionId = searchParams.get('xendit_invoice_id');
    const amountStr = searchParams.get('amount');
    const packageName = searchParams.get('package_name');
    const packagePriceStr = searchParams.get('package_price');
    const packageDuration = searchParams.get('package_duration');
    const taxStr = searchParams.get('tax');

    // Pastikan semua data penting ada sebelum melanjutkan
    if (
      !transactionId ||
      !amountStr ||
      !packageName ||
      !packagePriceStr ||
      !packageDuration
    ) {
      console.error("Missing required URL parameters for purchase tracking.");
      return; // Hentikan eksekusi jika ada data yang hilang
    }

    // Ubah string ke number dengan aman
    const amount = parseFloat(amountStr);
    const packagePrice = parseFloat(packagePriceStr);
    const tax = taxStr ? parseFloat(taxStr) : 0;

    // Pastikan nilai-nilai numerik valid
    if (isNaN(amount) || isNaN(packagePrice)) {
      console.error("Invalid numeric parameters in URL.");
      return;
    }

    // Buat item untuk pelacakan
    const items: PurchaseItem[] = [{
      item_id: `${packageName.toLowerCase().replace(/\s/g, '_')}_${packageDuration}m`,
      item_name: `${packageName} - ${packageDuration} Bulan`,
      price: packagePrice,
      item_category: "Tender Package",
      item_variant: `${packageDuration} Bulan`,
      quantity: 1
    }];
    
    // Panggil fungsi pelacakan dengan data yang telah divalidasi dan memiliki tipe
    trackPurchase({
      transaction_id: transactionId,
      value: amount,
      items,
      tax,
      shipping: 0,
    });

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