import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import { dailyTenderTrialEmailTemplate } from "@/lib/emailTemplates/dailyTenderTrial";

// --- Inisialisasi Klien Supabase ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// --- Antarmuka (Interfaces) ---
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

// interface Tender {
//     id: string;
//     title: string;
//     agency: string;
//     budget: number;
//     source_url: string;
// }

// --- POST Handler untuk Mengirim Email Harian ---
export async function POST(req: NextRequest) {
  try {
    const today = new Date();
    const todayISOString = today.toISOString().split("T")[0];
    const sentEmails: string[] = []; // Array to store emails of recipients
    const allSpseUrls: string[] = [];
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

      if (!users || !users.email) {
        console.warn(`Skipping user ID ${user_id} due to missing email.`);
        continue;
      }

      const trialEndDate = new Date(end_date);
      const formattedTrialEndDate = trialEndDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      let tenderQuery = supabase
        .from("lpse_tenders")
        .select(`id, title, agency, budget, source_url`)
        // ✅ Created_at filter
        .gte(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        );

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

      // const emailBody = dailyTenderTrialEmailTemplate(users.name, tenders as Tender[], formattedTrialEndDate);

      // ✅ Collect all source_url values into the new array
      if (tenders && tenders.length > 0) {
        tenders.forEach((tender) => {
          allSpseUrls.push(tender.source_url);
        });
      }

      const response = await fetch(`${req.nextUrl.origin}/api/sendgrid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: users.email,
          subject: `Update Tender Hari Ini ${today.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })} pejuangtender.id`,
          // Pass the template name and data instead of the pre-built HTML
          templateName: "dailyTenderTrial",
          data: {
            name: users.name,
            tenders: tenders,
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
        sentEmails.push(users.email); // Add email to the list
      }
    }

    // Return the final response with the list of sent emails
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
