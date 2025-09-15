// src/lib/emailTemplates/subscriptionWelcome.ts

export const subscriptionWelcomeTemplate = (name: string, packageName: string): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selamat Bergabung dengan pejuangtender.id!</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
      @media only screen and (max-width: 600px) {
        .inner-container { padding: 20px !important; }
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
                  Selamat Bergabung!
                </h1>
                <p style="margin-top: 10px; font-size: 16px; color: #666666;">
                  Paket Anda sudah aktif.
                </p>
              </td>
            </tr>
            
            <tr>
              <td class="inner-container" style="padding: 40px 30px;">
                <p style="margin: 0 0 20px;">Halo ${name},</p>
                <p style="margin: 0 0 20px;">
                  Terima kasih telah mempercayakan pejuangtender.id untuk membantu perjalanan Anda memenangkan tender. Kami senang memberi tahu bahwa paket <strong>${packageName}</strong> Anda sudah aktif mulai hari ini.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 15px; background-color: #f9f9f9; font-weight: bold; color: #1a237e;">
                      Mulai Sekarang, Anda Akan Mendapatkan:
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px; background-color: #ffffff;">
                      <ul style="margin: 0; padding-left: 20px; list-style: disc;">
                        <li style="margin-bottom: 10px;">Daftar tender terbaru sesuai kategori & keyword pilihan Anda.</li>
                        <li style="margin-bottom: 10px;">Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.</li>
                        <li style="margin-bottom: 10px;">Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.</li>
                        <li>Akses terhadap lebih banyak LPSE sesuai paket Anda.</li>
                      </ul>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 10px; font-weight: bold;">Tips Memaksimalkan Paket Anda:</p>
                <ul style="margin: 0 0 20px; padding-left: 20px; list-style: disc;">
                  <li style="margin-bottom: 5px;">Gunakan lebih banyak keyword untuk menjangkau peluang tender yang lebih luas.</li>
                  <li style="margin-bottom: 5px;">Cek email update tender setiap pagi untuk melihat peluang terbaru.</li>
                  <li style="margin-bottom: 5px;">Simpan atau tandai tender yang menarik.</li>
                  <li>Segera hubungi instansi untuk tender yang sesuai.</li>
                </ul>

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