// src/app/api/get-transaction-data/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi klien Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const subscriptionId = searchParams.get("subscription_id");

    if (!subscriptionId) {
      console.warn("API Warning: Missing subscription_id query parameter.");
      return NextResponse.json(
        { error: "Missing subscription_id" },
        { status: 400 }
      );
    }

    const { data: subscriptionData, error } = await supabase
      .from("subscriptions")
      .select(`
        transaction_id,
        package:packages (
          name,
          price,
          duration_months
        )
      `)
      .eq("id", subscriptionId)
      .eq("payment_status", "paid")
      .single();

    if (error) {
      console.error("Supabase Query Error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch transaction data" },
        { status: 500 }
      );
    }

    // Periksa data utama dan transaction_id
    if (!subscriptionData || !subscriptionData.transaction_id) {
      console.warn(`Subscription with ID '${subscriptionId}' not found, not paid, or missing transaction ID.`);
      return NextResponse.json(
        { error: "Transaction data not found" },
        { status: 404 }
      );
    }
    
    let packageInfo;
    
    // Periksa apakah package adalah array atau objek tunggal, lalu ambil datanya
    if (Array.isArray(subscriptionData.package)) {
      if (subscriptionData.package.length === 0) {
        console.warn(`Subscription with ID '${subscriptionId}' has no associated package.`);
        return NextResponse.json(
          { error: "Transaction data not found" },
          { status: 404 }
        );
      }
      packageInfo = subscriptionData.package[0];
    } else {
      // Jika bukan array, anggap itu objek tunggal
      packageInfo = subscriptionData.package;
    }

    // Lakukan validasi terakhir untuk memastikan packageInfo ada
    if (!packageInfo || !packageInfo.price) {
        console.warn(`Subscription with ID '${subscriptionId}' has incomplete package data.`);
        return NextResponse.json(
          { error: "Transaction data incomplete" },
          { status: 404 }
        );
    }

    // Hitung harga total dan pajak
    const taxRate = 0.11;
    const basePrice = packageInfo.price;
    const tax = basePrice * taxRate;
    const value = basePrice + tax;

    // Buat objek respons
    const responseData = {
      transactionId: subscriptionData.transaction_id,
      value: value,
      tax: tax,
      shipping: 0,
      items: [{
        item_id: `${packageInfo.name.toLowerCase().replace(/\s/g, '_')}_${packageInfo.duration_months}m`,
        item_name: `${packageInfo.name} - ${packageInfo.duration_months} Bulan`,
        price: packageInfo.price,
        item_category: "Tender Package",
        item_variant: `${packageInfo.duration_months} Bulan`,
        quantity: 1
      }]
    };

    console.log("Successfully fetched transaction data for subscription:", subscriptionId);
    console.log("Response Data:", responseData);
    return NextResponse.json(responseData, { status: 200 });

  } catch (err) {
    console.error("Internal Server Error in get-transaction-data API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}