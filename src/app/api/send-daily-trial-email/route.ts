import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Inisialisasi Klien Supabase ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Menggunakan Service Role Key
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Using Service Role Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

// --- Antarmuka (Interfaces) ---
interface SubscriptionWithDetails {
  user_id: string;
  keyword: string[] | null;
  category: string[] | null;
  spse: string[] | null;
  users: {
    name: string;
    email: string;
  };
  end_date: string;
}

interface SupabaseError {
  code: string;
  details: string;
  hint: string;
  message: string;
}

interface Tender {
    id: string;
    title: string;
    agency: string;
    budget: number;
    source_url: string;
    status: string; // Sudah ada
}

type SupabaseQueryResult = {
    data: Tender[] | null;
    error: SupabaseError | null;
}

export async function POST(req: NextRequest) {
  try {
    const today = new Date();
    const sentEmails: string[] = [];

    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select(`user_id, keyword, category, spse, end_date, users(name, email)`)
      .eq("payment_status", "free-trial");

    if (subsError) {
      console.error("Error fetching Trial subscriptions:", subsError.message);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", details: subsError.message },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "No free trial subscriptions found.",
      });
    }

    for (const subscription of subscriptions as unknown as SubscriptionWithDetails[]) {
      const { user_id, keyword, category, spse, users } = subscription;

      if (!users || !users.email) {
        console.warn(`Skipping user ID ${user_id} due to missing email.`);
        continue;
      }
      
      // --- Filter Conditions Helper ---
      const categoryConditions = category?.map((cat) => `category.ilike.%${cat.trim()}%`) || [];
      const spseConditions = spse?.map((site) => `source_url.ilike.%${site.trim()}%`) || [];
      const keywordConditions = keyword?.map((key) => `title.ilike.%${key.trim()}%`) || [];
      const statusConditions = [
        "status.eq.Pengumuman Pascakualifikasi",
        "status.eq.Download Dokumen Pemilihan",
        "status.like.Pengumuman Pascakualifikasi%",
        "status.like.Pengumuman Prakualifikasi%",
        "status.like.Download Dokumen Pemilihan%",
        "status.like.Download Dokumen Kualifikasi%",
      ];
      
      // ----------------------------------------------------------------------
      // --- Query 1: Main Tenders (MENGGUNAKAN LOGIC LAMA/PERMINTAAN USER) ---
      // ----------------------------------------------------------------------
      let mainTenderQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, status, budget, source_url`); // ✅ Sudah benar ada status

      if (category && category.length > 0) {
        mainTenderQuery = mainTenderQuery.or(
          category.map((cat) => `category.ilike.%${cat.trim()}%`).join(",")
        );
      }
      if (spse && spse.length > 0) {
        mainTenderQuery = mainTenderQuery.or(
          spse.map((site) => `source_url.ilike.%${site.trim()}%`).join(",")
        );
      }
      if (keyword && keyword.length > 0) {
        mainTenderQuery = mainTenderQuery.or(
          keyword.map((key) => `title.ilike.%${key.trim()}%`).join(",")
        );
      }
      mainTenderQuery = mainTenderQuery.or(statusConditions.join(","));
      mainTenderQuery = mainTenderQuery
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: mainTenders, error: mainTendersError } = await mainTenderQuery as SupabaseQueryResult;

      // -----------------------------------------------------------------------------------
      // --- Query 2: Similar Tenders Other SPSE (Category AND Keyword AND Status) ---
      // -----------------------------------------------------------------------------------
      let similarTendersOtherSPSEQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, budget, source_url, status`);

      // ✅ PERBAIKAN: Menggunakan .not() dengan format 3 argumen: .not(column, operator, value)
      if (spse && spse.length > 0) {
        spse.forEach((site) => {
            // Kita harus menentukan operator secara eksplisit di sini, yaitu 'ilike'
            similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.not(
                "source_url", 
                "ilike", // Operator yang akan dinegasi
                `%${site.trim()}%`
            );
        });
      }
      
      // Wajib: Status (sebagai AND pertama)
      similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.or(statusConditions.join(","));

      // Wajib: Category (sebagai AND kedua)
      if (categoryConditions.length > 0) {
          similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.or(categoryConditions.join(","));
      }

      // Wajib: Keyword (sebagai AND ketiga)
      if (keywordConditions.length > 0) {
          similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.or(keywordConditions.join(","));
      }

      similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: similarTendersOtherSPSE, error: similarTendersOtherSPSEError } = await similarTendersOtherSPSEQuery as SupabaseQueryResult;

        // ------------------------------------------------------------------------------------------
        // --- Query 3: Similar Tenders Same SPSE (Category AND SPSE AND Status) ---
        // ------------------------------------------------------------------------------------------
        let similarTendersSameSPSEQuery = supabase
          .from("lpse_tenders")
          .select(`id, title, agency, budget, source_url, status`); // ✅ PERBAIKAN: Menambahkan status

        // Wajib: Status (sebagai AND pertama)
        similarTendersSameSPSEQuery = similarTendersSameSPSEQuery.or(statusConditions.join(","));

        // Wajib: Category (sebagai AND kedua)
        if (categoryConditions.length > 0) {
            similarTendersSameSPSEQuery = similarTendersSameSPSEQuery.or(categoryConditions.join(","));
        }

        // Wajib: SPSE (sebagai AND ketiga)
        if (spseConditions.length > 0) {
            similarTendersSameSPSEQuery = similarTendersSameSPSEQuery.or(spseConditions.join(","));
        }

        similarTendersSameSPSEQuery = similarTendersSameSPSEQuery
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: similarTendersSameSPSE, error: similarTendersSameSPSEError } = await similarTendersSameSPSEQuery as SupabaseQueryResult;


      if (mainTendersError || similarTendersOtherSPSEError || similarTendersSameSPSEError) {
        console.error(
          "Error fetching one or more tender types for user",
          user_id,
          ":",
          mainTendersError?.message || similarTendersOtherSPSEError?.message || similarTendersSameSPSEError?.message
        );
        continue;
      }
      
      // --- Formatting Data dan Pengiriman Email ---
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
      const formattedCategory = (category?.join(", ") || "Semua").toUpperCase();
      const formattedSpse = (spse?.join(", ") || "Semua").toUpperCase();
      const formattedKeyword = (keyword?.join(", ") || "Semua").toUpperCase();

      const response = await fetch(`${baseUrl}/api/sendgrid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: users.email,
          subject: `Update Tender Hari Ini ${today.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} pejuangtender.id`,
          templateName: "dailyTenderTrial",
          data: {
            name: users.name,
            category: formattedCategory,
            spse: formattedSpse,
            keyword: formattedKeyword,
            mainTenders: mainTenders || [],
            similarTendersOtherSPSE: similarTendersOtherSPSE || [],
            similarTendersSameSPSE: similarTendersSameSPSE || [],
            trialEndDate: subscription.end_date, 
          },
        }),
      });

      if (!response.ok) {
        // --- LOGIKA BARU UNTUK MEMBACA DETAIL ERROR ---
        let errorDetails = "Tidak ada detail error yang tersedia.";
        try {
          // Mencoba membaca body sebagai JSON
          const errorBody = await response.json();
          errorDetails = JSON.stringify(errorBody, null, 2);
        } catch {
          // Jika gagal, coba baca body sebagai teks
          try {
            errorDetails = await response.text();
          } catch (textError) {
            errorDetails = `Gagal membaca body respons: ${textError}`;
          }
        }
        
        console.error(
          `Gagal mengirim email ke ${users.email}. Status: ${response.status}.`
        );
        console.error("Detail Error:", errorDetails);
        // ---------------------------------------------
      } else {
        console.log(`Email harian berhasil dikirim ke ${users.email}.`);
        sentEmails.push(users.email);
      }
    }

    return NextResponse.json({
      message: "Daily emails sent successfully.",
      emails_sent_to: sentEmails,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in daily email script:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}