import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, interest, vision } = req.body;

    const data = await resend.emails.send({
      from: 'Partnerships <no-reply@visionedu.online>',
      to: ['hello@visionedu.site', 'mensuohyaw@gmail.com'],
      reply_to: email,
      subject: `New Partnership Inquiry: ${interest} - ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #10b981;">New Partnership Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Interest:</strong> ${interest}</p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 16px; border: 1px solid #e5e7eb;">
            <h3 style="margin-top: 0; color: #1e293b;">Brief Vision:</h3>
            <p style="white-space: pre-wrap; margin-bottom: 0;">${vision}</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
