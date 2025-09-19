// src/lib/emailTemplates/trialWelcome.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://pejuang-tender.vercel.app.";

export const trialWelcomeTemplate = (name: string, trialEndDate: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selamat Datang di pejuangtender.id!</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
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
      .button { width: 100% !important; }
    }
      .button-link {
            display: inline-block;
            padding: 12px 25px;
            background-color: #4CAF50;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            text-align: center;
        }

        @media screen and (max-width: 600px) {
            .button-link {
                padding: 10px 20px !important;
            }
        }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Saira, Quicksand, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f4f4;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="background-color: #f4f4f4; padding: 20px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- HEADER -->
          <tr>
            <td align="center" style="padding: 30px 20px 20px; border-bottom: 1px solid #eeeeee;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <!-- Logo -->
                  <td style="padding-right: 10px;">
                    <img src="${BASE_URL}/images/logo-footer.png" 
                         alt="PEJUANG Tender Logo" 
                         width="50" 
                         height="50" 
                         style="display: block;">
                  </td>
                  <!-- Text -->
                  <td style="text-align: left; vertical-align: middle; font-family: Saira, sans-serif;">
                    <p style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.2;">PEJUANG</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 400; line-height: 1.2;">TENDER</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- BODY -->
          <tr>
            <td class="inner-container" style="padding: 40px 30px;">
              <h1 style="margin: 0 0 10px; font-size: 24px; font-weight: bold; color: #1a237e;">
                Selamat Datang di pejuangtender.id!
              </h1>
              <p style="margin: 0 0 20px; font-size: 16px; color: #666666;">
                Trial Anda telah aktif.
              </p>

              <p style="margin: 0 0 20px;">Halo ${name},</p>
              <p style="margin: 0 0 20px;">
                Terima kasih telah mencoba pejuangtender.id! Selama <strong>7 hari</strong> ke depan, Anda akan menerima update tender harian langsung di email ini, sesuai kategori & keyword yang Anda pilih saat pendaftaran.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 15px; background-color: #f9f9f9; font-weight: bold; color: #1a237e;">
                    Yang Akan Anda Terima Setiap Hari
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #ffffff;">
                    <ul style="margin: 0; padding-left: 20px; list-style: disc;">
                      <li style="margin-bottom: 10px;">Daftar tender terbaru sesuai kategori & keyword pilihan Anda.</li>
                      <li style="margin-bottom: 10px;">Informasi lengkap: nama paket, instansi, nilai proyek, dan batas waktu.</li>
                      <li>Link langsung ke sumber LPSE resmi untuk detail lebih lanjut.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-weight: bold;">Tips Memaksimalkan Trial Anda:</p>
              <ul style="margin: 0 0 20px; padding-left: 20px; list-style: disc;">
                <li style="margin-bottom: 5px;">Cek email update tender setiap pagi.</li>
                <li style="margin-bottom: 5px;">Simpan atau tandai tender yang menarik.</li>
                <li>Segera hubungi instansi untuk tender yang sesuai.</li>
              </ul>

              <div style="background-color: #f7f9fc; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 4px; margin-bottom: 25px;">
                <p style="margin: 0; font-weight: bold;">Catatan Penting:</p>
                <p style="margin: 5px 0 0; font-size: 14px;">
                  Trial Anda akan berakhir pada <strong>${trialEndDate}</strong>. Untuk terus mendapatkan update tender harian, upgrade paket Anda sebelum masa trial berakhir.
                </p>
              </div>

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 25px;">
                      <a href="${BASE_URL}/#paket" class="button-link">
                          Upgrade Paket Anda
                      </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td align="center" style="background-color: #000000; padding: 10px 20px 20px; position: relative; border-radius: 0 0 8px 8px;">
              <!-- Logo Footer -->
              <img src="${BASE_URL}/images/logo-footer.png" 
                   alt="Pejuang Tender Logo" 
                   width="60" 
                   height="60" 
                   style="display: block; margin: -40px auto 20px auto;">
              
              <!-- Two Columns -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <!-- Left Column -->
                  <td valign="top" style="color: #ffffff; font-family: Quicksand, sans-serif; font-size: 14px; line-height: 1.6; text-align: left; padding-right: 10px;">
                    <p style="margin: 0;">Selamat berjuang & semoga sukses memenangkan tender!</p>
                    <p style="margin: 0;">Salam,</p>
                    <p style="margin: 0;">Tim pejuangtender.id</p>
                    <p style="margin: 0; font-weight: 700;">“Tender Tepat, Lebih Cepat”</p>
                  </td>

                  <!-- Right Column -->
                  <td valign="top" style="color: #ffffff; font-family: Quicksand, sans-serif; font-size: 14px; line-height: 1.6; text-align: right; padding-left: 10px;">
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