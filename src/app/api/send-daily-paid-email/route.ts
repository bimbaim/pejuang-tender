// File: src/app/api/cron/dailyTenderPaid/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Inisialisasi Klien Supabase ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Using Service Role Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

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

// ✅ Diperbarui: 'end_date' dihapus dari interface.
// interface Tender {
//     id: string;
//     title: string;
//     agency: string;
//     budget: number;
//     source_url: string;
// }

export async function POST(req: NextRequest) {
  try {
    const today = new Date();
    const sentEmails: string[] = [];
    // ✅ Add a new array to collect all spse URLs
    const allSpseUrls: string[] = [];

    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select(`user_id, keyword, category, spse, users(name, email)`)
      .eq("payment_status", "paid");

    if (subsError) {
      console.error("Error fetching paid subscriptions:", subsError.message);
      // Log the full error object on your server
      console.error("Supabase Error Details:", subsError); 
      
      // Return the detailed error to the client
      return NextResponse.json(
        {
          error: "Failed to fetch subscriptions",
          details: subsError.message, // This sends the specific error message to Postman
          // You can also add more fields from the Supabase error object if they exist
          // code: subsError.code, 
          // hint: subsError.hint
        },
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

      let tenderQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, budget, source_url`)
        // The following line filters results to only include those created in the last 24 hours.
        // .gte(
        //   "created_at",
        //   new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        // )
        .limit(10); // ✅ Limit changed to 10

      // ✅ Category filter
      if (category && category.length > 0) {
        tenderQuery = tenderQuery.or(
          category.map((cat) => `category.ilike.%${cat.trim()}%`).join(",")
        );
      }

      // ✅ SPSE filter
      if (spse && spse.length > 0) {
        tenderQuery = tenderQuery.or(
          spse.map((site) => `source_url.ilike.%${site.trim()}%`).join(",")
        );
      }

      // ✅ Keyword filter
      if (keyword && keyword.length > 0) {
        tenderQuery = tenderQuery.or(
          keyword.map((key) => `title.ilike.%${key.trim()}%`).join(",")
        );
      }

      // ✅ Status filter (selalu ada)
      tenderQuery = tenderQuery.or(
        [
          "status.eq.Pengumuman Pascakualifikasi",
          "status.eq.Download Dokumen Pemilihan",
          "status.like.Pengumuman Pascakualifikasi%",
          "status.like.Pengumuman Prakualifikasi%",
          "status.like.Download Dokumen Pemilihan%",
          "status.like.Download Dokumen Kualifikasi%",
        ].join(",")
      );

      // ✅ Ordering + Limit
      tenderQuery = tenderQuery
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: tenders, error: tendersError } = await tenderQuery;

      if (tendersError) {
        console.error(
          "Error fetching tenders for user",
          user_id,
          ":",
          tendersError.message
        );
        continue;
      }

      // ✅ Collect all source_url values into the new array
      if (tenders && tenders.length > 0) {
        tenders.forEach((tender) => {
          allSpseUrls.push(tender.source_url);
        });
      }

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
          templateName: "dailyTenderPaid",
          data: {
            name: users.name,
            tenders: tenders,
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

    // ✅ Update the return statement to include the new array
    return NextResponse.json({
      message: "Daily emails sent successfully.",
      emails_sent_to: sentEmails,
      spse_urls: allSpseUrls,
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
