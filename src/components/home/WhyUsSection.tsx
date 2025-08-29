import React from 'react';
import Image from 'next/image';
import styles from './WhyUsSection.module.css';

const WhyUsSection = () => {
  const benefits = [
    { title: 'Notifikasi Personal', description: 'Notifikasi dikirim sesuai dengan keinginan Anda', icon: '/images/icon-personal.png' },
    { title: 'Hemat Waktu dan Tenaga', description: 'Tidak perlu lagi memantau ratusan portal SPSE', icon: '/images/icon-time.png' },
    { title: 'Notifikasi Langsung ke Email', description: 'Dapatkan notifikasi terbaru langsung ke email anda.', icon: '/images/icon-email.png' },
    { title: 'Data dari Sumber Resmi', description: 'Informasi langsung diambil dari spse.inaproc', icon: '/images/icon-data.png' },
    { title: 'Dukungan Layanan 24/7', description: 'Kami siap membantu kendala Anda', icon: '/images/icon-support.png' },
  ];

  return (
    <section className={styles.whyUsSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.imageColumn}>
            <Image
              src="/images/why-us-image.png" // Replace with your image path
              alt="Why Us"
              width={600}
              height={640}
              className={styles.mainImage}
            />
          </div>
          <div className={styles.textColumn}>
            <div className={styles.titleGroup}>
              <h2 className={styles.subtitle}>Mengapa Pejuangtender.id</h2>
              <p className={styles.mainTitle}>
                Pejuangtender.id membantu Anda mendapatkan notifikasi tender K/L/D/I yang relevan dengan bisnis Anda, sesuai kategori, keyword, lokasi, dan nilai tender yang Anda tentukan
              </p>
            </div>
            <div className={styles.benefitsGrid}>
              {benefits.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <Image
                    src={benefit.icon}
                    alt={`${benefit.title} Icon`}
                    width={48}
                    height={48}
                  />
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;