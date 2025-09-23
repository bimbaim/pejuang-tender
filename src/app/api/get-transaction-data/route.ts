import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * API handler to fetch only the transaction ID based on a subscription ID.
 * This endpoint is called by the 'Thank You' page.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const subscriptionId = searchParams.get("subscription_id");

    // 1. Validate the incoming subscription ID
    if (!subscriptionId) {
      console.warn("API Warning: Missing subscription_id query parameter.");
      return NextResponse.json(
        { error: "Missing subscription_id" },
        { status: 400 }
      );
    }

    // 2. Query Supabase for only the transaction_id
    const { data: subscriptionData, error } = await supabase
      .from("subscriptions")
      .select(`transaction_id`) // <-- Only selecting this column now
      .eq("id", subscriptionId)
      .eq("payment_status", "paid")
      .single();

    // 3. Handle potential errors from the Supabase query
    if (error) {
      console.error("Supabase Query Error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch transaction ID" },
        { status: 500 }
      );
    }

    // 4. Handle case where the subscription is not found, not paid, or has no transaction ID
    if (!subscriptionData || !subscriptionData.transaction_id) {
      console.warn(`Subscription with ID '${subscriptionId}' not found, not paid, or missing transaction ID.`);
      return NextResponse.json(
        { error: "Transaction ID not found" },
        { status: 404 }
      );
    }
    
    // 5. Return the transaction ID
    const responseData = {
      transactionId: subscriptionData.transaction_id,
    };

    console.log("Successfully fetched transaction ID for subscription:", subscriptionId);
    return NextResponse.json(responseData, { status: 200 });

  } catch (err) {
    console.error("Internal Server Error in get-transaction-data API:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}