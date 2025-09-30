// TermOfUseBody.tsx
import React from 'react';
import styles from './TermsOfServiceBody.module.css';
// Data Utama
const WEBSITE_URL = "https://pejuangtender.id";
const COMPANY_NAME = "PejuangTender.id";
const LAST_UPDATED = "30 September 2025";
const CONTACT_EMAIL = "info@pejuangtender.id";
const JURISDICTION = "Denpasar, Bali, Indonesia";

const TermOfUseBody = () => {
  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.container}>
        
        {/* Header Section */}
        <section className={styles.section}>
          <h2 className={styles.headingPrimary}>Syarat dan Ketentuan Penggunaan</h2>
          <p className={styles.paragraph}>
            <strong>Versi:</strong> 1.0<br />
            <strong>Berlaku sejak:</strong> {LAST_UPDATED}
          </p>
          <p className={styles.paragraph}>
            Situs web <a href={WEBSITE_URL}>{WEBSITE_URL}</a> (&quot;Situs&quot;) dimiliki dan dioperasikan oleh <strong>{COMPANY_NAME}</strong>. Dengan mengakses atau menggunakan Situs, Anda setuju untuk terikat dengan Syarat & Ketentuan berikut. Harap baca dengan cermat.
          </p>
        </section>

        {/* --- */}
        
        {/* Section 1: Kelayakan */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>1. Kelayakan Pengguna</h3>
          <p className={styles.paragraph}>
            Anda harus berusia minimal <strong>18 tahun</strong> untuk menggunakan Situs ini. Dengan menggunakan Situs, Anda menyatakan dan menjamin bahwa Anda memiliki kapasitas hukum penuh untuk membuat perjanjian yang mengikat secara hukum.
          </p>
        </section>

        {/* Section 2: Lisensi Penggunaan */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>2. Lisensi Penggunaan Situs</h3>
          <p className={styles.paragraph}>
            Kami memberikan kepada Anda <strong>lisensi terbatas, tidak dapat dipindahtangankan, dan dapat dicabut</strong> untuk mengakses dan menggunakan Situs semata-mata untuk tujuan pribadi atau bisnis Anda yang sah terkait informasi tender.
          </p>
          <p className={styles.paragraph}>
            <strong>Pembatasan Penggunaan:</strong> Anda setuju bahwa Anda <strong>tidak akan</strong>:
            <ul className={styles.list}>
              <li>Menjual, menyewakan, mentransfer, atau mengeksploitasi data kami untuk kepentingan komersial tanpa izin tertulis dari kami.</li>
              <li>Melakukan <em>reverse engineering</em>, membongkar, atau menyalin sistem, struktur, atau kode Situs kami.</li>
              <li>Menggunakan informasi atau data dari Situs kami untuk membangun layanan atau database pesaing.</li>
              <li>Melanggar hukum dan peraturan yang berlaku saat menggunakan Situs.</li>
            </ul>
          </p>
        </section>

        {/* Section 3: Hak Kekayaan Intelektual */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>3. Hak Kekayaan Intelektual (HKI)</h3>
          <p className={styles.paragraph}>
            Seluruh konten, termasuk teks, grafis, logo, merek dagang, dan basis data layanan tender di Situs ini adalah milik eksklusif <strong>{COMPANY_NAME}</strong> atau penyedia data resmi. Anda tidak diperkenankan menyalin, memodifikasi, mereproduksi, atau mendistribusikan HKI tersebut tanpa izin tertulis.
          </p>
        </section>

        {/* Section 4: Pihak Ketiga & Iklan */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>4. Tautan & Iklan Pihak Ketiga</h3>
          <p className={styles.paragraph}>
            Situs kami dapat berisi tautan ke situs web, layanan, atau iklan pihak ketiga. Kami tidak memiliki kendali atas isi, kebijakan privasi, atau praktik pihak ketiga tersebut, dan kami tidak bertanggung jawab atas kerugian atau kerusakan apa pun yang timbul dari penggunaannya. Penggunaan tautan pihak ketiga sepenuhnya menjadi <strong>risiko Anda sendiri</strong>.
          </p>
        </section>

        {/* Section 5: Ketersediaan Layanan */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>5. Modifikasi dan Ketersediaan Layanan</h3>
          <p className={styles.paragraph}>
            Kami dapat sewaktu-waktu mengubah, menangguhkan, atau menghentikan sebagian atau seluruh layanan Situs tanpa pemberitahuan sebelumnya. Anda mengakui bahwa kami tidak bertanggung jawab atas gangguan, *downtime*, atau penghentian layanan kepada Anda atau pihak ketiga mana pun.
          </p>
        </section>

        {/* Section 6: Penafian (Disclaimers) */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>6. Penafian Data dan Jaminan</h3>
          <p className={`${styles.paragraph} ${styles.highlight}`}>
            Situs kami disediakan **&quot;sebagaimana adanya&quot;** dan **&quot;sebagaimana tersedia&quot;**. Kami tidak menjamin akurasi, ketepatan waktu, atau kelengkapan data tender. Walaupun data bersumber dari LPSE resmi, **kami tidak bertanggung jawab** atas keterlambatan, kesalahan, atau kekurangan *update* dari pihak eksternal. Kami secara tegas menolak semua jaminan, baik tersurat maupun tersirat, termasuk jaminan kelayakan jual dan kesesuaian untuk tujuan tertentu.
          </p>
        </section>

        {/* Section 7: Batasan Tanggung Jawab */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>7. Batasan Tanggung Jawab</h3>
          <p className={styles.paragraph}>
            Sepanjang diizinkan oleh hukum yang berlaku, <strong>{COMPANY_NAME}</strong> (termasuk direksi, karyawan, dan agennya) tidak bertanggung jawab atas:
            <ul className={styles.list}>
                <li>Kehilangan keuntungan, peluang bisnis, atau data yang disebabkan oleh penggunaan Situs; atau</li>
                <li>Kerugian tidak langsung, insidental, atau konsekuensial, bahkan jika kami telah diberitahu tentang kemungkinan kerugian tersebut.</li>
            </ul>
          </p>
          <p className={styles.paragraph}>
            Dalam kasus apa pun, tanggung jawab maksimal dan keseluruhan kami kepada Anda untuk klaim apa pun yang timbul dari atau terkait dengan Syarat ini atau penggunaan Situs, dibatasi hingga **Rp 1.000.000 (Satu Juta Rupiah)**.
          </p>
        </section>

        {/* Section 8: Penghentian */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>8. Penghentian Akses</h3>
          <p className={styles.paragraph}>
            Kami berhak untuk segera menangguhkan atau mengakhiri akses Anda ke Situs kapan saja, atas kebijakan tunggal kami, jika Anda melanggar salah satu ketentuan dalam Syarat ini.
          </p>
        </section>

        {/* Section 9: Hukum yang Berlaku */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>9. Hukum yang Mengatur dan Yurisdiksi</h3>
          <p className={styles.paragraph}>
            Syarat ini diatur oleh dan ditafsirkan sesuai dengan <strong>hukum Republik Indonesia</strong>. Setiap sengketa yang timbul dari Syarat ini akan diselesaikan secara eksklusif di yurisdiksi pengadilan di <strong>{JURISDICTION}</strong>.
          </p>
        </section>

        {/* Section 10: Perubahan Syarat */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>10. Perubahan Syarat</h3>
          <p className={styles.paragraph}>
            Kami dapat memperbarui Syarat ini sewaktu-waktu. Setiap perubahan akan dipublikasikan di halaman ini dengan tanggal berlaku baru. Tanggal &quot;Berlaku sejak&quot; di awal dokumen menunjukkan kapan revisi terbaru mulai berlaku. Penggunaan Situs secara berkelanjutan setelah tanggal tersebut berarti Anda <strong>menerima dan setuju</strong> untuk terikat oleh Syarat yang telah direvisi.
          </p>
        </section>

        {/* Section 11: Kontak */}
        <section className={styles.section}>
          <h3 className={styles.headingSecondary}>11. Informasi Kontak</h3>
          <p className={styles.paragraph}>
            Untuk pertanyaan atau komunikasi mengenai Syarat & Ketentuan ini, atau Kebijakan Privasi, silakan hubungi kami di:
            <br /><br />
            <strong>Nama Perusahaan:</strong> {COMPANY_NAME}<br />
            <strong>Alamat:</strong> Jimbaran, Bali<br />
            <strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
        
      </div>
    </div>
  );
};

export default TermOfUseBody;