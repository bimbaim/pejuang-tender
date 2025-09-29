"use client";

// Hapus alias 'SwiperComponent'
import { Swiper, SwiperSlide } from "swiper/react"; 
import { Swiper as SwiperClass } from "swiper"; // 👈 TIPE yang digunakan untuk useRef
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star, StarHalf, StarOff } from "lucide-react";
import { NavigationOptions } from "swiper/types";
import styles from "./Testimonial.module.css";

// Data Testimonial & renderStars (Tidak Berubah)
const testimonials = [
  // ... data testimonials Anda ...
  { rating: 4, text: "Layanan customer support pejuangtender.id juga cepat responnya. Kalau ada kendala atau pertanyaan soal paket, langsung dibantu. Sangat puas dengan layanan ini.", name: "Budi Santoso", role: "Direktur CV Mitra Karya Sejahtera" },
  { rating: 4.5, text: "Sebelumnya kami harus cek LPSE satu per satu, sekarang tinggal buka email update dari pejuangtender.id. Praktis sekali! Banyak tender yang akhirnya bisa kami ikuti karena infonya lebih cepat.", name: "Dewi Lestari", role: "Direktur CV Sumber Mandiri" },
  { rating: 5, text: "Selama trial saja kami sudah dapat info tender yang sesuai, akhirnya kami langsung upgrade ke paket premium. Investasi kecil yang hasilnya sangat besar untuk perusahaan.", name: "Siti Aminah", role: "Business Development PT Anugerah Teknik" },
  { rating: 3.5, text: "Platform ini sangat membantu tim kami dalam mencari tender baru. Hemat waktu, lebih fokus ke strategi penawaran.", name: "Andi Pratama", role: "Manager PT Bina Usaha" },
  { rating: 5, text: "Rekomendasi untuk semua kontraktor dan supplier. Informasinya lengkap dan selalu update.", name: "Nur Hidayah", role: "Owner UD Sukses Abadi" },
];

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, idx) => {
    const starValue = idx + 1;
    if (rating >= starValue) {
      return <Star key={idx} size={18} fill="#000000" stroke="#000000" />;
    } else if (rating >= starValue - 0.5) {
      return <StarHalf key={idx} size={18} fill="#000000" stroke="#000000" />;
    } else {
      return <StarOff key={idx} size={18} stroke="#d1d5db" fill="none" />;
    }
  });
}

export default function Testimonial() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params.navigation && prevRef.current && nextRef.current) {
      const navigation = swiperRef.current.params.navigation as NavigationOptions;
      
      navigation.prevEl = prevRef.current;
      navigation.nextEl = nextRef.current;

      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []); 

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>APA KATA MEREKA</h2>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          
          if (swiper.params.navigation && prevRef.current && nextRef.current) {
            const navigation = swiper.params.navigation as NavigationOptions;
            
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
            
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ clickable: true }}
        
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <div className={styles.card}>
              <div className={styles.stars}>{renderStars(t.rating)}</div>
              <p className={styles.text}>“{t.text}”</p>
              <div>
                <p className={styles.author}>{t.name}</p>
                <p className={styles.role}>{t.role}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.navigation}>
        <button ref={prevRef} className={styles.button}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button ref={nextRef} className={styles.button}>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}