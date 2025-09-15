// src/lib/emailTemplates/subscriptionWelcome.ts

export const subscriptionWelcomeTemplate = (name: string, packageName: string): string => {
  return `
  Halo ${name},

  Terima kasih telah mempercayakan pejuangtender.id untuk membantu perjalanan Anda memenangkan tender.

  Kami senang memberi tahu bahwa paket ${packageName} Anda sudah aktif mulai hari ini.

  Mulai Sekarang, Anda Akan Mendapatkan:
  • Daftar tender terbaru sesuai kategori & keyword pilihan Anda.
  • Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.
  • Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.
  • Info terhadap lebih banyak LPSE

  Tips Memaksimalkan Paket Anda:
  • Gunakan lebih banyak keyword untuk menjangkau peluang tender yang lebih luas.
  • Cek email update tender setiap pagi untuk melihat peluang terbaru.
  • Simpan atau tandai tender yang menarik agar mudah diakses nanti.
  • Segera hubungi instansi atau siapkan dokumen jika menemukan tender yang sesuai.

  Butuh Bantuan?
  Email: info@pejuangtender.id
  WhatsApp: +62822 8478 3855

  Selamat berjuang & semoga sukses memenangkan tender!
  Salam,
  Tim pejuangtender.id
  “Tender Tepat, Lebih Cepat”
  `;
};