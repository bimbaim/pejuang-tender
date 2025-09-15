import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dailyTenderTrialEmailTemplate } from "@/lib/emailTemplates/dailyTenderTrial";

// --- Inisialisasi Klien Supabase ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
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

interface Tender {
    id: string;
    title: string;
    agency: string;
    budget: number;
    source_url: string;
}

// --- POST Handler untuk Mengirim Email Harian ---
export async function POST(req: NextRequest) {
  try {
    const today = new Date();
    // Format today's date to a string without time, e.g., "2025-09-15"
    const todayISOString = today.toISOString().split('T')[0];

    // 1. Ambil semua langganan yang berstatus 'free-trial' DAN end_date-nya BELUM hari ini
    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select(`user_id, keyword, category, spse, start_date, end_date, users(name, email)`)
      .eq("payment_status", "free-trial")
      .gte("end_date", todayISOString); // <--- Changed from .eq to .gte

    if (subsError) {
      console.error("Error fetching trial subscriptions:", subsError.message);
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No active trial subscriptions found." });
    }

    // 2. Iterasi setiap pengguna trial
    for (const subscription of subscriptions as unknown as SubscriptionWithDetails[]) {
      const { user_id, keyword, category, spse, users, end_date } = subscription;
      
      if (!users || !users.email) {
          console.warn(`Skipping user ID ${user_id} due to missing email.`);
          continue;
      }

      // Format the trial end date for the email template
      const trialEndDate = new Date(end_date);
      const formattedTrialEndDate = trialEndDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

      // Bangun query tender secara dinamis
      let tenderQuery = supabase
          .from("lpse_tenders")
          .select(`id, title, agency, budget, source_url`) 
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order("created_at", { ascending: false });

      // Tambahkan filter secara kondisional
      if (category && category.length > 0) {
          tenderQuery = tenderQuery.filter("category", "cs", `({${category.join(',')}})`);
      }

      if (spse && spse.length > 0) {
          tenderQuery = tenderQuery.in("lpse", spse);
      }

      if (keyword && keyword.length > 0) {
          tenderQuery = tenderQuery.filter("title", "cs", `({${keyword.join(',')}})`);
      }

      tenderQuery = tenderQuery.or(
          'status.eq.Pengumuman Pascakualifikasi,status.eq.Download Dokumen Pemilihan,status.like.Pengumuman Pascakualifikasi%,status.like.Pengumuman Prakualifikasi%,status.like.Download Dokumen Pemilihan%,status.like.Download Dokumen Kualifikasi%'
      );

      const { data: tenders, error: tendersError } = await tenderQuery;

      if (tendersError) {
        console.error("Error fetching tenders for user", user_id, ":", tendersError.message);
        continue;
      }

      // Buat konten email
      const emailBody = dailyTenderTrialEmailTemplate(users.name, tenders as Tender[], formattedTrialEndDate);

      // Kirim email via API SendGrid Anda
      const response = await fetch(`${req.nextUrl.origin}/api/sendgrid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: users.email,
          subject: "Update Tender Hari Ini",
          html: emailBody,
          data: {
            name: users.name,
            tenders: tenders,
            trialEndDate: formattedTrialEndDate
          }
        }),
      });

      if (!response.ok) {
        console.error(`Gagal mengirim email ke ${users.email}. Status: ${response.status}`);
      } else {
        console.log(`Email harian berhasil dikirim ke ${users.email}.`);
      }
    }

    return NextResponse.json({ message: "Daily emails sent successfully." });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in daily email script:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}