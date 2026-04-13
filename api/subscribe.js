export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vision Education <welcome@visionedu.online>',
        to: [email],
        subject: 'Welcome to the Vision Circle! 🎓',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9; border-radius: 24px; background: #ffffff;">
            <div style="margin-bottom: 30px; text-align: center;">
              <div style="width: 50px; height: 50px; background: linear-gradient(to bottom right, #10b981, #6366f1); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; line-height: 50px;">V</div>
            </div>
            <h1 style="color: #05080f; font-size: 28px; font-weight: 800; margin-bottom: 20px; text-align: center;">Welcome to the Vision Circle!</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi there,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for joining Vision Education. You are now part of an exclusive group of Ghanaian students dedicated to excellence and academic leadership.</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">From now on, you'll be the first to know about:</p>
            <ul style="color: #475569; font-size: 16px; line-height: 1.6; padding-left: 20px;">
              <li style="margin-bottom: 10px;"><strong>Syllabus Updates:</strong> Stay ahead of any WAEC changes for 2026.</li>
              <li style="margin-bottom: 10px;"><strong>AI Study Tips:</strong> Learn how to leverage AI to 10x your preparation speed.</li>
              <li style="margin-bottom: 10px;"><strong>New Mock Exams:</strong> Get instant alerts when new subjects and test papers go live.</li>
            </ul>
            <div style="text-align: center; margin-top: 40px; margin-bottom: 40px;">
              <a href="https://visionedu.online" style="display: inline-block; padding: 16px 32px; background-color: #05080f; color: #ffffff; text-decoration: none; border-radius: 16px; font-weight: 800; font-size: 16px; transition: all 0.3s ease;">Start Practice Now</a>
            </div>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; border-top: 1px solid #f1f5f9; pt: 30px; margin-top: 30px;">
              Best regards,<br>
              <strong style="color: #05080f;">Yaw Ndaase Mensuoh</strong><br>
              Founder, Vision Education
            </p>
          </div>
        `,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      return res.status(500).json({ error: errorData.message });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
