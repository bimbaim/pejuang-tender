// app/api/sendgrid/route.ts

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { trialWelcomeTemplate } from '@/lib/emailTemplates/trialWelcome';
import { subscriptionWelcomeTemplate } from '@/lib/emailTemplates/subscriptionWelcome';
import { dailyTenderTrialEmailTemplate } from "@/lib/emailTemplates/dailyTenderTrial";
import { reminderTrialEmailTemplate } from '@/lib/emailTemplates/reminderTrial';
import { reminderPaidEmailTemplate } from '@/lib/emailTemplates/reminderPaid';
import { dailyTenderPaidEmailTemplate } from '@/lib/emailTemplates/dailyTenderPaid';

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

// Ini adalah fungsi baru yang bisa diimpor dan dipanggil langsung.
export async function sendEmailFromTemplate(to: string, subject: string, templateName: string, data: any) {
  let emailBody = '';
  
  switch (templateName) {
    case 'trialWelcome':
      if (!data || typeof data.name !== 'string' || typeof data.trialEndDate !== 'string') {
        throw new Error('Missing or invalid data for trialWelcome template');
      }
      emailBody = trialWelcomeTemplate(data.name, data.trialEndDate);
      break;

    case 'subscriptionWelcome':
      if (!data || typeof data.name !== 'string' || typeof data.packageName !== 'string') {
        throw new Error('Missing or invalid data for subscriptionWelcome template');
      }
      emailBody = subscriptionWelcomeTemplate(data.name, data.packageName);
      break;

    case 'dailyTenderTrial':
      if (!data || typeof data.name !== 'string' || !Array.isArray(data.tenders) || typeof data.trialEndDate !== 'string') {
        throw new Error('Missing or invalid data for dailyTenderTrial template');
      }
      emailBody = dailyTenderTrialEmailTemplate(data.name, data.tenders, data.trialEndDate);
      break;

    case 'dailyTenderPaid':
      if (!data || typeof data.name !== 'string' || !Array.isArray(data.tenders)) {
        throw new Error('Missing or invalid data for dailyTenderPaid template');
      }
      emailBody = dailyTenderPaidEmailTemplate(data.name, data.tenders);
      break;

    case 'reminderTrial':
      if (!data || typeof data.name !== 'string' || typeof data.trialEndDate !== 'string') {
        throw new Error('Missing or invalid data for reminderTrial template');
      }
      emailBody = reminderTrialEmailTemplate(data.name, data.trialEndDate);
      break;

    case 'reminderPaid':
      if (!data || typeof data.name !== 'string' || typeof data.subscriptionEndDate !== 'string' || typeof data.packageName !== 'string') {
        throw new Error('Missing or invalid data for reminderPaid template');
      }
      emailBody = reminderPaidEmailTemplate(data.name, data.packageName, data.subscriptionEndDate);
      break;
    
    default:
      throw new Error('Invalid template name');
  }

  const msg = {
    to,
    from: "info@pejuangtender.id",
    subject,
    html: emailBody,
  };

  await sgMail.send(msg);
}

// Fungsi POST tetap ada untuk menangani permintaan HTTP eksternal.
export async function POST(req: Request) {
  try {
    const { to, subject, templateName, data } = await req.json();

    if (!to || !subject || !templateName || !data) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await sendEmailFromTemplate(to, subject, templateName, data);

    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error: unknown) {
    if (error instanceof Error) {
      const sgError = error as SendGridError;
      let errorMessage = sgError.message;
      if (sgError.response?.body?.errors?.length) {
        errorMessage = sgError.response.body.errors.map(err => err.message).join(', ');
      }
      console.error("Failed to send email:", errorMessage);
      return NextResponse.json({ message: 'Failed to send email', error: errorMessage }, { status: 500 });
    } else {
      console.error("An unexpected error occurred:", error);
      return NextResponse.json({ message: 'Failed to send email', error: 'An unexpected error occurred.' }, { status: 500 });
    }
  }
}
