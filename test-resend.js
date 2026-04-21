import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log("Attempting to send test email with Resend...");
  try {
    const response = await resend.emails.send({
      from: 'Partnerships <no-reply@visionedu.online>',
      to: ['hello@visionedu.site', 'mensuohyaw@gmail.com'],
      subject: 'Test API Connection',
      html: '<p>Testing Resend API</p>'
    });
    
    if (response.error) {
      console.error("Resend API Error object:", response.error);
    } else {
      console.log("Success! Data:", response.data);
    }
  } catch (error) {
    console.error("Caught exception:", error);
  }
}

test();
