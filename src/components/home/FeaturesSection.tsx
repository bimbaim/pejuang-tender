import React from "react";
import Image from "next/image";
import styles from "./FeaturesSection.module.css";

const FeaturesSection = () => {
  const features = [
    {
      text: "Lelah buka portal LPSE satu-persatu?",
      icon: "/images/icon-1.png",
    },
    {
      text: "Terlalu banyak informasi tidak relevan?",
      icon: "/images/icon-2.png",
    },
    { text: "Sering kelewatan jadwal tender?", icon: "/images/icon-3.png" },
    {
      text: "Tidak cukup waktu untuk siapkan dokumen tender?",
      icon: "/images/icon-4.png",
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <Image
                  src={feature.icon}
                  alt="Feature Icon"
                  width={48}
                  height={48}
                />
              </div>
              <p className={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
