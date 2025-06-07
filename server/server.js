const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const createEmailTemplate = require('./emailTemplate');
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://liquidata.dev',           // Production URL
  'https://www.liquidata.dev',       // Production URL with www
  'http://localhost:3000',          // Local development
  'http://localhost:3001'           // Alternative local port
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Blocked origin:', origin); // Debug log
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    allowedOrigins: allowedOrigins 
  });
});

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
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