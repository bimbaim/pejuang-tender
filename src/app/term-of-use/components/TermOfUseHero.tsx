// TermOfUseHero.tsx

import React from 'react';
import styles from './TermOfUseHero.module.css'; // 1. Import the CSS module

// It's a good practice to use PascalCase for component names (e.g., TermOfUseHero)
const TermOfUseHero = () => { 
  return (
    // 2. Use styles object for class names
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.component}>
          <p className={styles.text}>Website Terms of Use</p>
        </div>
      </div>
    </div>
  );
};

export default TermOfUseHero;