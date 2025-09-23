// File: src/app/api/send-reminder-paid/route.ts

import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    package_id: string; // ✅ Ditambahkan: package_id
    start_date: string;
    end_date: string;
    users: {
        name: string;
        email: string;
    };
}

// --- POST Handler untuk Mengirim Email Pengingat Perpanjangan ---
export async function POST(req: NextRequest) {
    try {
        const today = new Date();
        const sentEmails: string[] = [];
        
        // Perhitungan tanggal: Tambahkan 7 hari dari hari ini
        const reminderDate = new Date();
        reminderDate.setDate(today.getDate() + 7);
        const reminderDateISOString = reminderDate.toISOString().split('T')[0];

        // ✅ Query: Tambahkan `package_id` pada select
        const { data: subscriptions, error: subsError } = await supabase
            .from("subscriptions")
            .select(`user_id, package_id, start_date, end_date, users(name, email)`)
            .eq("payment_status", "paid")
            .eq("end_date", reminderDateISOString);

        if (subsError) {
            console.error("Error fetching paid subscriptions for reminder:", subsError.message);
            return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ message: "No paid subscriptions found ending in 7 days." });
        }
        
        console.log(`Found ${subscriptions.length} paid users to send a renewal reminder to.`);

        for (const subscription of subscriptions as unknown as SubscriptionWithDetails[]) {
            const { users, end_date, package_id } = subscription;

            if (!users || !users.email) {
                console.warn(`Skipping user due to missing email.`);
                continue;
            }

            // ✅ Logika baru: Ambil nama paket dari tabel 'packages'
            const { data: packageData, error: packageError } = await supabase
                .from("packages")
                .select("alternative_name")
                .eq("id", package_id)
                .single();

            let packageName = "Premium"; // Default jika tidak ditemukan
            if (packageData) {
                packageName = packageData.alternative_name;
            } else if (packageError) {
                console.error(`Error fetching package name for ID ${package_id}:`, packageError.message);
            }

            const formattedSubscriptionEndDate = new Date(end_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
             const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
             
            const response = await fetch(`${baseUrl}/api/sendgrid`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: users.email,
                // ✅ Menggunakan template literal untuk subjek dinamis
                subject: `7 Hari Lagi! Paket ${packageName} Anda Hampir Berakhir`, 
                templateName: 'reminderPaid',
                data: {
                  name: users.name,
                  // ✅ Mengirimkan nama paket ke template email
                  packageName: packageName, 
                  subscriptionEndDate: formattedSubscriptionEndDate,
                }
              }),
            });

            if (!response.ok) {
                console.error(`Gagal mengirim email pengingat perpanjangan ke ${users.email}. Status: ${response.status}`);
            } else {
                console.log(`Email pengingat perpanjangan berhasil dikirim ke ${users.email}.`);
                sentEmails.push(users.email);
            }
        }

        return NextResponse.json({ 
            message: "Paid subscription reminder emails sent successfully.",
            emails_sent_to: sentEmails
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Error in paid reminder script:", err.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}