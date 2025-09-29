// src/components/home/Testimonial.tsx

import React from 'react';
import Image from 'next/image'; // 1. IMPORT Next.js Image component
import styles from './Testimonial.module.css';

// FIX: Changed React.VFC to React.FC (kept from previous successful fix)
const Testimonial: React.FC = () => {
  // A helper component for a single testimonial card
  const TestimonialCard: React.FC<{ quote: string; name: string; title: string; imageSrc?: string }> = ({ quote, name, title, imageSrc = "" }) => (
    <div className={styles.column}>
      <div className={styles.contentCard}>
        {/* FIX: Replaced <img> with <Image /> for Profile Image */}
        <Image 
          src={imageSrc || '/path/to/default-avatar.svg'} // Provide a valid default src if imageSrc is empty
          alt={`${name}'s profile picture`} 
          className={styles.profileImage}
          width={80}  // MUST be set for optimization
          height={80} // MUST be set for optimization
        /> 
        
        {/* Only show stars for the second testimonial for now */}
        {name === "Dewi Lestari" && (
            <div className={styles.stars}>
                {/* FIX: Replaced <img> with <Image /> for Star icons */}
                <Image src="/star-full.svg" alt="Star rating" width={20} height={19} />
                <Image src="/star-full.svg" alt="Star rating" width={20} height={19} />
                <Image src="/star-full.svg" alt="Star rating" width={20} height={19} />
                <Image src="/star-full.svg" alt="Star rating" width={20} height={19} />
                <Image src="/star-half.svg" alt="Half star rating" className={styles.halfStar} width={20} height={19} />
            </div>
        )}
        
        <p className={styles.textQuote}>&ldquo;{quote}&rdquo;</p>
      </div>
      <div className={styles.avatar}>
        <div className={styles.avatarContent}>
          <p className={styles.textName}>{name}</p>
          <p className={styles.textTitle}>{title}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.testimonial11}>
      <div className={styles.container}>
        <section className={styles.sectionTitle}>
          <p className={styles.text1}>APA Kata Mereka</p>
        </section>
        
        <div className={styles.contentWrapper}>
          <div className={styles.contentColumns}>
            
            {/* Testimonial Cards (unchanged) */}
            <TestimonialCard 
                quote="Layanan customer support pejuangtender.id juga cepat responnya. Kalau ada kendala atau pertanyaan soal paket, langsung dibantu. Sangat puas dengan layanan ini."
                name="Budi Santoso"
                title="Direktur CV Mitra Karya Sejahtera"
            />
            
            <TestimonialCard 
                quote="Sebelumnya kami harus cek LPSE satu per satu, sekarang tinggal buka email update dari pejuangtender.id. Praktis sekali! Banyak tender yang akhirnya bisa kami ikuti karena infonya lebih cepat."
                name="Dewi Lestari"
                title="Direktur CV Sumber Mandiri"
            />

            <TestimonialCard 
                quote="Selama trial saja kami sudah dapat info tender yang sesuai, akhirnya kami langsung upgrade ke paket premium. Investasi kecil yang hasilnya sangat besar untuk perusahaan."
                name="Siti Aminah"
                title="Business Development PT Anugerah Teknik"
            />

          </div>
          
          <div className={styles.contentControls}>
            <div className={styles.sliderDots}>
              <div className={styles.dotActive} />
              <div className={styles.dotInactive} />
              <div className={styles.dotInactive} />
              <div className={styles.dotInactive} />
            </div>
            <div className={styles.sliderButtons}>
              <button className={styles.sliderArrow} aria-label="Previous testimonial">
                {/* FIX: Replaced <img> with <Image /> for Arrow icons */}
                <Image src="/path/to/arrow-left.svg" alt="Arrow Left" width={24} height={24} />
              </button>
              <button className={styles.sliderArrow} aria-label="Next testimonial">
                <Image src="/path/to/arrow-right.svg" alt="Arrow Right" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;