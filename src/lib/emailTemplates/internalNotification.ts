// src/lib/emailTemplates/internalNotification.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://pejuang-tender.vercel.app.";

export const internalNotificationTemplate = (
  name: string,
  email: string,
  trialEndDate: string
): string => {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>NOTIFIKASI: Pendaftaran Trial Baru</title>
    <style>
      @media only screen and (max-width:600px) {
        .container { width:100% !important; padding:10px !important; }
        .content { padding:15px !important; }
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
              text-align: left !important; 
              padding:20px 0 !important; 
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
                <p style="margin:0;font-size:22px;font-weight:700;color:#d9534f;">🚨 NOTIFIKASI INTERNAL 🚨</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 20px 20px;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#555;">Pendaftaran Trial Baru Berhasil!</p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px;">
                <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.5;text-align:left;">Halo Tim pejuangtender.id,</p>
                <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.5;text-align:left;">
                  Ada pengguna baru yang mendaftar untuk **Trial 7 Hari**. Berikut adalah detail pendaftar:
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <table class="user-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #ddd;border-radius:8px;overflow:hidden;font-size:14px;">
                  <tr>
                    <th width="30%" style="padding:10px 15px;background:#f0f0f0;font-weight:bold;color:#333;text-align:left;">Nama Pendaftar</th>
                    <td style="padding:10px 15px;background:#ffffff;color:#333;text-align:left;">${name}</td>
                  </tr>
                  <tr>
                    <th style="padding:10px 15px;background:#f0f0f0;font-weight:bold;color:#333;text-align:left;">Email</th>
                    <td style="padding:10px 15px;background:#ffffff;color:#333;text-align:left;"><a href="mailto:${email}" style="color:#0093dd;text-decoration:none;">${email}</a></td>
                  </tr>
                  <tr>
                    <th style="padding:10px 15px;background:#f0f0f0;font-weight:bold;color:#333;text-align:left;">Akhir Masa Trial</th>
                    <td style="padding:10px 15px;background:#ffffff;color:#d9534f;font-weight:bold;text-align:left;">${trialEndDate}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 20px 20px;">
                <div style="background:#e5f4fb;border-radius:8px;padding:15px;text-align:left;">
                  <p style="margin:0 0 8px;font-weight:bold;font-size:14px;color:#0093dd;">TINDAK LANJUT:</p>
                  <ul style="margin:0;padding-left:20px;font-size:14px;color:#333;line-height:1.5;">
                    <li style="margin-bottom:5px;">Pastikan email selamat datang telah berhasil terkirim.</li>
                    <li style="margin-bottom:5px;">Tambahkan kontak ini ke sistem CRM/Leads Anda.</li>
                    <li>Rencanakan follow-up sebelum tanggal ${trialEndDate}.</li>
                  </ul>
                </div>
              </td>
            </tr>

            
          </table>

          <table width="600" class="container" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#000;border-radius:10px;margin-top:20px;color:#fff;">
              <tr>
                  <td class="stack" width="50%" style="text-align:left;font-size:14px;">
                      <p style="margin:0;">Selamat berjuang & semoga sukses memenangkan tender!</p>
                      <p style="margin:0;">Salam,</p>
                      <p style="margin:0;">Tim <a href="https://pejuangtender.id" style="color:#fff; text-decoration: none;">pejuangtender.id</a></p>
                      <p style="margin:0;font-weight:bold;">“Tender Tepat, Lebih Cepat”</p>
                  </td>
                  <td class="stack" width="50%" style="text-align:right;font-size:14px;">
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