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
      .select(`user_id, keyword, category, spse, users(name, email)`)
      // ✅ FILTER PAID
      .eq("payment_status", "paid");

    if (subsError) {
      console.error("Error fetching paid subscriptions:", subsError.message);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions", details: subsError.message },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        message: "No active paid subscriptions found.",
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
      
      // --- Query 1: Main Tenders (Sequential Flow) ---
      let mainTenderQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, budget, source_url`);
      const combinedConditions = [...categoryConditions, ...spseConditions, ...keywordConditions, ...statusConditions];
      if (combinedConditions.length > 0) {
        mainTenderQuery = mainTenderQuery.or(combinedConditions.join(","));
      }
      mainTenderQuery = mainTenderQuery.order("created_at", { ascending: false }).limit(5);

      // ✅ SEQUENTIAL AWAIT (Metode Trial)
      const { data: mainTenders, error: mainTendersError } = await mainTenderQuery as SupabaseQueryResult;

      // --- Query 2: Similar Tenders Other SPSE (Sequential Flow) ---
      let similarTendersOtherSPSEQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, budget, source_url`);
      const otherSPSEConditions = [...categoryConditions, ...keywordConditions, ...statusConditions];
      if (otherSPSEConditions.length > 0) {
        similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.or(otherSPSEConditions.join(","));
      }
      similarTendersOtherSPSEQuery = similarTendersOtherSPSEQuery.order("created_at", { ascending: false }).limit(5);
      
      // ✅ SEQUENTIAL AWAIT (Metode Trial)
      const { data: similarTendersOtherSPSE, error: similarTendersOtherSPSEError } = await similarTendersOtherSPSEQuery as SupabaseQueryResult;

      // --- Query 3: Similar Tenders Same SPSE (Sequential Flow) ---
      let similarTendersSameSPSEQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, budget, source_url`);
      const sameSPSEConditions = [...spseConditions, ...statusConditions];
      if (sameSPSEConditions.length > 0) {
        similarTendersSameSPSEQuery = similarTendersSameSPSEQuery.or(sameSPSEConditions.join(","));
      }
      similarTendersSameSPSEQuery = similarTendersSameSPSEQuery.order("created_at", { ascending: false }).limit(5);
      
      // ✅ SEQUENTIAL AWAIT (Metode Trial)
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
          templateName: "dailyTenderPaid",
          data: {
            name: users.name,
            category: formattedCategory,
            spse: formattedSpse,
            keyword: formattedKeyword,
            mainTenders: mainTenders || [],
            similarTendersOtherSPSE: similarTendersOtherSPSE || [],
            similarTendersSameSPSE: similarTendersSameSPSE || [],
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