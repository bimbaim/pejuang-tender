import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js"; 

// ... (Inisialisasi Klien Supabase) ...
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// --- Antarmuka (Interfaces) ---
// ... (Interface SubscriptionWithDetails tidak berubah) ...
interface SubscriptionWithDetails {
  user_id: string;
  keyword: string[] | null;
  category: string[] | null;
  spse: string[] | null;
  start_date: string;
  end_date: string;
  users: {
    name: string;
    email: string;
  };
}

interface Tender {
    id: string;
    title: string;
    agency: string;
    budget: number;
    source_url: string;
}

// ✅ PENAMBAHAN: Interface untuk Supabase PostgREST Error
interface SupabaseError {
  code: string;
  details: string;
  hint: string;
  message: string;
}

// Tipe gabungan untuk hasil query Supabase
type SupabaseQueryResult = {
    data: Tender[] | null;
    error: SupabaseError | null;
}

// --- POST Handler untuk Mengirim Email Harian ---
export async function POST(req: NextRequest) {
  try {
    const today = new Date();
    const todayISOString = today.toISOString().split("T")[0];
    const sentEmails: string[] = [];
    
    // ... (Kode fetching subscriptions dan loop for tidak berubah) ...
    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select(
        `user_id, keyword, category, spse, start_date, end_date, users(name, email)`
      )
      .eq("payment_status", "free-trial")
      .gte("end_date", todayISOString);

    if (subsError) {
      console.error("Error fetching trial subscriptions:", subsError.message);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "No active trial subscriptions found.",
      });
    }

    for (const subscription of subscriptions as unknown as SubscriptionWithDetails[]) {
      const { user_id, keyword, category, spse, users, end_date } =
        subscription;

      // ... (Kode formatting data tidak berubah) ...
      const formattedTrialEndDate = new Date(end_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const formattedCategory = (category?.join(", ") || "Semua").toUpperCase();
      const formattedSpse = (spse?.join(", ") || "Semua").toUpperCase();
      const formattedKeyword = (keyword?.join(", ") || "Semua").toUpperCase();

      // --- Filter Conditions Helper ---
      const categoryConditions: string[] = category?.map((cat) => `category.ilike.%${cat.trim()}%`) || [];
      const spseConditions: string[] = spse?.map((site) => `source_url.ilike.%${site.trim()}%`) || [];
      const keywordConditions: string[] = keyword?.map((key) => `title.ilike.%${key.trim()}%`) || [];
      const statusConditions: string[] = [
        "status.eq.Pengumuman Pascakualifikasi",
        "status.eq.Download Dokumen Pemilihan",
        "status.like.Pengumuman Pascakualifikasi%",
        "status.like.Pengumuman Prakualifikasi%",
        "status.like.Download Dokumen Pemilihan%",
        "status.like.Download Dokumen Kualifikasi%",
      ];
      
      // --- Query 1: Main Tenders ---
      let mainTenderQuery = supabase.from("lpse_tenders").select(`id, title, agency, budget, source_url`);
      const combinedConditions: string[] = [...categoryConditions, ...spseConditions, ...keywordConditions, ...statusConditions];
      mainTenderQuery = mainTenderQuery.or(combinedConditions.join(",")).order("created_at", { ascending: false }).limit(5);

      // ✅ Menggunakan tipe baru: SupabaseQueryResult
      const { data: mainTenders, error: mainTendersError } = await mainTenderQuery as SupabaseQueryResult;
      
      // --- Query 2: Similar Tenders Other SPSE ---
      let similarTendersOtherSPSEQuery = supabase.from("lpse_tenders").select(`id, title, agency, budget, source_url`);
      const otherSPSEConditions: string[] = [...categoryConditions, ...keywordConditions, ...statusConditions];
      similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.or(otherSPSEConditions.join(",")).order("created_at", { ascending: false }).limit(5);
      
      // ✅ Menggunakan tipe baru: SupabaseQueryResult
      const { data: similarTendersOtherSPSE, error: similarTendersOtherSPSEError } = await similarTendersOtherSPSEQuery as SupabaseQueryResult;


      // --- Query 3: Similar Tenders Same SPSE ---
      let similarTendersSameSPSEQuery = supabase.from("lpse_tenders").select(`id, title, agency, budget, source_url`);
      const sameSPSEConditions: string[] = [...categoryConditions, ...spseConditions, ...statusConditions];
      similarTendersSameSPSEQuery = similarTendersSameSPSEQuery.or(sameSPSEConditions.join(",")).order("created_at", { ascending: false }).limit(5);

      // ✅ Menggunakan tipe baru: SupabaseQueryResult
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

      // ... (Kode pengiriman email dan response tidak berubah) ...
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

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
            trialEndDate: formattedTrialEndDate,
          },
        }),
      });

      if (!response.ok) {
        console.error(
          `Gagal mengirim email ke ${users.email}. Status: ${response.status}`
        );
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