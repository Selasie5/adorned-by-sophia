import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter: nodemailer.Transporter | null = null;
let emailEnabled = true;


try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
     
      connectionTimeout: 5000,
      greetingTimeout: 5000,
    });
    
    
    transporter.verify((error) => {
      if (error) {
        console.warn('  Email service unavailable:', error.message);
        console.log(' Emails will be logged to console instead');
        emailEnabled = false;
      } else {
        console.log(' Email service ready');
        emailEnabled = true;
      }
    });
  } else {
    console.log(' Email service disabled (missing SMTP configuration)');
  }
} catch (error) {
  console.warn('  Failed to initialize email service:', error);
}

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  try {
  
    if (!emailEnabled || !transporter) {
      console.log(' [EMAIL SIMULATION]');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${html.substring(0, 100)}...`);
      return;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@adornedbysophia.com',
      to,
      subject,
      html
    });
    
    console.log(`✅ Email sent to ${to}`);
  } catch (error: any) {
    console.error('❌ Email error:', error.message);
    // Log email details for debugging
    console.log('📧 Failed to send email:');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
  }
};
