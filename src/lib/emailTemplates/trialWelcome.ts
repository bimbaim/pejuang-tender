// src/lib/emailTemplates/trialWelcome.ts

export const trialWelcomeTemplate = (name: string, trialEndDate: string): string => {
  return `
  Halo ${name},

  Terima kasih telah mencoba pejuangtender.id!
  Selama 7 hari ke depan, Anda akan menerima update tender harian langsung di email ini, sesuai kategori & keyword yang Anda pilih saat pendaftaran.

  Yang Akan Anda Terima Setiap Hari
  • Daftar tender terbaru sesuai kategori & keyword pilihan Anda.
  • Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.
  • Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.

  Tips Memaksimalkan Trial Anda:
  • Cek email update tender setiap pagi untuk melihat peluang terbaru.
  • Simpan atau tandai tender yang menarik agar mudah diakses nanti.
  • Segera hubungi instansi atau siapkan dokumen jika menemukan tender yang sesuai.

  Catatan Penting:
  Trial Anda akan berakhir pada ${trialEndDate}.
  Untuk terus mendapatkan update tender harian, upgrade paket Anda sebelum masa trial berakhir.
  
  <a href="[Link untuk upgrade]" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:#ffffff;text-decoration:none;border-radius:5px;">Upgrade Paket Anda</a>

  Butuh Bantuan?
  Email: info@pejuangtender.id
  WhatsApp: +62822 8478 3855

  Selamat berjuang & semoga sukses memenangkan tender!
  Salam,
  Tim pejuangtender.id
  “Tender Tepat, Lebih Cepat”
  `;
};