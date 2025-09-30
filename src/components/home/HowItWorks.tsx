import React from 'react';
import Image from 'next/image'; 
import styles from './HowItWorks.module.css';

const HowItWorks: React.FC = () => {
    return (
        <div className={styles.cta13}>
            <div className={styles.container}>
                <section className={styles.sectionTitle}>
                    <div className={styles.contentTitle}>
                        <p className={styles.text1}>Cara Kerja Pejuang Tender</p>
                        <p className={styles.text2}>
                            Akses data tender dari ratusan LPSE, notifikasi harian sesuai kebutuhan, 
                            hindari ketinggalan jadwal, dan memaksimalkan kemenangan Anda.
                        </p>
                    </div>
                </section>

                <div className={styles.frame16}>
                    {/* Step 1: Image on Left */}
                    <div className={styles.contentRow}>
                        <Image 
                            src="/images/group20.png"
                            alt="Step 1 illustration"
                            className={styles.imgSingle}
                            width={624} height={450}
                        />
                        <div className={styles.contentStepText}>
                            <p className={styles.text6}>1. Pilih paket & Tentukan target tender anda</p>
                            <p className={styles.text7}>
                                Pilih kategori, instansi/LPSE, dan kata kunci sesuai kebutuhan bisnis Anda.
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Image on Right */}
                    <div className={styles.contentRowReversed}> 
                        <div className={styles.contentStepText}>
                            <p className={styles.text8}>2. Terima Update Email setiap hari</p>
                            <p className={styles.text9}>
                                Dapatkan ringkasan tender terbaru setiap hari langsung ke email 
                            </p>
                        </div>
                        <Image 
                            src="/images/group18.png"
                            alt="Step 2 illustration"
                            className={styles.imgSingle}
                            width={624} height={450}
                        />
                    </div>

                    {/* Step 3: Image on Left */}
                    <div className={styles.contentRow}>
                        <Image 
                            src="/images/group17.png"
                            alt="Step 3 illustration"
                            className={styles.imgSingle}
                            width={624} height={450}
                        />
                        <div className={styles.contentStepText}>
                            <p className={styles.text16}>3. Ikut Tender Tepat Waktu</p>
                            <p className={styles.text17}>
                                Selalu jadi yang pertama tahu, tanpa takut ketinggalan peluang penting.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
