// src/app/privacy-policy/components/PrivacyPolicyBody.tsx

import React from 'react';
import styles from './PrivacyPolicyBody.module.css';

// Data Utama
const WEBSITE_URL = "https://pejuangtender.id";
const COMPANY_NAME = "PejuangTender.id";
const CONTACT_EMAIL = "info@pejuangtender.id";

const PrivacyPolicyBody: React.FC = () => {
  return (
    <div className={styles.event1}>
      <div className={styles.container}>
        
        {/* Section 1: Introduction */}
        <section className={styles.sectionTitle}>
          <h2 className={styles.headingPrimary}>Kebijakan Privasi</h2>
          <p className={styles.text1}>
            Di <strong>{COMPANY_NAME}</strong>, yang dapat diakses melalui <a href={WEBSITE_URL}>{WEBSITE_URL}</a>, salah satu prioritas utama kami adalah menjaga privasi pengunjung dan pengguna kami. Kebijakan Privasi ini menjelaskan jenis informasi apa saja yang kami kumpulkan, bagaimana kami menggunakannya, serta hak Anda terkait data tersebut.
            <br /><br />
            Jika Anda memiliki pertanyaan tambahan atau memerlukan informasi lebih lanjut tentang Kebijakan Privasi kami, jangan ragu untuk menghubungi kami melalui email di <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 2: Log Files */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>1. File Log</h3>
          <p className={styles.text3}>
            {COMPANY_NAME} mengikuti prosedur standar penggunaan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web. Informasi yang dikumpulkan oleh file log meliputi:
            <ul className={styles.list}>
              <li>Alamat Internet Protocol (IP)</li>
              <li>Jenis *browser*</li>
              <li>Penyedia Layanan Internet (ISP)</li>
              <li>Tanggal dan waktu kunjungan (*timestamp*)</li>
              <li>Halaman perujuk/keluar (*referring/exit pages*)</li>
              <li>Jumlah klik</li>
            </ul>
            Informasi ini <strong>tidak terkait</strong> dengan informasi apa pun yang dapat diidentifikasi secara pribadi. Tujuan dari informasi ini adalah untuk menganalisis tren, mengelola situs, melacak pergerakan pengguna di situs web, dan mengumpulkan informasi demografis.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 3: Cookies and Web Beacons */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>2. Cookies dan Pelacakan</h3>
          <p className={styles.text5}>
            Seperti situs web lainnya, kami menggunakan **&apos;cookies&apos;**. *Cookies* ini digunakan untuk menyimpan informasi termasuk preferensi pengunjung, dan halaman-halaman di situs web yang diakses atau dikunjungi pengunjung. Informasi tersebut digunakan untuk:
            <ul className={styles.list}>
                <li>Mengingat preferensi pengguna</li>
                <li>Mengoptimalkan konten halaman</li>
                <li>Memersonalisasi notifikasi dan layanan</li>
            </ul>
            Anda dapat memilih untuk menonaktifkan *cookies* melalui opsi pengaturan *browser* individual Anda. Namun, perlu diperhatikan bahwa beberapa bagian dari situs kami mungkin tidak berfungsi dengan baik atau optimal setelah penonaktifan *cookies*.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 4: Layanan Pihak Ketiga */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>3. Layanan Pihak Ketiga dan Kebijakan Privasi</h3>
          <p className={styles.text7}>
            Kami dapat menampilkan iklan atau menyertakan tautan ke situs pihak ketiga yang menggunakan teknologi seperti *cookies*, JavaScript, atau *Web Beacons*. Server iklan atau jaringan iklan pihak ketiga ini secara otomatis menerima alamat IP Anda ketika hal ini terjadi. Teknologi ini digunakan untuk mengukur efektivitas kampanye iklan mereka dan/atau untuk mempersonalisasi konten iklan yang Anda lihat di situs web yang Anda kunjungi.
            <br /><br />
            Perlu diketahui bahwa <strong>{COMPANY_NAME}</strong> tidak memiliki akses ke atau kontrol atas *cookies* ini yang digunakan oleh pengiklan pihak ketiga. Kebijakan Privasi kami tidak berlaku untuk pengiklan atau situs web lain. Oleh karena itu, kami menyarankan Anda untuk meninjau Kebijakan Privasi masing-masing dari server iklan pihak ketiga tersebut untuk informasi yang lebih rinci.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 5: Data dari Sumber Resmi */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>4. Data dari Sumber Resmi</h3>
          <p className={styles.text9}>
            Semua data tender yang kami sediakan berasal langsung dari <strong>platform LPSE/e-procurement resmi</strong>. Kami hanya bertindak sebagai agregator (pengumpul) dan penyedia notifikasi untuk data yang sudah bersifat publik.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 6: Privasi Anak */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>5. Privasi Anak</h3>
          <p className={styles.text11}>
            Kami memprioritaskan penambahan perlindungan bagi anak-anak saat menggunakan internet. <strong>{COMPANY_NAME}</strong> tidak dengan sengaja mengumpulkan Informasi Identitas Pribadi dari anak-anak di bawah usia 13 tahun. Jika Anda yakin bahwa anak Anda telah memberikan jenis informasi ini di situs web kami, kami sangat menganjurkan Anda untuk segera menghubungi kami dan kami akan melakukan upaya terbaik untuk segera menghapus informasi tersebut dari catatan kami.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 7: Kebijakan Online Saja */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>6. Kebijakan Online Saja</h3>
          <p className={styles.text13}>
            Kebijakan Privasi ini hanya berlaku untuk aktivitas *online* kami dan berlaku untuk pengunjung situs web kami sehubungan dengan informasi yang mereka bagikan dan/atau kumpulkan di <strong>{COMPANY_NAME}</strong>. Kebijakan ini tidak berlaku untuk informasi apa pun yang dikumpulkan secara *offline* atau melalui saluran selain situs web ini.
          </p>
        </section>
        
        {/* --- */}

        {/* Section 8: Consent */}
        <section className={styles.sectionTitle}>
          <h3 className={styles.headingSecondary}>7. Persetujuan</h3>
          <p className={styles.text15}>
            Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui Syarat & Ketentuan Penggunaan kami.
          </p>
        </section>
        
      </div>
    </div>
  );
};

export default PrivacyPolicyBody;