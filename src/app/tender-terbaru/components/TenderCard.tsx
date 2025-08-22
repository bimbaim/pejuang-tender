import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TenderCard.module.css';

interface TenderCardProps {
  type: string;
  title: string;
  lelangCode: string;
  unitKerja: string;
  hps: string;
  lelangLink: string;
}

const TenderCard: React.FC<TenderCardProps> = ({
  type,
  title,
  lelangCode,
  unitKerja,
  hps,
  lelangLink,
}) => {
  return (
    <div className={styles.tenderCard}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/tender-logo.png" // Placeholder image for the tender
          alt="Tender Logo"
          width={163}
          height={163}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <div className={styles.tags}>
            <span className={styles.tag}>{type}</span>
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.details}>
            Kode Lelang: {lelangCode}
            <br />
            Unit Kerja: {unitKerja}
            <br />
            HPS: {hps}
          </p>
          <Link href={lelangLink} className={styles.lelangLink}>
            Link LPSE: {lelangLink}
          </Link>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton}>Cek Tender</button>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;