// src/lib/emailTemplates/trialWelcome.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://pejuang-tender.vercel.app.";

export const trialWelcomeTemplate = (name: string, trialEndDate: string): string => {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Selamat Datang di pejuangtender.id!</title>
    <style>
      @media only screen and (max-width:600px) {
        .container { width:100% !important; padding:10px !important; }
        .content { padding:15px !important; }
        .btn { display:block !important; width:100% !important; text-align:center !important; }
        table.user-table th, table.user-table td { font-size:12px !important; padding:6px !important; }
      }
        @media only screen and (max-width:600px) {
          .btn {
            display:block !important;
            width:100% !important;
            box-sizing:border-box !important;
          }
        }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Quicksand,Arial,sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:20px;">
          <table class="container" width="600" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:10px;overflow:hidden;">
            
            <tr>
              <td align="center" style="padding:20px;">
                <table border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td style="padding-right:10px;">
                      <img src="${BASE_URL}/images/logo-footer.png" alt="Logo" width="50" height="50" style="display:block;">
                    </td>
                    <td style="text-align:left;vertical-align:middle;">
                      <p style="margin:0;font-size:18px;font-weight:700;">PEJUANG</p>
                      <p style="margin:0;font-size:16px;">TENDER</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <tr>
              <td align="center" style="padding:0 20px 10px;">
                <p style="margin:0;font-size:20px;font-weight:700;color:#0093dd;">Selamat Datang di pejuangtender.id!</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 20px 20px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#555;">Trial Anda telah aktif.</p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px;">
                <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.5;text-align:left;">Halo ${name},</p>
                <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.5;text-align:left;">
                  Terima kasih telah mencoba pejuangtender.id! Selama **7 hari** ke depan, Anda akan menerima update tender harian langsung di email ini, sesuai kategori & keyword yang Anda pilih saat pendaftaran.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td style="padding:10px 15px;background:#e5f4fb;font-weight:bold;font-size:14px;color:#0093dd;text-align:left;">
                      Yang Akan Anda Terima Setiap Hari
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:15px;background:#ffffff;font-size:14px;color:#333;text-align:left;">
                      <ul style="margin:0;padding-left:20px;list-style:disc;line-height:1.5;">
                        <li style="margin-bottom:5px;">Daftar tender terbaru sesuai kategori & keyword pilihan Anda.</li>
                        <li style="margin-bottom:5px;">Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.</li>
                        <li>Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <div style="background:#f9f9f9;border-radius:8px;padding:15px;text-align:left;">
                  <p style="margin:0 0 8px;font-weight:bold;font-size:14px;">TIPS Memaksimalkan Trial Anda:</p>
                  <ul style="margin:0;padding-left:20px;font-size:14px;color:#333;line-height:1.5;">
                    <li style="margin-bottom:5px;">Cek email update tender setiap pagi untuk melihat peluang terbaru.</li>
                    <li style="margin-bottom:5px;">Simpan atau tandai tender yang menarik agar mudah diakses nanti.</li>
                    <li>Segera hubungi instansi atau siapkan dokumen jika menemukan tender yang sesuai.</li>
                  </ul>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <div style="background:#fff3f3;border-radius:8px;padding:15px;text-align:left;">
                  <p style="margin:0 0 5px;font-weight:bold;font-size:14px;">Catatan Penting:</p>
                  <p style="margin:0;font-size:14px;color:#333;">Trial Anda akan berakhir pada **${trialEndDate}**. Untuk terus mendapatkan update tender harian, upgrade paket Anda sebelum masa trial berakhir.</p>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:10px 20px 30px;">
                    <a href="${BASE_URL}/#paket" class="btn" 
                      style="display:inline-block;padding:12px 25px;background:#0093dd;color:#fff;
                              text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;
                              width:auto;max-width:100%;text-align:center;">
                      UPGRADE PAKET ANDA
                    </a>
              </td>
            </tr>
            
          </table>

          <table width="600" class="container" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#000;border-radius:10px;margin-top:20px;color:#fff;">
            <tr>
              <td style="padding:20px;text-align:left;font-size:14px;">
                <p style="margin:0;">Selamat berjuang & semoga sukses memenangkan tender!</p>
                <p style="margin:0;">Salam,</p>
                <p style="margin:0;">Tim pejuangtender.id</p>
                <p style="margin:0;font-weight:bold;">“Tender Tepat, Lebih Cepat”</p>
              </td>
              <td style="padding:20px;text-align:right;font-size:14px;">
                <p style="margin:0;font-weight:bold;">BUTUH BANTUAN?</p>
                <p style="margin:0;">Email: <a href="mailto:info@pejuangtender.id" style="color:#fff;text-decoration:none;">info@pejuangtender.id</a></p>
                <p style="margin:0;">WhatsApp: <a href="https://wa.me/6282248783555" style="color:#fff;text-decoration:none;">+62 822 8478 3555</a></p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>`;
};