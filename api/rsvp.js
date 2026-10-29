import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS Headers for cross-subdomain support
  res.setHeader('Access-Control-Allow-Credentials', true);
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
    const { name, email, status, plus, note } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required' });
    }

    const isAttending = status === 'yes' || status === 'attending';
    const statusLabel = isAttending ? 'Joyfully Attending 🎉' : 'Regretfully Declining ✉️';
    const plusLabel = plus === '1' || plus === 1 ? '+1 Guest' : 'Just Me';

    const data = await resend.emails.send({
      from: 'Birthday RSVP <rsvp@visionedu.online>',
      to: ['mensuohndaase@gmail.com'],
      reply_to: email,
      subject: `🎉 Birthday RSVP: ${name} (${isAttending ? 'Attending' : 'Declined'})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #05080f; color: #ffffff; padding: 20px; }
            .card { max-width: 580px; margin: 0 auto; background: #0a0f1d; border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 20px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
            .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.4); margin-bottom: 20px; }
            h2 { color: #ffffff; font-size: 24px; margin-top: 0; margin-bottom: 12px; }
            .detail-row { padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 14px; }
            .label { color: #94a3b8; font-weight: 600; width: 140px; display: inline-block; }
            .value { color: #ffffff; font-weight: 700; }
            .status-attending { color: #10b981; font-weight: 800; }
            .status-declined { color: #ef4444; font-weight: 800; }
            .note-box { background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 16px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.08); }
            .footer { margin-top: 24px; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">Yaw Ndaase • 10th December Celebration</div>
            <h2>New RSVP Confirmation</h2>
            
            <div class="detail-row">
              <span class="label">Guest Name:</span>
              <span class="value">${name}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Email Address:</span>
              <span class="value"><a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a></span>
            </div>

            <div class="detail-row">
              <span class="label">Attendance:</span>
              <span class="${isAttending ? 'status-attending' : 'status-declined'}">${statusLabel}</span>
            </div>

            <div class="detail-row">
              <span class="label">Plus One (+1):</span>
              <span class="value">${plusLabel}</span>
            </div>

            ${note ? `
            <div class="note-box">
              <div style="font-size: 11px; text-transform: uppercase; color: #fbbf24; font-weight: 700; margin-bottom: 6px;">Note / Song Request:</div>
              <div style="color: #e2e8f0; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">"${note}"</div>
            </div>
            ` : ''}

            <div class="footer">
              Received via bday.visionedu.site • Click reply to respond directly to ${name}.
            </div>
          </div>
        </body>
        </html>
      `
    });

    return res.status(200).json({ success: true, id: data?.id });

  } catch (error) {
    console.error('RSVP email error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send RSVP email notification' });
  }
}
