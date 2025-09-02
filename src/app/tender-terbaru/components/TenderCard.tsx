// File: src/components/tender/TenderCard.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TenderCard.module.css";

import type { Tender } from "@/types/tender";

interface TenderCardProps {
  tender: Tender;
}

const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
  const { id, title, agency, budget, source_url, status } =
    tender;

  return (
    <div className={styles.tenderCard}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/tender-logo.png"
          alt="Tender Logo"
          width={163}
          height={163}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <div className={styles.tags}>
            <span className={styles.tag}>{status}</span>
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.details}>
            <span className={styles.textBold}>Kode Lelang:</span> {id}
            <br />
            <span className={styles.textBold}>Unit Kerja:</span> {agency}
            <br />
            <label className={styles.hpsLabel}>
              <span className={styles.textBoldBlue}>HPS:</span>{" "}
              <span className={styles.textBlue}>{budget}</span>
            </label>
          </p>
        </div>
        <div className={styles.actions}>
          {/* Mengganti elemen <button> dengan komponen <Link> dari Next.js */}
          <Link href={source_url} passHref legacyBehavior>
            <a
              className={styles.actionButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cek Tender
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
