import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import styles from './HowItWorks.module.css';

const HowItWorks: React.FC = () => {
    
    // Helper function to render the set of overlapping/rotated images
    const ImageGroup: React.FC<{ groupName: string; size: 'large' | 'small' }> = ({ groupName, size }) => {
        // Define sizes based on original CSS for Image component
        const imgLarge = { w: 369, h: 337 };
        const imgSmall = { w: 271, h: 377 };
        const imgNormalSmall = { w: 293, h: 409 };
        
        const currentSize = size === 'large' ? imgLarge : imgSmall;
        const currentNormalSize = size === 'large' ? imgLarge : imgNormalSmall;

        return (
            <div className={styles[groupName]}>
                {/* Image 1: Rotated -16deg */}
                <Image 
                    src={`/images/${groupName}-img1.jpg`} 
                    alt={`Step ${groupName} illustration 1`} 
                    className={styles.imgRotatedNegative}
                    width={currentSize.w} 
                    height={currentSize.h} 
                />
                {/* Image 2: Rotated 15deg */}
                <Image 
                    src={`/images/${groupName}-img2.jpg`} 
                    alt={`Step ${groupName} illustration 2`} 
                    className={styles.imgRotatedPositive}
                    width={currentSize.w} 
                    height={currentSize.h} 
                />
                {/* Image 3: Normal */}
                <Image 
                    src={`/images/${groupName}-img3.jpg`} 
                    alt={`Step ${groupName} illustration 3`} 
                    className={styles.imgNormal}
                    width={currentNormalSize.w} 
                    height={currentNormalSize.h} 
                />
            </div>
        );
    };

    return (
        <div className={styles.cta13}>
            <div className={styles.container}>
                <section className={styles.sectionTitle}>
                    <div className={styles.contentTitle}>
                        <p className={styles.text1}>Cara Kerja PeJuang Tender</p>
                        <p className={styles.text2}>Akses data tender dari ratusan LPSE, notifikasi harian sesuai kebutuhan, hindari ketinggalan jadwal, dan memaksimalkan kemenangan Anda.</p>
                    </div>
                </section>

                <div className={styles.frame16}>
                    {/* Step 1: Image on Left */}
                    <div className={styles.contentRow}>
                        <ImageGroup groupName="group20" size="large" />
                        <div className={styles.contentStepText}>
                            <p className={styles.text6}>1. Pilih paket & Tentukan target tender anda</p>
                            <p className={styles.text7}>Pilih kategori, instansi/LPSE, dan kata kunci sesuai kebutuhan bisnis Anda.</p>
                        </div>
                    </div>

                    {/* Step 2: Image on Right (contentRow + contentRowReversed) */}
                    <div className={`${styles.contentRow} ${styles.contentRowReversed}`}> 
                        <div className={styles.contentStepText}>
                            <p className={styles.text8}>2. Terima Update EMail setiap hari</p>
                            <p className={styles.text9}>Dapatkan ringkasan tender terbaru setiap hari langsung ke email </p>
                        </div>
                        <ImageGroup groupName="group18" size="small" />
                    </div>

                    {/* Step 3: Image on Left */}
                    <div className={styles.contentRow}>
                        <ImageGroup groupName="group17" size="small" />
                        <div className={styles.contentStepText}>
                            <p className={styles.text16}>3. Ikut Tender Tepat Waktu</p>
                            <p className={styles.text17}>Selalu jadi yang pertama tahu, tanpa takut ketinggalan peluang penting.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
