import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { full_name, email, position, resume_url, cover_message } = req.body;

  // Basic validation
  if (!full_name || !email || !position) {
    return res.status(400).json({ success: false, message: 'Missing required fields: full_name, email, or position.' });
  }

  try {
    // If SMTP_HOST is not configured (e.g. in local development), log the application and return success
    if (!process.env.SMTP_HOST) {
      console.log('--- MOCK EMAIL DELIVERY ---');
      console.log(`To: ${process.env.RECRUITMENT_EMAIL || 'recruitment@gotek.com'}`);
      console.log(`Subject: New Job Application: ${full_name} for ${position}`);
      console.log(`Name: ${full_name}\nEmail: ${email}\nPosition: ${position}\nResume: ${resume_url}`);
      console.log(`Message: ${cover_message}`);
      console.log('---------------------------');
      return res.status(200).json({ success: true, message: 'Application submitted successfully (Mock).' });
    }

    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER, // Ensure this matches your authenticated SMTP user
      to: process.env.RECRUITMENT_EMAIL || 'recruitment@gotek.com', // Where applications should be sent
      subject: `New Job Application: ${full_name} for ${position}`,
      text: `
A new job application has been submitted via the Gotek website.

Candidate Details:
------------------
Name: ${full_name}
Email: ${email}
Position: ${position}
Resume URL / Portfolio: ${resume_url || 'Not provided'}

Introduction & Cover Message:
-----------------------------
${cover_message || 'None provided'}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Error sending application email:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error while sending email. Please check server configuration.' });
  }
}
