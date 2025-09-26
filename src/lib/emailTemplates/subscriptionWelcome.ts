// src/lib/emailTemplates/subscriptionWelcome.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://pejuang-tender.vercel.app";

export const subscriptionWelcomeTemplate = (
  name: string,
  packageName: string
): string => {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Selamat Bergabung dengan pejuangtender.id!</title>
    <style>
      @media only screen and (max-width:600px) {
        .container { width:100% !important; padding:10px !important; }
        .content { padding:15px !important; }
        .btn { display:block !important; width:100% !important; text-align:center !important; }
        .footer-columns { display:block !important; width:100% !important; text-align:center !important; padding:5px 0 !important; }
        .footer-columns p { text-align:center !important; }
      }
        @media only screen and (max-width:600px) {
          .btn {
            display:block !important;
            width:100% !important;
            box-sizing:border-box !important;
          }

          .stack { 
              display: block !important; 
              width: 100% !important; 
              /* Pastikan teks rata kiri saat bertumpuk */
              text-align: left !important; 
              padding-bottom: 0px !important; /* Kurangi padding bawah */
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
                <p style="margin:0;font-size:20px;font-weight:700;color:#0093dd;">Selamat Bergabung, ${name}! 🎉</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 20px 20px;border-bottom:1px solid #eee;">
                <p style="margin:0 0 10px 0;font-size:16px;font-weight:700;color:#555;">Paket ${packageName} Anda sudah aktif 🚀</p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 20px 10px 20px;">
                <p style="margin:0 0 15px;font-size:14px;color:#333;line-height:1.5;text-align:left;">
                  Terima kasih telah mempercayakan **pejuangtender.id** untuk membantu perjalanan Anda memenangkan tender.
                </p>
                <p style="margin:0 0 15px;font-size:14px;color:#333;line-height:1.5;text-align:left;">
                  Kami senang memberi tahu bahwa paket **${packageName}** Anda sudah **aktif** mulai hari ini.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td style="padding:10px 15px;background:#e5f4fb;font-weight:bold;font-size:14px;color:#0093dd;text-align:left;">
                      Mulai Sekarang, Anda Akan Mendapatkan:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:15px;background:#ffffff;font-size:14px;color:#333;text-align:left;">
                      <ul style="margin:0;padding-left:20px;list-style:disc;line-height:1.5;">
                        <li style="margin-bottom:5px;">Daftar tender terbaru sesuai kategori & keyword pilihan Anda.</li>
                        <li style="margin-bottom:5px;">Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.</li>
                        <li style="margin-bottom:5px;">Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.</li>
                        <li>Info terhadap lebih banyak LPSE.</li>
                      </ul>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 30px;">
                <div style="background:#f9f9f9;border-radius:8px;padding:15px;text-align:left;">
                  <p style="margin:0 0 8px;font-weight:bold;font-size:14px;">TIPS Memaksimalkan Paket Anda:</p>
                  <ul style="margin:0;padding-left:20px;font-size:14px;color:#333;line-height:1.5;">
                    <li style="margin-bottom:5px;">Gunakan lebih banyak keyword untuk peluang tender lebih luas.</li>
                    <li style="margin-bottom:5px;">Cek email update tender setiap pagi untuk melihat peluang terbaru.</li>
                    <li style="margin-bottom:5px;">Simpan atau tandai tender yang menarik agar mudah diakses nanti.</li>
                    <li>Segera hubungi instansi atau siapkan dokumen jika menemukan tender yang sesuai.</li>
                  </ul>
                </div>
              </td>
            </tr>
            
          </table>

<table width="600" class="container" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#000;border-radius:10px;margin-top:20px;color:#fff;">
    <tr>
        <td class="stack" width="50%" style="padding:20px;text-align:left;font-size:14px;">
            <p style="margin:0;">Selamat berjuang & semoga sukses memenangkan tender!</p>
            <p style="margin:0;">Salam,</p>
            <p style="margin:0;">Tim pejuangtender.id</p>
            <p style="margin:0;font-weight:bold;">“Tender Tepat, Lebih Cepat”</p>
        </td>
        <td class="stack" width="50%" style="padding:20px;text-align:right;font-size:14px;">
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
