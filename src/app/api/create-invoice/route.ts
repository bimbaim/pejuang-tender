import { NextResponse } from "next/server";
import { Xendit } from "xendit-node";

// Initialize Xendit client with your secret key
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

// Destructure the Invoice module from the Xendit client
const { Invoice } = xenditClient;

export async function POST(req: Request) {
  let requestData: any; // Declare requestData here to make it accessible in the catch block

  try {
    // 1. Parse the incoming JSON request body
    requestData = await req.json();

    // 2. Destructure amount, customer, and the new subscriptionId from the parsed data
    const { amount, customer, subscriptionId } = requestData;

    // --- Comprehensive Debugging Logs (for development) ---
    console.log("\n--- Incoming Request Data for Invoice Creation ---");
    console.log("Raw parsed data:", JSON.stringify(requestData, null, 2));
    console.log("Amount received:", amount, "| Type:", typeof amount);
    console.log("Customer object received:", customer, "| Type:", typeof customer);
    console.log("Subscription ID received:", subscriptionId, "| Type:", typeof subscriptionId);
    console.log("--- End Incoming Request Data ---\n");

    // 3. Basic Validation: Check if amount, customer, and subscriptionId are present
    if (amount === undefined || amount === null || customer === undefined || customer === null || subscriptionId === undefined || subscriptionId === null) {
      console.error("Validation Error: Missing 'amount', 'customer', or 'subscriptionId' in request body.");
      return NextResponse.json(
        { error: "Missing required fields: amount, customer, or subscriptionId" },
        { status: 400 }
      );
    }

    // 4. Validate Amount: Ensure it's a valid positive number
    const finalAmount = Number(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
      console.error(`Validation Error: Invalid amount '${amount}'. Amount must be a positive number.`);
      return NextResponse.json(
        { error: `Invalid amount provided: ${amount}. Amount must be a positive number.` },
        { status: 400 }
      );
    }

    // 5. Validate Customer: Ensure essential customer details are present
    if (!customer.email || !customer.name) {
      console.error("Validation Error: Customer object must contain 'email' and 'name'.");
      return NextResponse.json(
        { error: "Customer object must contain 'email' and 'name'." },
        { status: 400 }
      );
    }

    // Log the data that will be sent to Xendit
    console.log("Attempting to create invoice with:");
    console.log(`  External ID: ${subscriptionId}`); // Using subscriptionId as externalId
    console.log(`  Amount: ${finalAmount}`);
    console.log(`  Customer Email: ${customer.email}`);
    console.log(`  Customer Name: ${customer.name}`);

    // Define the webhook callback URL. IMPORTANT: Replace with your deployed domain for production!
    // For local testing, you might need a tool like ngrok to expose your localhost to Xendit.
    const xenditCallbackUrl = process.env.XENDIT_CALLBACK_URL || "https://localhost:3000/api/xendit-webhook";
    console.log("Xendit Callback URL set to:", xenditCallbackUrl);

    // 6. Call Xendit API to create the invoice
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: String(subscriptionId), // Use the subscription ID as the external ID
        amount: finalAmount,
        description: "Subscription Payment", // More specific description
        currency: "IDR",
        customer: {
          givenNames: customer.name.split(" ")[0] || customer.name,
          surname: customer.name.split(" ")[1] || "",
          email: customer.email,
          mobileNumber: customer.whatsapp || "+628000000000",
        },
        successRedirectUrl: "http://localhost:3000/thank-you",
        failureRedirectUrl: "https://localhost:3000/payment-failed",
        // Add the callback URL for Xendit to notify your server upon payment completion
        callbackUrl: xenditCallbackUrl, 
      },
    });

    console.log("Invoice created successfully:", invoice.id, "URL:", invoice.invoiceUrl);
    return NextResponse.json({ invoiceUrl: invoice.invoiceUrl });

  } catch (error: any) {
    console.error("\n--- Xendit API Error Caught in Server ---");
    console.error("Error message:", error.message);
    console.error("Original request data that led to error:", JSON.stringify(requestData, null, 2));
    
    console.error("Xendit Error Details (if provided by Xendit SDK):", {
      code: error.code,
      type: error.type,
      statusCode: error.statusCode,
      field: error.field,
      errors: error.errors,
    });
    console.error("--- End Xendit API Error ---\n");

    return NextResponse.json(
      { error: error.message || "Failed to create invoice due to an internal server error." },
      { status: 500 }
    );
  }
}
