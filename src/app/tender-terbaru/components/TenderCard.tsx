// File: src/components/tender/TenderCard.tsx

// import React from "react";
import React, { useState } from "react"; 
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

  // State to track if the agency logo image failed to load
  const [imageError, setImageError] = useState(false);

  // Clean and format the agency name for the image URL
  const formattedAgencyName = agency
    .toLowerCase()
    .replace(/\./g, "") // Remove all periods
    .replace(/\//g, "-") // Replace all slashes with hyphens
    .replace(/\s+/g, "-"); // Replace all spaces with a single hyphen

  // Construct the new image source URL
  const dynamicImageSrc = `/images/logo/${formattedAgencyName}.png`;

  // Determine the final image source based on the error state
  const finalImageSrc = imageError ? "/images/image-coming-soon.jpg" : dynamicImageSrc;


  return (
    <div className={styles.tenderCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={finalImageSrc}
          alt={`${agency} Logo`}
          width={163}
          height={163}
          // The onError prop is a callback that runs if the image fails to load.
          // We set the imageError state to true, which triggers a re-render.
          onError={() => setImageError(true)}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <div className={styles.tags}>
            <span className={styles.tag}>{status.replace(/\[.*\]/g, '').trim()}</span>
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
          <Link
            href={source_url}
            className={styles.actionButton}
            target="_blank"
          >
            Cek Tender
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
