// File: src/app/api/send-reminder-trial/route.ts

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Inisialisasi Klien Supabase ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
});

// --- Antarmuka (Interfaces) ---
interface SubscriptionWithDetails {
     id: string;
    user_id: string;
    start_date: string;
    end_date: string;
    users: {
        name: string;
        email: string;
    };
}

// --- POST Handler untuk Mengirim Email Pengingat ---
export async function POST(req: NextRequest) {
    try {
        const today = new Date();
        const sentEmails: string[] = [];
        
        // ✅ Perhitungan tanggal: Tambahkan 3 hari dari hari ini
        const reminderDate = new Date();
        reminderDate.setDate(today.getDate() + 3);
        const reminderDateISOString = reminderDate.toISOString().split('T')[0];

        // ✅ Query: Cari langganan yang berakhir tepat 3 hari dari sekarang
        const { data: subscriptions, error: subsError } = await supabase
            .from("subscriptions")
            .select(`id, user_id, start_date, end_date, users(name, email)`)
            .eq("payment_status", "free-trial")
            .eq("end_date", reminderDateISOString);

        if (subsError) {
            console.error("Error fetching trial subscriptions for reminder:", subsError.message);
            return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ message: "No trial subscriptions found ending in 3 days." });
        }
        
        console.log(`Found ${subscriptions.length} users to send a reminder to.`);

        for (const subscription of subscriptions as unknown as SubscriptionWithDetails[]) {
            const { users, end_date } = subscription;

            if (!users || !users.email) {
                console.warn(`Skipping user due to missing email.`);
                continue;
            }

            const formattedTrialEndDate = new Date(end_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
             const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
            // ✅ Mengirim email menggunakan template reminderTrial
            const response = await fetch(`${baseUrl}/api/sendgrid`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: users.email,
                subject: "2 Hari Lagi! Trial pejuangtender.id Anda Berakhir",
                templateName: 'reminderTrial', // ✅ Menggunakan template baru
                data: {
                  name: users.name,
                  trialEndDate: formattedTrialEndDate,
                  subscription_id: subscription.id
                }
              }),
            });

            if (!response.ok) {
                console.error(`Gagal mengirim email pengingat ke ${users.email}. Status: ${response.status}`);
            } else {
                console.log(`Email pengingat berhasil dikirim ke ${users.email}.`);
                sentEmails.push(users.email);
            }
        }

        return NextResponse.json({ 
            message: "Trial reminder emails sent successfully.",
            emails_sent_to: sentEmails
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Error in reminder email script:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}