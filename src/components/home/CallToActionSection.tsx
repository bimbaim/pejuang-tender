import React from 'react';
import styles from './CallToActionSection.module.css';

type CallToActionSectionProps = {
  onOpenPopup: () => void; // function type, no arguments, no return
};

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onOpenPopup }) => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.headingColumn}>
            <h2 className={styles.mainTitle}>COBA SEKARANG, GRATIS</h2>
          </div>
          <div className={styles.textColumn}>
            <p className={styles.description}>
              Rasakan manfaat dari pejuang tender selama 7 hari tanpa biaya. 
              Cukup tentukan 1 Kategori Pekerjaan, 5 SPSE, dan 3 kata kunci Anda. 
              Notifikasi tender baru akan masuk ke email dalam 24jam.
            </p>
            <div className={styles.actions}>
              <button 
                className={styles.button} 
                onClick={onOpenPopup} 
              >
                MULAI TRIAL 7 HARI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
