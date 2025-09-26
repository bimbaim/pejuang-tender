// File: src/lib/emailTemplates/reminderTrial.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://pejuang-tender.vercel.app.";

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
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Pengingat Masa Percobaan</title>
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
                <p style="margin:0;font-size:20px;font-weight:700;color:#000;">HALO ${name}, 👋</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:10px 20px;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#dc3545;">PENGINGAT MASA PERCOBAAN</p>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 20px 20px;">
                <p style="margin:0;font-size:14px;color:#555;line-height:1.5;text-align:left;">
                  Terima kasih sudah menggunakan pejuangtender.id selama masa trial Anda. Kami harap Anda sudah menemukan peluang tender sesuai kategori & keyword pilihan Anda.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <div style="background:#fff3f3;border-radius:8px;padding:15px;text-align:left;border:1px solid #dc3545;">
                  <p style="margin:0 0 8px;font-weight:bold;color:#dc3545;">PERHATIAN:</p>
                  <p style="margin:0;font-size:14px;color:#333;">Trial Anda akan berakhir dalam waktu dekat, tepat pada <strong>${trialEndDate}</strong>. Setelah itu, Anda tidak akan lagi menerima update tender harian.</p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:10px 20px 20px;">
                <p style="margin:0;font-size:14px;color:#555;line-height:1.5;text-align:left;">
                  Agar tetap mendapatkan update tender terbaru tanpa terlewat, segera upgrade paket Anda sekarang.
                </p>
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
