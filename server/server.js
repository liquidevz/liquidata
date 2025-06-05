const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const createEmailTemplate = require('./emailTemplate');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const formData = req.body;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `New Contact Form Submission from ${formData.name} - ${formData.company}`,
      html: createEmailTemplate(formData),
      attachments: [{
        filename: 'logo-dark.png',
        path: path.join(__dirname, '../public/assets/imgs/logo-dark.png'),
        cid: 'company-logo'
      }]
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 