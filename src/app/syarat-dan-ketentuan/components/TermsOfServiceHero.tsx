// TermsOfServiceHero.tsx

import React from 'react';
import styles from './TermsOfServiceHero.module.css'; // 1. Import the CSS module

// It's a good practice to use PascalCase for component names (e.g., TermOfUseHero)
const TermOfUseHero = () => { 
  return (
    // 2. Use styles object for class names
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.component}>
          <p className={styles.text}>Syarat dan Ketentuan</p>
        </div>
      </div>
    </div>
  );
};

export default TermOfUseHero;