import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Assuming you use Supabase client directly in API routes

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const xCallbackToken = req.headers.get('x-callback-token'); // Get Xendit callback token for verification
    const xenditWebhookSecret = process.env.XENDIT_WEBHOOK_SECRET_TOKEN; // Set this in your .env.local file

    // --- Webhook Security (Highly Recommended) ---
    // In a production environment, always verify the X-Callback-Token.
    // Xendit provides this token to ensure the webhook is coming from them.
    if (!xCallbackToken || xCallbackToken !== xenditWebhookSecret) {
      console.warn("Webhook Warning: Invalid X-Callback-Token received. Potential unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // --- End Webhook Security ---

    const webhookEvent = await req.json();

    console.log("\n--- Xendit Webhook Event Received ---");
    console.log("Webhook Event Type:", webhookEvent.event);
    console.log("External ID:", webhookEvent.external_id);
    console.log("Invoice ID:", webhookEvent.id);
    console.log("Status:", webhookEvent.status);
    console.log("Full Webhook Payload:", JSON.stringify(webhookEvent, null, 2));
    console.log("--- End Xendit Webhook Event ---\n");

    // Check if the webhook event is for a successful invoice payment
    if (webhookEvent.event === "invoice.paid" && webhookEvent.status === "PAID") {
      const subscriptionId = webhookEvent.external_id; // This is the ID you sent when creating the invoice

      if (!subscriptionId) {
        console.error("Webhook Error: Missing external_id in Xendit webhook payload.");
        return NextResponse.json({ error: "Missing subscription ID in webhook" }, { status: 400 });
      }

      // Update the subscription in your Supabase database
      const { data, error } = await supabase
        .from("subscriptions")
        .update({ payment_status: "success" })
        .eq("id", subscriptionId); // Match by the external_id

      if (error) {
        console.error("Supabase Update Error:", error.message);
        return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 });
      }

      console.log(`Subscription ${subscriptionId} payment status updated to 'success'.`);
      return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

    } else if (webhookEvent.event === "invoice.expired" && webhookEvent.status === "EXPIRED") {
        const subscriptionId = webhookEvent.external_id;
        if (subscriptionId) {
            const { error } = await supabase
                .from("subscriptions")
                .update({ payment_status: "failed" }) // Or 'expired' if you have that status
                .eq("id", subscriptionId);
            if (error) console.error("Supabase Update Error for expired invoice:", error.message);
            console.log(`Subscription ${subscriptionId} payment status updated to 'failed' due to expiration.`);
        }
        return NextResponse.json({ message: "Invoice expired event processed" }, { status: 200 });
    }
    // You might want to handle other statuses like 'invoice.payment_attempted', 'invoice.failed' etc.

    // Acknowledge other webhook events even if not explicitly handled
    return NextResponse.json({ message: "Webhook event received but not processed for status update" }, { status: 200 });

  } catch (error: any) {
    console.error("Xendit Webhook Processing Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
