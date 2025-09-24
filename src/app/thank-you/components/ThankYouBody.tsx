// src/app/thank-you/components/ThankYouBody.tsx
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
    // Reset the ecommerce object to avoid merging with previous events
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

const ThankYouBody = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Gunakan localStorage atau sessionStorage untuk melacak apakah event sudah dikirim
    const isPurchaseEventSent = sessionStorage.getItem('purchaseEventSent');

    // Jika event sudah pernah dikirim, jangan kirim lagi
    if (isPurchaseEventSent) {
      return;
    }

    const subscriptionId = searchParams.get('subscription_id');
    const amountStr = searchParams.get('amount');
    const packageName = searchParams.get('package_name');
    const packagePriceStr = searchParams.get('package_price');
    const packageDuration = searchParams.get('package_duration');
    const taxStr = searchParams.get('tax');

    if (!subscriptionId || !amountStr || !packageName || !packagePriceStr || !packageDuration) {
      console.error("Missing required URL parameters for purchase tracking.");
      return;
    }

    const fetchAndTrackPurchase = async () => {
      try {
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

        const amount = parseFloat(amountStr);
        const packagePrice = parseFloat(packagePriceStr);
        const tax = taxStr ? parseFloat(taxStr) : 0;
        
        if (isNaN(amount) || isNaN(packagePrice)) {
          console.error("Invalid numeric parameters in URL.");
          return;
        }

        const items: PurchaseItem[] = [{
          item_id: `${packageName.toLowerCase().replace(/\s/g, '_')}_${packageDuration}m`,
          item_name: `${packageName} - ${packageDuration} Bulan`,
          price: packagePrice,
          item_category: "Tender Package",
          item_variant: `${packageDuration} Bulan`,
          quantity: 1
        }];
        
        trackPurchase({
          transaction_id: transactionId,
          value: amount,
          items,
          tax,
          shipping: 0,
        });

        // Tandai bahwa event sudah berhasil dikirim
        sessionStorage.setItem('purchaseEventSent', 'true');

      } catch (error) {
        console.error("Error fetching transaction ID:", error);
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