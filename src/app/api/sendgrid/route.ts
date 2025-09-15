// app/api/sendgrid/route.ts

import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { trialWelcomeTemplate } from '@/lib/emailTemplates/trialWelcome';

// Define a type for the potential SendGrid error
// This makes the code more robust and easy to read
interface SendGridError extends Error {
  response?: {
    body?: {
      errors?: {
        message: string;
      }[];
    };
  };
}

// Set SendGrid API Key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { to, subject, templateName, data } = await req.json();

    if (!to || !subject || !templateName || !data) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let emailBody = '';
    
    // Select template based on templateName
    switch (templateName) {
      case 'trialWelcome':
        // Type check the data for the specific template
        if (!data || typeof data.name !== 'string' || typeof data.trialEndDate !== 'string') {
          return NextResponse.json({ message: 'Missing or invalid data for trialWelcome template' }, { status: 400 });
        }
        emailBody = trialWelcomeTemplate(data.name, data.trialEndDate);
        break;
      
      // Add more cases for other templates here
        
      default:
        return NextResponse.json({ message: 'Invalid template name' }, { status: 400 });
    }

    // Create the message object
    const msg = {
      to,
      from: "info@pejuangtender.id",
      subject,
      html: emailBody,
    };

    // Send the email
    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error: unknown) {
    // Safely check the type of the error object
    if (error instanceof Error) {
      const sgError = error as SendGridError; // Cast to the defined type

      let errorMessage = sgError.message;
      if (sgError.response?.body?.errors?.length) {
        // Concatenate all error messages from SendGrid's response body
        errorMessage = sgError.response.body.errors.map(err => err.message).join(', ');
      }

      console.error("Failed to send email:", errorMessage);
      return NextResponse.json({ message: 'Failed to send email', error: errorMessage }, { status: 500 });
    } else {
      // Handle cases where the error is not an Error object (e.g., a string or number)
      console.error("An unexpected error occurred:", error);
      return NextResponse.json({ message: 'Failed to send email', error: 'An unexpected error occurred.' }, { status: 500 });
    }
  }
}