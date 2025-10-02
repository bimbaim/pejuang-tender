// app/api/sendgrid/route.ts

import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { trialWelcomeTemplate } from "@/lib/emailTemplates/trialWelcome";
import { subscriptionWelcomeTemplate } from "@/lib/emailTemplates/subscriptionWelcome";
import { dailyTenderTrialEmailTemplate } from "@/lib/emailTemplates/dailyTenderTrial";
import { reminderTrialEmailTemplate } from "@/lib/emailTemplates/reminderTrial";
import { reminderPaidEmailTemplate } from "@/lib/emailTemplates/reminderPaid";
import { dailyTenderPaidEmailTemplate } from "@/lib/emailTemplates/dailyTenderPaid";
import { internalNotificationTemplate } from "@/lib/emailTemplates/internalNotification";
import { internalSubscriptionNotificationTemplate } from "@/lib/emailTemplates/internalSubscriptionNotification";

interface SendGridError extends Error {
  response?: {
    body?: {
      errors?: {
        message: string;
      }[];
    };
  };
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { to, subject, templateName, data } = await req.json();

    if (!to || !subject || !templateName || !data) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let emailBody = "";

    switch (templateName) {
      case "trialWelcome":
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.trialEndDate !== "string"
        ) {
          return NextResponse.json(
            { message: "Missing or invalid data for trialWelcome template" },
            { status: 400 }
          );
        }
        emailBody = trialWelcomeTemplate(data.name, data.trialEndDate);
        break;

      case "subscriptionWelcome":
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.packageName !== "string"
        ) {
          return NextResponse.json(
            {
              message:
                "Missing or invalid data for subscriptionWelcome template",
            },
            { status: 400 }
          );
        }
        emailBody = subscriptionWelcomeTemplate(data.name, data.packageName);
        break;

      case "dailyTenderTrial":
        // ✅ Periksa semua data yang diperlukan
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.category !== "string" ||
          typeof data.spse !== "string" ||
          typeof data.keyword !== "string" ||
          !Array.isArray(data.mainTenders) ||
          !Array.isArray(data.similarTendersOtherSPSE) ||
          !Array.isArray(data.similarTendersSameSPSE) ||
          typeof data.trialEndDate !== "string"
        ) {
          return NextResponse.json(
            {
              message:
                "Missing or invalid data for dailyTenderTrial template. Required: name, category, spse, keyword, mainTenders, similarTendersOtherSPSE, similarTendersSameSPSE, trialEndDate",
            },
            { status: 400 }
          );
        }

        // ✅ Panggil template dengan semua argumen baru
        emailBody = dailyTenderTrialEmailTemplate(
          data.name,
          data.category,
          data.spse,
          data.keyword,
          data.mainTenders,
          data.similarTendersOtherSPSE,
          data.similarTendersSameSPSE,
          data.trialEndDate
        );
        break;

      case "dailyTenderPaid":
        // ✅ Periksa semua data yang diperlukan (name, 3 kriteria filter, 3 daftar tender)
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.category !== "string" ||
          typeof data.spse !== "string" ||
          typeof data.keyword !== "string" ||
          !Array.isArray(data.mainTenders) ||
          !Array.isArray(data.similarTendersOtherSPSE) ||
          !Array.isArray(data.similarTendersSameSPSE)
        ) {
          return NextResponse.json(
            {
              message:
                "Missing or invalid data for dailyTenderPaid template. Required: name, category, spse, keyword, mainTenders, similarTendersOtherSPSE, similarTendersSameSPSE",
            },
            { status: 400 }
          );
        }

        // ✅ Panggil template dengan semua argumen baru
        emailBody = dailyTenderPaidEmailTemplate(
          data.name,
          data.category,
          data.spse,
          data.keyword,
          data.mainTenders,
          data.similarTendersOtherSPSE,
          data.similarTendersSameSPSE
        );
        break;

      case "reminderTrial":
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.trialEndDate !== "string"
        ) {
          return NextResponse.json(
            { message: "Missing or invalid data for reminderTrial template" },
            { status: 400 }
          );
        }
        emailBody = reminderTrialEmailTemplate(data.name, data.trialEndDate);
        break;

      case "reminderPaid":
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.subscriptionEndDate !== "string" ||
          typeof data.packageName !== "string"
        ) {
          return NextResponse.json(
            { message: "Missing or invalid data for reminderPaid template" },
            { status: 400 }
          );
        }
        emailBody = reminderPaidEmailTemplate(
          data.name,
          data.packageName,
          data.subscriptionEndDate
        );
        break;

      case "internalNotification":
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.email !== "string" ||
          typeof data.trialEndDate !== "string"
        ) {
          return NextResponse.json(
            {
              message: "Missing or invalid data for internalNotification template",
            },
            { status: 400 }
          );
        }
        emailBody = internalNotificationTemplate(
          data.name,
          data.email,
          data.trialEndDate
        );
        break;

      case "internalSubscriptionNotification":
        if (
          !data ||
          typeof data.name !== "string" ||
          typeof data.email !== "string" ||
          typeof data.packageName !== "string"
        ) {
          return NextResponse.json(
            {
              message: "Missing or invalid data for internalSubscriptionNotification template",
            },
            { status: 400 }
          );
        }
        emailBody = internalSubscriptionNotificationTemplate(
          data.name,
          data.email,
          data.packageName
        );
        break;

      default:
        return NextResponse.json(
          { message: "Invalid template name" },
          { status: 400 }
        );
    }

    const msg = {
      to,
      from: "info@pejuangtender.id", // Ganti dengan email pengirim terverifikasi Anda
      subject,
      html: emailBody,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const sgError = error as SendGridError;
      let errorMessage = sgError.message;
      if (sgError.response?.body?.errors?.length) {
        errorMessage = sgError.response.body.errors
          .map((err) => err.message)
          .join(", ");
      }
      console.error("Failed to send email:", errorMessage);
      return NextResponse.json(
        { message: "Failed to send email", error: errorMessage },
        { status: 500 }
      );
    } else {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json(
        {
          message: "Failed to send email",
          error: "An unexpected error occurred.",
        },
        { status: 500 }
      );
    }
  }
}
