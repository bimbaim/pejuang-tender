// File: src/lib/emailTemplates/reminderTrial.ts

/**
 * Generates the email template for a 2-day trial expiration reminder.
 * @param name The user's name.
 * @param trialEndDate The end date of the user's trial period.
 * @returns The complete HTML string for the email.
 */
export const reminderTrialEmailTemplate = (name: string, trialEndDate: string): string => {
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
                  <p style="font-size: 16px; font-family: Saira, sans-serif; margin: 0; text-align: left;">Pengingat Penting!</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0 20px;">
                  <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%; text-align: left;">
                    Terima kasih sudah menggunakan pejuangtender.id selama masa trial Anda. Kami harap Anda sudah menemukan peluang tender sesuai kategori & keyword pilihan Anda.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0 20px;">
                  <div style="background-color: #fff3f3; border-radius: 10px; padding: 20px; text-align: left;">
                    <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%;">
                      Trial Anda akan berakhir dalam **2 hari**, tepat pada <strong>${trialEndDate}</strong>. Setelah itu, Anda tidak akan lagi menerima update tender harian.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0 20px;">
                  <p style="font-size: 16px; font-family: Quicksand, sans-serif; margin: 0; line-height: 150%; text-align: left;">
                    Agar tetap mendapatkan update tender terbaru tanpa terlewat, segera upgrade paket Anda sekarang.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom: 25px;">
                  <a href="https://pejuangtender.id/#paket" style="display:inline-block;padding:12px 25px;background-color:#0093dd;color:#ffffff;text-decoration:none;border-radius:12px;font-size: 16px; font-weight: bold;">
                    UPGRADE SEKARANG
                  </a>
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