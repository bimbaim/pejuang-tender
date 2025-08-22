// src/components/home/PricingCardsClient.tsx
"use client"; // This is a Client Component because it uses `onClick`

import React from 'react';
import CheckIcon from '../common/CheckIcon'; // Assuming this path is correct
import styles from './PricingSection.module.css'; // Assuming you want to keep CSS Modules

interface Plan {
  name: string;
  category: string;
  price: string; // This will be the formatted string like "IDR 200K"
  amount: number; // The numerical value for payment processing
  duration_months: number;
  features: string[];
  isHighlighted: boolean;
}

interface PricingCardsClientProps {
  plans: Plan[]; // Receive plans data from the Server Component
  onOpenPackagePopup: (plan: Plan) => void;
}

const PricingCardsClient: React.FC<PricingCardsClientProps> = ({ plans, onOpenPackagePopup }) => {
  // You might want to add state here for the "3 Bulan" / "12 Bulan" tab selection
  // const [selectedDuration, setSelectedDuration] = useState<number>(3); // Or "3 Bulan" string

  return (
    <div className={styles.pricingContent}>
      {/*
        You could make these tab buttons interactive here if you fetch plans
        for different durations. For simplicity, we'll assume only 3-month plans are passed.
      */}
      <div className={styles.tabButtons}>
        <button className={`${styles.tabButton} ${styles.active}`}>3 Bulan</button>
        {/* <button className={styles.tabButton} onClick={() => setSelectedDuration(12)}>12 Bulan</button> */}
      </div>
      <div className={styles.pricingCards}>
        {plans.map((plan) => (
          <div
            key={plan.name} // Using name as key, or better, use plan.id if from DB
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
                onClick={() => onOpenPackagePopup(plan)}
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
