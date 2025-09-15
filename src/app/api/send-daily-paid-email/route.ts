import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import { dailyTenderPaidEmailTemplate } from "@/lib/emailTemplates/dailyTenderPaid";
import { dailyTenderPaidEmailTemplate } from "@/lib/emailTemplates/dailyTenderPaid";

// --- Inisialisasi Klien Supabase ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
});


// --- Antarmuka (Interfaces) ---
// Perbaikan: Users sekarang adalah objek tunggal, bukan array
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

interface Tender {
    id: string;
    title: string;
    agency: string;
    budget: number;
    source_url: string; // Perbaikan: Ganti 'source_url'
    end_date: string;
}

/**
 * POST handler untuk mengirim email harian ke pelanggan berbayar.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Ambil semua langganan yang berstatus 'paid'
    const { data: subscriptions, error: subsError } = await supabase
      .from("subscriptions")
      .select(`user_id, keyword, category, spse, users(name, email)`)
      .eq("payment_status", "paid");

    if (subsError) {
      console.error("Error fetching paid subscriptions:", subsError.message);
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "No active paid subscriptions found." });
    }

    // 2. Iterasi setiap pengguna berbayar
    // Perbaikan: Tambahkan `as unknown as SubscriptionWithDetails[]` untuk mengatasi TypeScript
    for (const subscription of subscriptions as unknown as SubscriptionWithDetails[]) {
      const { user_id, keyword, category, spse, users } = subscription;
      
      if (!users || !users.email) {
          console.warn(`Skipping user ID ${user_id} due to missing email.`);
          continue;
      }

      // 3. Bangun query tender secara dinamis
      let tenderQuery = supabase
          .from("lpse_tenders")
          .select(`id, title, agency, budget, source_url, end_date`) // Perbaikan: Ganti 'source_url'
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order("created_at", { ascending: false });

      // Tambahkan filter secara kondisional
      if (keyword && keyword.length > 0) {
          tenderQuery = tenderQuery.filter("title", "cs", `({${keyword.join(',')}})`);
      }

      if (category && category.length > 0) {
          tenderQuery = tenderQuery.filter("category", "cs", `({${category.join(',')}})`);
      }

      if (spse && spse.length > 0) {
          tenderQuery = tenderQuery.in("lpse", spse);
      }

      // Tambahkan filter status untuk tender yang relevan
      tenderQuery = tenderQuery.or(
          'status.eq.Pengumuman Pascakualifikasi,status.eq.Download Dokumen Pemilihan,status.like.Pengumuman Pascakualifikasi%,status.like.Pengumuman Prakualifikasi%,status.like.Download Dokumen Pemilihan%,status.like.Download Dokumen Kualifikasi%'
      );

      const { data: tenders, error: tendersError } = await tenderQuery;

      if (tendersError) {
        console.error("Error fetching tenders for user", user_id, ":", tendersError.message);
        continue;
      }
      
      // 4. Buat konten email menggunakan template berbayar
      const emailBody = dailyTenderPaidEmailTemplate(users.name, tenders as Tender[]);

      // 5. Kirim email via API SendGrid
      const response = await fetch(`${req.nextUrl.origin}/api/sendgrid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: users.email,
          subject: "Update Tender Hari Ini",
        //   templateName: "dailyTenderPaid",
          html: emailBody, 
          data: {
            name: users.name,
            tenders: tenders,
            
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

  } catch (error: unknown) { // Perbaikan: Tangkap error sebagai unknown
    const err = error as Error; // Type assertion lebih aman
    console.error("Error in daily email script:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}