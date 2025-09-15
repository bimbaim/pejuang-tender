// src/lib/emailTemplates/dailyTenderTrial.ts

interface Tender {
    title: string;
    agency: string;
    budget: number;
    // ✅ PERBAIKAN: Ganti 'url' menjadi 'source_url'
    source_url: string;
    end_date: string;
}

/**
 * Generates the daily email template with a list of tenders for trial users.
 * @param name The user's name.
 * @param tenders An array of tender objects to display.
 * @param trialEndDate The end date of the user's trial period.
 * @returns The complete HTML string for the email.
 */
export const dailyTenderTrialEmailTemplate = (name: string, tenders: Tender[], trialEndDate: string): string => {
  const tenderListHtml = tenders.map((tender, index) => `
    <tr>
      <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; text-align: center;">${index + 1}</td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0;">
        <h4 style="margin: 0; font-size: 16px; color: #1a237e;">${tender.title}</h4>
      </td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0;">${tender.agency}</td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">IDR ${new Intl.NumberFormat("id-ID").format(tender.budget)}</td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0;">${tender.end_date}</td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; text-align: center;">
        <a href="${tender.source_url}" style="display:inline-block;padding:8px 15px;background-color:#4CAF50;color:#ffffff;text-decoration:none;border-radius:5px;font-size:14px;">Lihat</a>
      </td>
    </tr>
  `).join('');

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
      @media only screen and (max-width: 600px) {
        .inner-container { padding: 20px !important; }
        .responsive-table { width: 100% !important; display: block; }
        .responsive-table td { display: block; text-align: left !important; }
        .responsive-table th { display: none; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td align="center" style="background-color: #f4f4f4; padding: 20px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <tr>
              <td style="padding: 40px 30px 20px 30px; text-align: center; border-bottom: 1px solid #eeeeee;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1a237e;">
                  Update Tender Hari Ini
                </h1>
                <p style="margin-top: 10px; font-size: 16px; color: #666666;">
                  ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </td>
            </tr>
            
            <tr>
              <td class="inner-container" style="padding: 40px 30px;">
                <p style="margin: 0 0 20px;">Halo ${name} 👋,</p>
                <p style="margin: 0 0 20px;">
                  Berikut adalah daftar tender terbaru sesuai kategori & keyword yang Anda pilih:
                </p>

                <table class="responsive-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
                  <thead>
                    <tr style="background-color: #1a237e; color: #ffffff;">
                      <th style="padding: 12px 15px; text-align: center;">No</th>
                      <th style="padding: 12px 15px; text-align: left;">Nama</th>
                      <th style="padding: 12px 15px; text-align: left;">Instansi</th>
                      <th style="padding: 12px 15px; text-align: right;">HPS</th>
                      <th style="padding: 12px 15px; text-align: left;">Akhir Pendaftaran</th>
                      <th style="padding: 12px 15px; text-align: center;">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tenders.length > 0 ? tenderListHtml : `
                      <tr>
                        <td colspan="6" style="padding: 20px; text-align: center; color: #666;">Tidak ada tender baru yang ditemukan hari ini.</td>
                      </tr>
                    `}
                  </tbody>
                </table>

                <div style="background-color: #f7f9fc; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 4px; margin-bottom: 25px;">
                  <p style="margin: 0; font-weight: bold;">Tips:</p>
                  <ul style="margin: 5px 0 0; padding-left: 20px; font-size: 14px; color: #555;">
                    <li style="margin-bottom: 5px;">Cek detail tender sesegera mungkin sebelum batas waktu berakhir.</li>
                    <li>Simpan tender yang relevan untuk persiapan dokumen penawaran.</li>
                  </ul>
                </div>

                <div style="background-color: #fff3f3; padding: 15px; border-left: 4px solid #f44336; border-radius: 4px; margin-bottom: 25px;">
                  <p style="margin: 0; font-weight: bold;">Catatan Penting:</p>
                  <p style="margin: 5px 0 0; font-size: 14px;">
                    Trial Anda akan berakhir pada <strong>${trialEndDate}</strong>. Untuk terus mendapatkan update tender harian, upgrade paket Anda sebelum masa trial berakhir.
                  </p>
                </div>

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 25px;">
                      <a href="[Link untuk upgrade]" style="display:inline-block;padding:12px 25px;background-color:#1a237e;color:#ffffff;text-decoration:none;border-radius:50px;font-weight:bold;">
                        Upgrade Paket Anda
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 5px; font-weight: bold;">Butuh Bantuan?</p>
                <p style="margin: 0 0 5px;"><a href="mailto:info@pejuangtender.id" style="color: #1a237e;">Email: info@pejuangtender.id</a></p>
                <p style="margin: 0 0 20px;"><a href="https://wa.me/6282284783855" style="color: #1a237e;">WhatsApp: +62822 8478 3855</a></p>
              </td>
            </tr>
            
            <tr>
              <td style="padding: 20px 30px 40px 30px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
                <p style="margin: 0;">&copy; 2025 pejuangtender.id. All rights reserved.</p>
                <p style="margin: 5px 0 0;">“Tender Tepat, Lebih Cepat”</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};