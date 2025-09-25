// src/lib/emailTemplates/dailyTenderTrial.ts

interface Tender {
    title: string;
    agency: string;
    budget: number;
    // ✅ PERBAIKAN: Ganti 'url' menjadi 'source_url'
    source_url: string;
    end_date: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://pejuang-tender.vercel.app";

/**
 * Generates the daily email template with a list of tenders for trial users.
 * @param name The user's name.
 * @param tenders An array of tender objects to display.
 * @param trialEndDate The end date of the user's trial period.
 * @returns The complete HTML string for the email.
 */
export const dailyTenderTrialEmailTemplate = (
  tenders: Tender[],
  trialEndDate: string
): string => {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tenderListHtml = tenders
    .map(
      (tender, index) => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #e0e0e0;font-size:13px;color:#333;text-align:left;">${
        index + 1
      }</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e0e0e0;font-size:13px;color:#333;text-align:left;">${
        tender.title
      }</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e0e0e0;font-size:13px;color:#333;text-align:left;">${
        tender.agency
      }</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e0e0e0;font-size:13px;text-align:left;">
        <a href="${tender.source_url}" style="color:#0093dd;text-decoration:underline;">Link SPSE</a>
      </td>
    </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Update Tender Harian</title>
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
            
            <!-- HEADER -->
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
            
            <!-- TITLE DATE -->
            <tr>
              <td align="center" style="padding:0 20px 20px;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#0093dd;">Update Tender Hari Ini ${today}</p>
              </td>
            </tr>

            <!-- TABLE -->
            <tr>
              <td style="padding:0 20px 20px;">
                <table class="user-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #ddd;">
                  <thead>
                    <tr style="background:#f5f5f5;">
                      <th style="padding:10px;font-size:13px;text-align:left;">No</th>
                      <th style="padding:10px;font-size:13px;text-align:left;">Nama</th>
                      <th style="padding:10px;font-size:13px;text-align:left;">Instansi</th>
                      <th style="padding:10px;font-size:13px;text-align:left;">Link SPSE</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      tenders.length > 0
                        ? tenderListHtml
                        : `<tr><td colspan="4" style="padding:15px;text-align:center;color:#666;">Tidak ada tender baru yang ditemukan hari ini.</td></tr>`
                    }
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- TIPS -->
            <tr>
              <td style="padding:0 20px 20px;">
                <div style="background:#e5f4fb;border-radius:8px;padding:15px;text-align:left;">
                  <p style="margin:0 0 8px;font-weight:bold;">TIPS:</p>
                  <ul style="margin:0;padding-left:20px;">
                    <li style="margin-bottom:5px;">Cek detail tender sesegera mungkin sebelum batas waktu berakhir.</li>
                    <li>Simpan tender yang relevan untuk persiapan dokumen penawaran.</li>
                  </ul>
                </div>
              </td>
            </tr>

            <!-- TRIAL INFO -->
            <tr>
              <td style="padding:0 20px 20px;">
                <div style="background:#fff3f3;border-radius:8px;padding:15px;text-align:left;">
                  <p style="margin:0 0 8px;font-weight:bold;">Catatan Penting:</p>
                  <p style="margin:0;">Trial Anda akan berakhir pada <strong>${trialEndDate}</strong>. Untuk terus mendapatkan update tender harian, upgrade paket Anda sebelum masa trial berakhir.</p>
                </div>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:10px 20px 30px;">
               <a href="${BASE_URL}/#paket" class="btn" style="display:inline-block;padding:12px 25px;background:#0093dd;color:#fff; text-decoration:none;border-radius:8px;font-weight:bold;width:auto;max-width:100%;text-align:center;">UPGRADE SEKARANG</a>
              </td>
            </tr>

          </table>

          <!-- FOOTER -->
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

