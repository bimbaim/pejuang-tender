"use client";

import React from 'react';
import CheckIcon from '../common/CheckIcon';
import styles from './PricingSection.module.css';

// Make sure you have this import to use the types from the global declaration file
// import {} from '@/types/globals';

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
  // Ensure dataLayer is available
  if (typeof window !== 'undefined' && window.dataLayer) {
    const item: DataLayerItem = {
      item_id: `${plan.name.toLowerCase().replace(/\s/g, '_')}_${plan.duration_months}m`,
      item_name: `${plan.name} - ${plan.duration_months} Bulan`,
      price: plan.amount,
      item_category: plan.category,
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
  }
}

const PricingCardsClient: React.FC<PricingCardsClientProps> = ({ plans, onOpenPackagePopup }) => {
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
                onClick={() => {
                  // Trigger the GTM event before opening the popup
                  trackAddToCart(plan);
                  // Call the original function to open the popup
                  onOpenPackagePopup(plan);
                }}
              >
                PILIH PAKET
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