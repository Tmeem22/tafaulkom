import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP variables not set, skipping email. Simulated email:');
    console.log(`To: ${to}\nSubject: ${subject}\nBody: ${html}`);
    return;
  }
  
  try {
    console.log(`[Mailer] Attempting to send email to ${to}...`);
    const info = await transporter.sendMail({
      from: `"تفاعلكم" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Mailer] Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("[Mailer] Error sending email:", error);
    throw error; // Re-throw to let the API handle it
  }
};
