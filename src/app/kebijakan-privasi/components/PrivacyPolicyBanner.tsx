// src/app/privacy-policy/components/PrivacyPolicyBanner.tsx

import React from 'react';
import styles from './PrivacyPolicyBanner.module.css'; // Import the CSS module

const PrivacyPolicyBanner = () => {
  return (
    <div className={styles.header64}> {/* Using the renamed module class */}
      <div className={styles.container}>
        <div className={styles.component}>
          <p className={styles.text1}>Kebijakan Privasi</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyBanner;