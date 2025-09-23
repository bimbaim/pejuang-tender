// app/api/create-invoice/route.ts
import { NextResponse } from "next/server";
import { Xendit } from "xendit-node";

// Define interfaces for the expected request body from your frontend
interface CustomerDetails {
  email: string;
  name: string;
  whatsapp?: string; // whatsapp is optional
}

interface CreateInvoiceRequestBody {
  amount: number;
  customer: CustomerDetails;
  subscriptionId: string; // Assuming subscriptionId is always a string as it's used as externalId
}

// Define an interface for potential Xendit error structure
interface XenditError extends Error {
  code?: string;
  type?: string;
  statusCode?: number;
  field?: string;
  errors?: {
    message: string;
    field: string;
  }[];
}

// Initialize Xendit client with your secret key
const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

// Destructure the Invoice module from the Xendit client
const { Invoice } = xenditClient;

export async function POST(req: Request) {
  let requestData: CreateInvoiceRequestBody | undefined; // Use the specific interface, initialized as undefined

  try {
    // 1. Parse the incoming JSON request body
    const rawRequestData = await req.json();
    requestData = rawRequestData; // Assign raw data for logging in catch block

    // Crucial check: Ensure requestData is not undefined before destructuring
    if (!requestData || typeof requestData.amount === 'undefined' || !requestData.customer || !requestData.subscriptionId) {
        console.error("Validation Error: Invalid or missing data after JSON parsing.");
        return NextResponse.json(
            { error: "Invalid request body structure." },
            { status: 400 }
        );
    }

    // Now TypeScript knows requestData is definitely CreateInvoiceRequestBody
    const { amount, customer, subscriptionId } = requestData;

    // --- Comprehensive Debugging Logs (for development) ---
    console.warn("\n--- Incoming Request Data for Invoice Creation ---");
    console.warn("Raw parsed data:", JSON.stringify(requestData, null, 2));
    console.warn("Amount received:", amount, "| Type:", typeof amount);
    console.warn("Customer object received:", customer, "| Type:", typeof customer);
    console.warn("Subscription ID received:", subscriptionId, "| Type:", typeof subscriptionId);
    console.warn("--- End Incoming Request Data ---\n");

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
    console.warn("Attempting to create invoice with:");
    console.warn(`  External ID: ${subscriptionId}`); // Using subscriptionId as externalId
    console.warn(`  Amount: ${finalAmount}`);
    console.warn(`  Customer Email: ${customer.email}`);
    console.warn(`  Customer Name: ${customer.name}`);

    // Define the webhook callback URL. IMPORTANT: Replace with your deployed domain for production!
    const xenditCallbackUrl = process.env.XENDIT_CALLBACK_URL || "http://pejuang-tender.vercel.app/api/xendit-webhook";
    console.warn("Xendit Callback URL set to:", xenditCallbackUrl);

    // ✅ Perbaikan utama ada di sini
    const nameParts = customer.name.trim().split(" ");
    const givenNames = nameParts[0] || customer.name;
    // Surname mengambil semua nama setelah nama pertama, atau "Customer" jika tidak ada
    const surname = nameParts.slice(1).join(" ") || "Customer";
    
    // Pastikan mobile number memiliki format internasional +62
    const whatsapp = customer.whatsapp?.trim();
    let mobileNumber = "+628000000000"; // Fallback default
    if (whatsapp) {
      // Jika dimulai dengan '0', ganti dengan '+62'
      if (whatsapp.startsWith('0')) {
        mobileNumber = `+62${whatsapp.slice(1)}`;
      } else if (whatsapp.startsWith('+')) {
        mobileNumber = whatsapp;
      } else {
        mobileNumber = `+${whatsapp}`;
      }
    }
    
    // 6. Call Xendit API to create the invoice
    const invoice = await Invoice.createInvoice({
      data: {
        externalId: String(subscriptionId),
        amount: finalAmount,
        description: "Subscription Payment",
        currency: "IDR",
        customer: {
            givenNames,
            surname,
            email: customer.email,
            mobileNumber,
        },
        // 🔥 Perubahan inti ada di sini: Menambahkan query param `transaction_id`
        successRedirectUrl: `https://pejuangtender.id/thank-you`,
        failureRedirectUrl: `https://pejuangtender.id/thank-you`,
      },
    });

    console.warn("Invoice created successfully:", invoice.id, "URL:", invoice.invoiceUrl);
    return NextResponse.json({ invoiceUrl: invoice.invoiceUrl });

  } catch (error: unknown) {
    console.error("\n--- Xendit API Error Caught in Server ---");
    
    // Safely cast to XenditError interface if it matches, otherwise use generic Error properties
    const xenditError = error as XenditError; 

    console.error("Error message:", xenditError.message);
    if (requestData) { // Check if requestData was successfully parsed before logging
      console.error("Original request data that led to error:", JSON.stringify(requestData, null, 2));
    }
    
    // Log Xendit specific error details if they exist on the error object
    console.error("Xendit Error Details (if provided by Xendit SDK):", {
      code: xenditError.code,
      type: xenditError.type,
      statusCode: xenditError.statusCode,
      field: xenditError.field,
      errors: xenditError.errors,
    });
    console.error("--- End Xendit API Error ---\n");

    return NextResponse.json(
      { error: xenditError.message || "Failed to create invoice due to an internal server error." },
      { status: 500 }
    );
  }
}