// src/lib/emailTemplates/subscriptionWelcome.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://pejuang-tender.vercel.app';

export const subscriptionWelcomeTemplate = (
  name: string,
  packageName: string
): string => {
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
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a[x-apple-data-detectors] { 
      color: inherit !important; 
      text-decoration: none !important; 
      font-size: inherit !important; 
      font-family: inherit !important; 
      font-weight: inherit !important; 
      line-height: inherit !important; 
    }
    @media only screen and (max-width: 600px) {
      .inner-container { padding: 20px !important; }
      .footer-columns { display: block !important; width: 100% !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Saira, Quicksand, sans-serif;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;">
    <tr>
      <td align="center" style="background-color:#f4f4f4; padding:20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- HEADER: Logo + Text -->
          <tr>
            <td align="center" style="padding:30px 20px 20px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding-right: 10px;">
                    <img src="${BASE_URL}/images/logo-footer.png" alt="PEJUANG Tender Logo" width="50" height="50" style="display:block;">
                  </td>
                  <td style="text-align: left; vertical-align: middle; font-family: Saira, sans-serif;">
                    <p style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.2;">PEJUANG</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 400; line-height: 1.2;">TENDER</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Header Text -->
          <tr>
            <td style="padding:10px 30px 20px 30px; text-align:center; border-bottom:1px solid #eeeeee;">
              <h1 style="margin:0; font-size:24px; font-weight:bold; color:#1a237e;">
                Selamat Bergabung, ${name}! 🎉
              </h1>
              <p style="margin-top:10px; font-size:16px; color:#666666;">
                Paket <strong>${packageName}</strong> Anda sudah aktif 🚀
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="inner-container" style="padding:30px;">
              <p style="margin:0 0 20px; font-size:16px;">
                Terima kasih telah mempercayakan <strong>pejuangtender.id</strong> untuk membantu perjalanan Anda memenangkan tender.
              </p>
              <p>Kami senang memberi tahu bahwa paket <strong>${packageName}</strong> Anda sudah aktif mulai hari ini.</p>

              <!-- Highlight -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:15px; background-color:#f9f9f9; font-weight:bold; color:#1a237e;">
                    Mulai Sekarang, Anda Akan Mendapatkan:
                  </td>
                </tr>
                <tr>
                  <td style="padding:15px; background-color:#ffffff;">
                    <ul style="margin:0; padding-left:20px; list-style:disc;">
                      <li style="margin-bottom:10px;">Daftar tender terbaru sesuai kategori & keyword pilihan Anda.</li>
                      <li style="margin-bottom:10px;">Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.</li>
                      <li style="margin-bottom:10px;">Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.
</li>
                      <li>Info terhadap lebih banyak LPSE</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Tips -->
              <p style="margin:0 0 10px; font-weight:bold;">Tips Memaksimalkan Paket Anda:</p>
              <ul style="margin:0 0 20px; padding-left:20px; list-style:disc;">
                <li style="margin-bottom:5px;">Gunakan lebih banyak keyword untuk peluang tender lebih luas.</li>
                <li style="margin-bottom:5px;">Cek email update tender setiap pagi untuk melihat peluang terbaru.
</li>
                <li style="margin-bottom:5px;">Simpan atau tandai tender yang menarik agar mudah diakses nanti.</li>
                <li>Segera hubungi instansi atau siapkan dokumen jika menemukan tender yang sesuai.</li>
              </ul>
            </td>
          </tr>

          <!-- FOOTER: Black with Two Columns -->
          <tr>
            <td align="center" style="background-color: #000000; padding: 10px 20px 20px; border-radius: 0 0 8px 8px;">
              <!-- Logo -->
              <img src="${BASE_URL}/images/logo-footer.png" 
                   alt="Pejuang Tender Logo" 
                   width="60" 
                   height="60" 
                   style="display: block; margin: -40px auto 20px auto;">
              
              <!-- Two Columns -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <!-- Left -->
                  <td class="footer-columns" valign="top" style="color: #ffffff; font-family: Quicksand, sans-serif; font-size: 13px; line-height: 1.6; text-align: left; padding-right: 10px;">
                    <p style="margin: 0;">Selamat berjuang & semoga sukses memenangkan tender!</p>
                    <p style="margin: 0;">Salam,</p>
                    <p style="margin: 0;">Tim pejuangtender.id</p>
                    <p style="margin: 0; font-weight: 700;">“Tender Tepat, Lebih Cepat”</p>
                  </td>

                  <!-- Right -->
                  <td class="footer-columns" valign="top" style="color: #ffffff; font-family: Quicksand, sans-serif; font-size: 13px; line-height: 1.6; text-align: right; padding-left: 10px;">
                    <p style="margin: 0; font-weight: 700;">BUTUH BANTUAN?</p>
                    <p style="margin: 0;">Email: <a href="mailto:info@pejuangtender.id" style="color: #ffffff; text-decoration: none;">info@pejuangtender.id</a></p>
                    <p style="margin: 0;">WhatsApp: <a href="https://wa.me/6282284783855" style="color: #ffffff; text-decoration: none;">+62 822 8478 3855</a></p>
                  </td>
                </tr>
              </table>
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
