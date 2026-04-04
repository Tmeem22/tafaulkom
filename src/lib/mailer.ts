import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: parseInt(process.env.SMTP_PORT || '465') === 465, // true for 465, false for others
  pool: true,   // Use pooled connections
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps with some cloud network restrictions
    minVersion: 'TLSv1.2'
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('[Mailer] Connection error:', error);
  } else {
    console.log('[Mailer] Server is ready to take our messages');
  }
});

export const sendMail = async (to: string, subject: string, html: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Mailer] Missing credentials, skipping email.');
    return;
  }
  
  try {
    console.log(`[Mailer] Sending email to ${to}...`);
    const info = await transporter.sendMail({
      from: `"تفاعلكم" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Mailer] Success! Message ID: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("[Mailer] Detailed Error:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};
