// app/api/sendgrid/route.ts

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { trialWelcomeTemplate } from '@/lib/emailTemplates/trialWelcome';
import { subscriptionWelcomeTemplate } from '@/lib/emailTemplates/subscriptionWelcome'; // Import new template

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
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let emailBody = '';
    
    switch (templateName) {
      case 'trialWelcome':
        if (!data || typeof data.name !== 'string' || typeof data.trialEndDate !== 'string') {
          return NextResponse.json({ message: 'Missing or invalid data for trialWelcome template' }, { status: 400 });
        }
        emailBody = trialWelcomeTemplate(data.name, data.trialEndDate);
        break;

      case 'subscriptionWelcome':
        if (!data || typeof data.name !== 'string' || typeof data.packageName !== 'string') {
          return NextResponse.json({ message: 'Missing or invalid data for subscriptionWelcome template' }, { status: 400 });
        }
        emailBody = subscriptionWelcomeTemplate(data.name, data.packageName);
        break;
      
      default:
        return NextResponse.json({ message: 'Invalid template name' }, { status: 400 });
    }

    const msg = {
      to,
      from: "info@pejuangtender.id", // Ganti dengan email pengirim terverifikasi Anda
      subject,
      html: emailBody,
    };

    await sgMail.send(msg);

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