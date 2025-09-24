// src/app/api/get-transaction-data/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi klien Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * API handler untuk mengambil semua data transaksi yang diperlukan untuk event 'purchase'.
 * Endpoint ini dipanggil oleh halaman 'Thank You'.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const subscriptionId = searchParams.get("subscription_id");

    // Validasi parameter subscription_id
    if (!subscriptionId) {
      console.warn("API Warning: Missing subscription_id query parameter.");
      return NextResponse.json(
        { error: "Missing subscription_id" },
        { status: 400 }
      );
    }

    // Mengambil data dari tabel `subscriptions` dan data relasi dari tabel `packages`
    const { data: subscriptionData, error } = await supabase
      .from("subscriptions")
      .select(`
        transaction_id,
        package:packages (
          alternative_name,
          price,
          duration_months
        )
      `)
      .eq("id", subscriptionId)
      .eq("payment_status", "paid")
      .single();

    // Menangani error dari Supabase
    if (error) {
      console.error("Supabase Query Error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch transaction data" },
        { status: 500 }
      );
    }

    // Menangani kasus data tidak ditemukan atau tidak lengkap
    if (!subscriptionData || !subscriptionData.transaction_id || !subscriptionData.package || subscriptionData.package.length === 0) {
      console.warn(`Subscription with ID '${subscriptionId}' not found, not paid, or missing data.`);
      return NextResponse.json(
        { error: "Transaction data not found" },
        { status: 404 }
      );
    }

    // Mengakses objek paket dari array yang dikembalikan Supabase
    const packageInfo = subscriptionData.package[0];

    // Menghitung value (harga total) dan tax
    const taxRate = 0.11; // 11% PPN
    const basePrice = packageInfo.price;
    const tax = basePrice * taxRate;
    const value = basePrice + tax;

    // Membuat objek respons dengan semua data yang diperlukan
    const responseData = {
      transactionId: subscriptionData.transaction_id,
      value: value,
      tax: tax,
      shipping: 0,
      items: [{
        item_id: `${packageInfo.alternative_name.toLowerCase().replace(/\s/g, '_')}_${packageInfo.duration_months}m`,
        item_name: `${packageInfo.alternative_name} - ${packageInfo.duration_months} Bulan`,
        price: packageInfo.price,
        item_category: "Tender Package",
        item_variant: `${packageInfo.duration_months} Bulan`,
        quantity: 1
      }]
    };

    console.log("Successfully fetched transaction data for subscription:", subscriptionId);
    return NextResponse.json(responseData, { status: 200 });

  } catch (err) {
    console.error("Internal Server Error in get-transaction-data API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}