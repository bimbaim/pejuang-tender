// src/lib/emailTemplates/dailyTenderPaid.ts

// ✅ Diperbarui: Interface Tender tetap sama
interface Tender {
  title: string;
  agency: string;
  budget: string;
  source_url: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://pejuang-tender.vercel.app";

/**
 * Helper function to generate HTML for a single tender table for PAID users.
 * Menambahkan kolom HPS.
 */
const generateTenderTableHtml = (
  tenders: Tender[],
  subHeading: string = ""
): string => {
  const tenderListHtml = tenders
    .map((tender, index) => {
      // 1. Encode URL SPSE
      const encodedUrl = encodeURIComponent(tender.source_url);

      // 2. Buat URL pengalihan (redirect URL)
      // Menggunakan BASE_URL/redirect?url=...
      const redirectUrl = `${BASE_URL}/redirect?url=${encodedUrl}`;

      return `
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
      <td style="padding:8px 10px;border-bottom:1px solid #e0e0e0;font-size:13px;color:#333;text-align:left;">Rp. ${
        tender.budget
      }</td>
      <td style="padding:8px 10px;border-bottom:1px solid #e0e0e0;font-size:13px;text-align:left;">
        <a href="${
          // Menggunakan redirectUrl yang baru
          redirectUrl
        }" style="color:#0093dd;text-decoration:underline;">Link SPSE</a>
      </td>
    </tr>`;
    })
    .join("");

  return `
    ${
      subHeading
        ? `
      <tr>
        <td style="padding:20px 20px 10px;">
          <p style="margin:0;font-size:14px;font-weight:700;color:#0093dd;">${subHeading}</p>
        </td>
      </tr>`
        : ""
    }

    <tr>
      <td style="padding:0 20px 20px;">
        <table class="user-table" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #ddd;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:10px;font-size:13px;text-align:left;">No</th>
              <th style="padding:10px;font-size:13px;text-align:left;">Nama</th>
              <th style="padding:10px;font-size:13px;text-align:left;">Instansi</th>
              <th style="padding:10px;font-size:13px;text-align:left;">HPS</th>
              <th style="padding:10px;font-size:13px;text-align:left;">Link SPSE</th>
            </tr>
          </thead>
          <tbody>
            ${
              tenders.length > 0
                ? tenderListHtml
                : `<tr><td colspan="5" style="padding:15px;text-align:center;color:#666;">Tidak ada tender baru yang ditemukan hari ini.</td></tr>`
            }
          </tbody>
        </table>
      </td>
    </tr>
  `;
};

/**
 * Generates the daily email template with a list of tenders for paid users.
 * @param name The user's name.
 * @param category The selected category (formatted string).
 * @param spse The selected SPSE sites (formatted string).
 * @param keyword The selected keywords (formatted string).
 * @param mainTenders Tenders matching all criteria.
 * @param similarTendersOtherSPSE Tenders matching category/keyword but in other SPSE.
 * @param similarTendersSameSPSE Tenders matching category/keyword in the selected SPSE.
 * @returns The complete HTML string for the email.
 */
export const dailyTenderPaidEmailTemplate = (
  name: string,
  // ✅ PENAMBAHAN PARAMETER BARU UNTUK PAID USER
  category: string,
  spse: string,
  keyword: string,
  mainTenders: Tender[],
  similarTendersOtherSPSE: Tender[],
  similarTendersSameSPSE: Tender[]
): string => {
  // Format tanggal hari ini (misalnya: 25 September 2025)
  // const today = new Date().toLocaleDateString("id-ID", {
  //   day: "numeric",
  //   month: "long",
  //   year: "numeric",
  // });

  // ✅ GENERASI 3 TABEL
  const mainTenderTable = generateTenderTableHtml(mainTenders);
  const otherSpseTable = generateTenderTableHtml(
    similarTendersOtherSPSE,
    "Tender Serupa di SPSE Lain"
  );
  const sameSpseTable = generateTenderTableHtml(
    similarTendersSameSPSE,
    "Tender Lain di SPSE Pilihan Anda"
  );

  // Hapus kode map awal (tenderListHtml) dari fungsi ini
  // karena sudah dipindahkan ke generateTenderTableHtml dan akan diganti
  // dengan variabel mainTenderTable, dll.

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
                <p style="margin:0;font-size:18px;font-weight:700;color:#0093dd;">halo ${name}, 👋</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:10px 20px;">
                <p style="margin:0;font-size:16px;font-weight:700;">DAFTAR TENDER TERBARU</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 20px 20px;">
                <p style="margin:0;font-size:14px;color:#555;">Berikut adalah daftar tender terbaru sesuai kategori: <strong>${category}</strong>, SPSE: <strong>${spse}</strong> & keyword: <strong>${keyword}</strong> yang Anda pilih:</p>
              </td>
            </tr>

            ${mainTenderTable}

            <tr>
                <td style="padding:0 20px 20px;">
                    <p style="margin:0;font-size:14px;color:#555;">
                        Mau ubah keyword atau target SPSE? Hubungi&nbsp;<a href="mailto:info@pejuangtender.id" style="color:#0093dd;text-decoration:underline;font-weight:bold;">info@pejuangtender.id</a>. Sementara itu, cek beberapa tender serupa yang mungkin cocok buat Anda.
                    </p>
                </td>
            </tr>
            
            ${
              // CONDITIONALLY HIDE TABLE 2 IF ARRAY IS EMPTY
              similarTendersOtherSPSE.length > 0
                ? otherSpseTable
                : ''
            }
            
            ${
              // CONDITIONALLY HIDE TABLE 3 IF ARRAY IS EMPTY
              similarTendersSameSPSE.length > 0
                ? sameSpseTable
                : ''
            }


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