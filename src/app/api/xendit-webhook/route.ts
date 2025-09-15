// app/api/xendit-webhook/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server"; // <-- Perubahan di sini

// --- Type Definitions for Xendit Webhook and Custom Errors ---
interface XenditInvoiceWebhookEvent {
  event: "invoice.paid" | "invoice.expired" | "payment.capture" | string;
  external_id: string;
  id: string;
  status: "PAID" | "EXPIRED" | "PENDING" | "SETTLED" | "FAILED" | string;
  amount?: number;
  payer_email?: string;
  payment_method?: string;
  payment_channel?: string;
}

interface ExtendedError extends Error {
  message: string;
}

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * POST handler for Xendit webhook events.
 */
export async function POST(req: NextRequest) { // <-- Perubahan di sini
  let webhookEvent: XenditInvoiceWebhookEvent | undefined;

  try {
    const xCallbackToken = req.headers.get('x-callback-token');
    const xenditWebhookSecret = process.env.XENDIT_WEBHOOK_SECRET_TOKEN;

    if (!xCallbackToken || xCallbackToken !== xenditWebhookSecret) {
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

    webhookEvent = await req.json() as XenditInvoiceWebhookEvent;

    console.log("\n--- Xendit Webhook Event Received ---");
    console.log("Webhook Event Type:", webhookEvent.event);
    console.log("External ID (Subscription ID):", webhookEvent.external_id);
    console.log("Xendit Invoice ID:", webhookEvent.id);
    console.log("Invoice Status:", webhookEvent.status);
    console.log("Full Webhook Payload:", JSON.stringify(webhookEvent, null, 2));
    console.log("--- End Xendit Webhook Event ---\n");

    if (webhookEvent.event === "invoice.paid" || webhookEvent.status === "PAID" || webhookEvent.event === "payment.capture") {
      let subscriptionId = webhookEvent.external_id;

      if (subscriptionId.startsWith("invoice_")) {
        subscriptionId = subscriptionId.replace("invoice_", "");
      }

      if (!subscriptionId) {
        console.error("Webhook Error: Missing external_id in Xendit 'invoice.paid' webhook payload.");
        return NextResponse.json({ error: "Missing subscription ID in webhook" }, { status: 400 });
      }

      const { data: subscriptionData, error: updateError } = await supabase
          .from("subscriptions")
          .update({ payment_status: "paid" })
          .eq("id", subscriptionId)
          .select(`*, users(name, email), packages(alternative_name)`)
          .single();

      if (updateError) {
        console.error("Supabase Update Error for 'invoice.paid':", updateError.message);
        return NextResponse.json({ error: "Failed to update subscription status" }, { status: 500 });
      }

      console.warn(`Subscription ${subscriptionId} payment status updated to 'paid' in Supabase.`);

      if (subscriptionData && subscriptionData.users && subscriptionData.packages) {
        const { name, email } = subscriptionData.users;
        const packageName = subscriptionData.packages.alternative_name;
        
        try {
          await fetch(`${req.nextUrl.origin}/api/sendgrid`, { // req.nextUrl.origin sudah berfungsi
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              subject: `Selamat Bergabung ${packageName} di pejuangtender.id`,
              templateName: 'subscriptionWelcome',
              data: {
                name,
                packageName,
              },
            }),
          });
          console.log(`Email berhasil dikirim ke ${email} untuk paket ${packageName}.`);
        } catch (emailError: unknown) {
          const err = emailError as ExtendedError;
          console.error("Gagal mengirim email via API:", err.message);
        }
      }

      return NextResponse.json({ message: "Webhook processed successfully: Invoice Paid" }, { status: 200 });
    }
    
    else if (webhookEvent.event === "invoice.expired" && webhookEvent.status === "EXPIRED") {
        let subscriptionId = webhookEvent.external_id;
        if (subscriptionId.startsWith("invoice_")) {
          subscriptionId = subscriptionId.replace("invoice_", "");
        }

        if (subscriptionId) {
            const { error } = await supabase
                .from("subscriptions")
                .update({ payment_status: "failed" })
                .eq("id", subscriptionId);

            if (error) {
              console.error("Supabase Update Error for 'invoice.expired':", error.message);
            }
            console.warn(`Subscription ${subscriptionId} payment status updated to 'failed' due to invoice expiration.`);
        }
        return NextResponse.json({ message: "Webhook processed successfully: Invoice Expired" }, { status: 200 });
    }
    
    console.log(`Event type '${webhookEvent.event}' received but not handled by the code.`);
      
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
    const err = error as ExtendedError;
    console.error("Xendit Webhook Processing Error:", err.message);

    if (webhookEvent) {
      console.error("Webhook event data leading to error:", JSON.stringify(webhookEvent, null, 2));
    }

    return NextResponse.json(
      { error: "Internal Server Error during webhook processing" },
      { status: 500 }
    );
  }
}