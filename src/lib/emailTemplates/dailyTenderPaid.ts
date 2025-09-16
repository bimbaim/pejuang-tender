// src/lib/emailTemplates/dailyTenderPaid.ts

// ✅ Diperbarui: Interface ini sekarang hanya berisi data yang dibutuhkan untuk template berbayar.
interface Tender {
  title: string;
  agency: string;
  budget: number;
  source_url: string; 
}

/**
 * Generates the daily email template with a list of tenders for paid users.
 * Menggunakan desain dari template trial namun dengan konten berbayar.
 * @param name The user's name.
 * @param tenders An array of tender objects to display.
 * @returns The complete HTML string for the email.
 */
export const dailyTenderPaidEmailTemplate = (name: string, tenders: Tender[]): string => {
  const tenderListHtml = tenders.map((tender, index) => {
    // Memformat budget ke Rupiah
    const formattedBudget = new Intl.NumberFormat("id-ID", {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(tender.budget);

    return `
    <tr style="background-color: #ffffff; border: 1px solid #f5f5f5;">
      <td style="padding: 8px 15px; border-bottom: 1px solid #e0e0e0; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #333333;">${index + 1}</td>
      <td style="padding: 8px 15px; border-bottom: 1px solid #e0e0e0; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #333333;">${tender.title}</td>
      <td style="padding: 8px 15px; border-bottom: 1px solid #e0e0e0; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #333333;">${tender.agency}</td>
      <td style="padding: 8px 15px; border-bottom: 1px solid #e0e0e0; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #333333;">${formattedBudget}</td>
      <td style="padding: 8px 15px; border-bottom: 1px solid #e0e0e0; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px;">
        <a href="${tender.source_url}" style="color: #0093dd; text-decoration: underline; font-family: Quicksand, sans-serif;">Lihat</a>
      </td>
    </tr>
  `;
  }).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Tender Harian</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
      @media only screen and (max-width: 640px) {
        .email-container { width: 100% !important; }
        .user-table { width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; text-align: center;">

    <div style="background-color: #f4f4f4; padding: 20px;">
      <table border="0" cellpadding="0" cellspacing="0" width="640" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; font-family: Saira, Quicksand, sans-serif; color: #000000;">
        <tr>
          <td style="padding: 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="left">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://pejuang-tender.vercel.app/images/logo-footer.png" alt="PEJUANG Tender Logo" width="44" height="44" style="display: block;">
                    <p style="font-size: 18px; font-weight: bold; margin: 0;">PEJUANG Tender</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 0 10px;">
                  <p style="font-size: 20px; font-family: Saira, sans-serif; margin: 0; text-align: center;">Halo ${name}, 👋</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">
                  <p style="font-size: 16px; font-family: Saira, sans-serif; margin: 0; text-align: left;">Daftar Tender Terbaru</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0 20px;">
                  <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%; text-align: left;">Berikut adalah daftar tender terbaru sesuai kategori & keyword yang Anda pilih:</p>
                </td>
              </tr>
            </table>

            <table class="user-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border-radius: 10px; overflow: hidden; border: 1px solid #f5f5f5;">
              <thead>
                <tr style="background-color: #f5f5f5; border: 1px solid #000000;">
                  <th style="padding: 10px 15px; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #0f1419;">No</th>
                  <th style="padding: 10px 15px; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #0f1419;">Nama</th>
                  <th style="padding: 10px 15px; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #0f1419;">Instansi</th>
                  <th style="padding: 10px 15px; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #0f1419;">HPS</th>
                  <th style="padding: 10px 15px; text-align: left; font-size: 13px; font-family: Quicksand, sans-serif; line-height: 19px; color: #0f1419;">Link</th>
                </tr>
              </thead>
              <tbody>
                ${tenders.length > 0 ? tenderListHtml : `
                  <tr style="background-color: #ffffff;">
                    <td colspan="5" style="padding: 20px; text-align: center; color: #666; font-family: Quicksand, sans-serif;">Tidak ada tender baru yang ditemukan hari ini.</td>
                  </tr>
                `}
              </tbody>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding: 25px 0 10px;">
                  <div style="background-color: #e5f4fb; border-radius: 10px; padding: 20px; text-align: left;">
                    <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0 0 10px; font-weight: bold;">TIPS:</p>
                    <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%;">Cek detail tender sesegera mungkin. Simpan tender yang relevan untuk persiapan dokumen penawaran.</p>
                  </div>
                </td>
              </tr>
            </table>

            <div style="background-color: #191919; padding: 30px; color: #ffffff; text-align: left; font-size: 12px; border-radius: 0 0 10px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="70%" style="padding-right: 20px;">
                    <p style="margin: 0 0 15px; line-height: 150%;">Selamat berjuang & semoga sukses memenangkan tender! Salam, Tim pejuangtender.id<br/>“Tender Tepat, Lebih Cepat”</p>
                  </td>
                  <td width="30%" align="right">
                    <img src="https://pejuang-tender.vercel.app/images/logo-footer.png" alt="Logo" width="44" height="44" style="display: block; margin-left: auto;">
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 20px;">
                    <div style="border-top: 1px solid #444444; margin-top: 20px;"></div>
                    <p style="margin: 10px 0 0; font-weight: bold; text-align: right;">BUTUH BANTUAN?</p>
                    <p style="margin: 5px 0 0; text-align: right; line-height: 150%;">Email: info@pejuangtender.id<br/>WhatsApp: +62822 8478 3855</p>
                  </td>
                </tr>
              </table>
            </div>

          </td>
        </tr>
      </table>
    </div>

  </body>
  </html>
  `;
};