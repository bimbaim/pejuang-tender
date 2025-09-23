// src/components/common/PricingCardsClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import CheckIcon from '../common/CheckIcon';
import styles from './PricingSection.module.css';

interface Plan {
  name: string;
  category: string;
  price: string;
  amount: number;
  duration_months: number;
  features: string[];
  isHighlighted: boolean;
}

interface PricingCardsClientProps {
  plans: Plan[];
  onOpenPackagePopup: (plan: Plan) => void;
}

/**
 * 2. ADD TO CART (trigger when user clicks "Pilih Paket")
 */
function trackAddToCart(plan: Plan) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    const item: DataLayerItem = {
      item_id: `${plan.name.toLowerCase().replace(/\s/g, '_')}_${plan.duration_months}m`,
      item_name: `${plan.name} - ${plan.duration_months} Bulan`,
      price: plan.amount,
      item_category: "Tender Package",
      item_variant: `${plan.duration_months} Bulan`,
    };

    const eventData: DataLayerEvent = {
      event: "add_to_cart",
      ecommerce: {
        currency: "IDR",
        value: plan.amount,
        items: [item]
      }
    };

    window.dataLayer.push(eventData);
    console.log("DataLayer Event Pushed:", eventData);
  }
  console.log(`trackAddToCart: ${plan.name} - ${plan.duration_months} Bulan - ${plan.amount}`);
}

const PricingCardsClient: React.FC<PricingCardsClientProps> = ({ plans, onOpenPackagePopup }) => {
  // ✅ State to manage the loading/waiting indicator
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

  // ✅ useEffect to handle the delayed action
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isWaiting && currentPlan) {
      // Start the timer to open the popup after 500ms
      timeoutId = setTimeout(() => {
        setIsWaiting(false); // Stop waiting
        onOpenPackagePopup(currentPlan); // Open the popup
      }, 500);
    }

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isWaiting, currentPlan, onOpenPackagePopup]);

  const handlePilihPaketClick = (plan: Plan) => {
    // 1. Trigger the GTM event immediately
    trackAddToCart(plan);
    // 2. Set the state to "waiting" and store the current plan
    setIsWaiting(true);
    setCurrentPlan(plan);
  };
  
  return (
    <div className={styles.pricingContent}>
      <div className={styles.tabButtons}>
        <button className={`${styles.tabButton} ${styles.active}`}>3 Bulan</button>
      </div>
      <div className={styles.pricingCards}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`${styles.pricingCard} ${plan.isHighlighted ? styles.highlightedCard : ''}`}
          >
            <div className={styles.priceHeader}>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planCategory}>{plan.category}</p>
            </div>
            <div className={styles.divider} />
            <div className={styles.priceDetails}>
              <p className={styles.price}>{plan.price}</p>
              <button
                className={`${styles.ctaButton} ${plan.isHighlighted ? styles.highlightedButton : ''}`}
                // ✅ Use the new click handler
                onClick={() => handlePilihPaketClick(plan)}
                disabled={isWaiting} // ✅ Disable the button while waiting
              >
                {isWaiting ? "MEMPROSES..." : "PILIH PAKET"}
              </button>
            </div>
            <div className={styles.divider} />
            <ul className={styles.featureList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <CheckIcon />
                  <p className={styles.featureText}>{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCardsClient;