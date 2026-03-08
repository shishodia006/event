import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import nodemailer from 'nodemailer'; // 👈 Added this

const app = express();      
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend Server is Running for mahakumbh automation!');      
});



// ✅ Send WhatsApp Message for lead event template 
app.post('/api/send-demo-message', async (req, res) => {
  const { phoneNumber, name } = req.body;

   // Validate required fields
  if (!phoneNumber || !name) {
    return res.status(400).json({
      success: false,
      error: 'Missing phoneNumber or name'
    });
  }
  


  const templateId = 2205; // ✅ Always use this template
  const formattedNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
  const apiUrl = `https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=${templateId}`;
   const apiKey = '931C2D6E-0C0D-4A6F-880B-B1FE075F5956';

  const formData = new FormData();
  formData.append('ContactName', name);
  formData.append('ContactNo', formattedNumber);
  formData.append('Attribute1', name);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'accept': '*/*',
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (err) {
    console.error('❌ Error sending demo WhatsApp message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});


// ✅ Send Email (Nodemailer)
app.post('/api/send-email', async (req, res) => {
  const { name, email } = req.body;
  console.log('📧 Email payload:', req.body);

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Missing name or email' });
  }

  try {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
      auth: {
        user: 'info@anantya.ai',
        pass: 'ejbfzkykilmjzpqw', 
      },
    });


const html = `Hi ${name},<br><br>

You just made the smartest move toward <strong>turning WhatsApp into a full-blown growth machine</strong> for your business. 🔥<br>
With <strong>Anantya NEO</strong>, you don’t just get access — <em>you get the power to choose, control, and scale the way you want.</em><br><br>

Here’s something extra waiting for you inside <strong>NEO</strong>:<br><br>

1. <strong>First 1000 utility messages — free, on us!</strong><br>
2. <strong>Lifetime validity</strong> on your credits for all active accounts (no expiry, no waste)<br>
3. <strong>Free WhatsApp Widget</strong> — make your website a sales magnet<br>
4. <strong>Fully customizable platform</strong> — pick any 5 features, your way<br><br>

<strong>Pick any 5 high-impact WhatsApp tools</strong> from chatbots to bulk campaigns, automation to insights —<br>
<strong>NEO lets you handpick</strong> your WhatsApp growth stack in <strong>just ₹10,999/year</strong>.<br><br>

Whether you’re a solo founder or a growing brand — this is your launchpad. 🎯<br><br>

👉 <a href="https://calendly.com/info-w0m/30min?month=2025-07" target="_blank">Schedule a quick demo with our experts now!</a><br><br>

Let’s get your business on WhatsApp — the right way.<br><br>

Warm regards,<br>
— Team Anantya`;

await transporter.sendMail({
  from: 'info@anantya.ai',
  to: email,
  cc: ['sales@anantya.ai', 'bhanu@anantya.ai', 'mokshika@anantya.ai'],
  subject: `You’re in. It’s time to NEO your Automation!, ${name}!`,
  html // use the html content here
});

    console.log('✅ Email sent to:', email);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Email send failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


