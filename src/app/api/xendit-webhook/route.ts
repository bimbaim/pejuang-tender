import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- Type Definitions for Xendit Webhook and Custom Errors ---

/**
 * Interface representing the expected structure of a Xendit Invoice Webhook event.
 * It includes key properties used for processing payment statuses.
 */
interface XenditInvoiceWebhookEvent {
  event: "invoice.paid" | "invoice.expired" | "payment.capture" | string; // Specific known events, or a string for others
  external_id: string;
  id: string;
  status: "PAID" | "EXPIRED" | "PENDING" | "SETTLED" | "FAILED" | string;
  amount?: number;
  payer_email?: string;
  payment_method?: string;
  payment_channel?: string;
  // [key: string]: any; // allow extra fields
}

/**
 * Interface for a more robust error type, extending the built-in Error.
 * This is useful for safely handling 'unknown' errors in catch blocks.
 */
interface ExtendedError extends Error {
  message: string;
}

// --- Supabase Client Initialization ---
// Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file.
// The service role key is crucial for backend operations as it bypasses Row Level Security.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST handler for Xendit webhook events.
 * This function processes incoming payment notifications from Xendit.
 */
export async function POST(req: Request) {
  // Initialize webhookEvent with a specific type, allowing it to be undefined initially.
  let webhookEvent: XenditInvoiceWebhookEvent | undefined;

  try {
    // Retrieve the X-Callback-Token from the request headers for security verification.
    const xCallbackToken = req.headers.get('x-callback-token');
    // The secret token configured in your Xendit dashboard for this webhook.
    // NOTE: For best security practices, it is recommended to use a separate, dedicated webhook secret token
    // instead of the main Xendit API key.
    const xenditWebhookSecret = process.env.XENDIT_WEBHOOK_SECRET_TOKEN;

    console.warn("Xendit Secret from Environment:", xenditWebhookSecret);
    console.warn("x-callback-token from Request Header:", xCallbackToken);

    // --- Webhook Security Check ---
    // It's critical to verify the X-Callback-Token to ensure the webhook event
    // is legitimately coming from Xendit and not a malicious third party.
    if (!xCallbackToken || xCallbackToken !== xenditWebhookSecret) {
      console.warn("Xendit Secret from Environment:", xenditWebhookSecret);
      console.warn("x-callback-token from Request Header:", xCallbackToken);
      console.warn(
        "Webhook Warning: Invalid X-Callback-Token received. " +
        "Potential unauthorized access attempt for Xendit webhook."
      );
      return NextResponse.json({ 
        error: "Unauthorized",
        debug: {
          secret_from_env: xenditWebhookSecret,
          token_from_header: xCallbackToken
        }
      }, { status: 401 });
    }
    // --- End Webhook Security Check ---

    // Parse the incoming JSON request body and cast it to our defined interface.
    // This provides strong type-checking for the webhook payload.
    webhookEvent = await req.json() as XenditInvoiceWebhookEvent;

    // --- Detailed Logging of the Webhook Event ---
    console.warn("\n--- Xendit Webhook Event Received ---");
    console.warn("Webhook Event Type:", webhookEvent.event);
    console.warn("External ID (Subscription ID):", webhookEvent.external_id);
    console.warn("Xendit Invoice ID:", webhookEvent.id);
    console.warn("Invoice Status:", webhookEvent.status);
    console.warn("Full Webhook Payload:", JSON.stringify(webhookEvent, null, 2));
    console.warn("--- End Xendit Webhook Event ---\n");

    // Handle 'invoice.paid' event for successful payments.
    if (webhookEvent.event === "invoice.paid" || webhookEvent.status === "PAID" || webhookEvent.event === "payment.capture") {
      let subscriptionId = webhookEvent.external_id;

      if (subscriptionId.startsWith("invoice_")) {
        subscriptionId = subscriptionId.replace("invoice_", "");
      }

      // Ensure the external_id (our subscription ID) is present in the payload.
      if (!subscriptionId) {
        console.error("Webhook Error: Missing external_id in Xendit 'invoice.paid' webhook payload.");
        return NextResponse.json({ error: "Missing subscription ID in webhook" }, { status: 400 });
      }

      // Update the subscription's payment_status to 'paid' in Supabase.
      // We only destructure 'error' as 'data' is not used in this context.
      const { error } = await supabase
        .from("subscriptions")
        .update({ payment_status: "paid" }) // The value has been changed from "success" to "paid"
        .eq("id", subscriptionId); // Match the record by the subscription ID

      if (error) {
        console.error("Supabase Update Error for 'invoice.paid':", error.message);
        return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 });
      }

      console.warn(`Subscription ${subscriptionId} payment status updated to 'paid' in Supabase.`);
      return NextResponse.json({ message: "Webhook processed successfully: Invoice Paid" }, { status: 200 });
    }
    
    // Handle 'invoice.expired' event for payments that were not completed in time.
    else if (webhookEvent.event === "invoice.expired" && webhookEvent.status === "EXPIRED") {
        let subscriptionId = webhookEvent.external_id;
        if (subscriptionId.startsWith("invoice_")) {
          subscriptionId = subscriptionId.replace("invoice_", "");
        }

        if (subscriptionId) {
            // Update the subscription's payment_status to 'failed' or 'expired' in Supabase.
            const { error } = await supabase
                .from("subscriptions")
                .update({ payment_status: "failed" }) // Using 'failed', you could use 'expired' if defined
                .eq("id", subscriptionId);

            if (error) {
              console.error("Supabase Update Error for 'invoice.expired':", error.message);
            }
            console.warn(`Subscription ${subscriptionId} payment status updated to 'failed' due to invoice expiration.`);
        }
        return NextResponse.json({ message: "Webhook processed successfully: Invoice Expired" }, { status: 200 });
    }
    
    // For any other webhook events (e.g., invoice.created, invoice.payment_attempted, etc.)
    // we acknowledge receipt but do not perform a status update in the database.
    console.warn(`Event type '${webhookEvent.event}' received but not handled by the code.`);
      
      return NextResponse.json(
        { 
          message: "Webhook event received but not processed for specific status update",
          debug: {
            event: webhookEvent.event,
            status: webhookEvent.status,
            fullPayload: webhookEvent
          }
        },
        { status: 200 }
      ); 


  } catch (error: unknown) {
    // Catch block for any unexpected errors during webhook processing.
    // Use type assertion to access 'message' property safely.
    const err = error as ExtendedError;
    console.error("Xendit Webhook Processing Error:", err.message);

    // If the error occurred before webhookEvent was successfully parsed, webhookEvent might be undefined.
    if (webhookEvent) {
      console.error("Webhook event data leading to error:", JSON.stringify(webhookEvent, null, 2));
    }

    return NextResponse.json(
      { error: "Internal Server Error during webhook processing" },
      { status: 500 }
    );
  }
}
