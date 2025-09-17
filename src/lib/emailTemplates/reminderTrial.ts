// File: src/lib/emailTemplates/reminderTrial.ts

/**
 * Generates the email template for a 2-day trial expiration reminder.
 * @param name The user's name.
 * @param trialEndDate The end date of the user's trial period.
 * @returns The complete HTML string for the email.
 */
export const reminderTrialEmailTemplate = (
  name: string,
  trialEndDate: string
): string => {
  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pengingat Masa Percobaan</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    @media only screen and (max-width: 640px) {
      .email-container { width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; text-align: center; font-family: Saira, Quicksand, sans-serif;">

  <div style="background-color: #f4f4f4; padding: 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="640" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; font-family: Saira, Quicksand, sans-serif; color: #000000;">
      <tr>
        <td style="padding: 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            
            <!-- LOGO & BRAND -->
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                  <tr>
                    <!-- Logo -->
                    <td style="padding-right: 10px;">
                      <img src="https://pejuang-tender.vercel.app/images/logo-footer.png" 
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

            <!-- GREETING -->
            <tr>
              <td style="padding: 20px 0 10px;">
                <p style="font-size: 20px; font-weight: 700; margin: 0; text-align: center; font-family: Saira, sans-serif;">
                  HALO ${name}, 👋
                </p>
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="padding: 10px 0;">
                <p style="font-size: 16px; font-weight: 700; margin: 0; text-align: left; font-family: Saira, sans-serif;">
                  Pengingat Penting!
                </p>
              </td>
            </tr>

            <!-- MESSAGE -->
            <tr>
              <td style="padding: 10px 0 20px;">
                <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%; text-align: left;">
                  Terima kasih sudah menggunakan pejuangtender.id selama masa trial Anda. Kami harap Anda sudah menemukan peluang tender sesuai kategori & keyword pilihan Anda.
                </p>
              </td>
            </tr>

            <!-- ALERT BOX -->
            <tr>
              <td style="padding: 10px 0 20px;">
                <div style="background-color: #fff3f3; border-radius: 10px; padding: 20px; text-align: left;">
                  <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%;">
                    Trial Anda akan berakhir dalam <strong>2 hari</strong>, tepat pada <strong>${trialEndDate}</strong>. Setelah itu, Anda tidak akan lagi menerima update tender harian.
                  </p>
                </div>
              </td>
            </tr>

            <!-- CALL TO ACTION -->
            <tr>
              <td style="padding: 10px 0 20px;">
                <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%; text-align: left;">
                  Agar tetap mendapatkan update tender terbaru tanpa terlewat, segera upgrade paket Anda sekarang.
                </p>
              </td>
            </tr>

            <!-- BUTTON -->
            <tr>
              <td align="center" style="padding-bottom: 25px;">
                <a href="https://pejuangtender.id/#paket" style="display:inline-block;padding:12px 25px;background-color:#0093dd;color:#ffffff;text-decoration:none;border-radius:12px;font-size: 16px; font-weight: bold;">
                  UPGRADE SEKARANG
                </a>
              </td>
            </tr>
          </table>

          <!-- FOOTER -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="background-color: #000000; padding: 10px 20px 20px; position: relative; border-radius: 0 0 10px 10px;">
                <!-- Logo -->
                <img src="https://pejuang-tender.vercel.app/images/logo-footer.png" 
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
                      <p style="margin: 0;">WhatsApp: <a href="https://wa.me/6282248783555" style="color: #ffffff; text-decoration: none;">+62 822 8478 3555</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </div>

</body>
</html>
  `;
};
