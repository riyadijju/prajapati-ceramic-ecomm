// src/utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendWelcomeEmail(to, username) {
  const mailOptions = {
    from: `"Prajapati Ceramic" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Prajapati Ceramic!",
    html: `
  <div style="font-family: 'Inter', 'Roboto', sans-serif; background-color: #f9f6f2; margin: 0; padding: 0; width: 100%;">
    
    <!-- Header Image (1/3 of the page height look) -->
    <div style="text-align: center; padding: 20px 0 10px;">
      <img src="https://res.cloudinary.com/dtkxlyyhq/image/upload/v1747657045/bgTransparent_pmaqgm.png" alt="Prajapati Illustration" style="max-width: 100%; height: auto; width: 80%; max-height: 180px; object-fit: contain;" />
    </div>

    <!-- Content Section -->
    <div style="max-width: 700px; margin: auto; padding: 0 24px 40px; color: #4e2929;">
      <h1 style="font-weight: 600; font-size: 24px; margin-bottom: 16px; color: #4e2929;">
        Welcome to Prajapati Ceramic, ${username}!
      </h1>

      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        We're absolutely thrilled to have you join our artistic community.
      </p>

      <h2 style="font-weight: 500; font-size: 18px; margin-bottom: 10px;">About Prajapati Ceramic</h2>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 12px;">
        Prajapati Ceramic is dedicated to preserving and celebrating the timeless artistry of the Prajapati community.
        Our mission is to promote traditional ceramic craftsmanship while providing a modern platform for artists and enthusiasts alike.
      </p>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
        As part of our family, you'll get exclusive access to artisan products, stories behind each creation, and a chance to support this vibrant cultural legacy.
      </p>

      <div style="text-align: center;">
        <a href="https://prajapati-ceramic-frontend-4tbs.vercel.app/login" style="background-color: #d4a017; color: #4e2929; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
          Go to Login
        </a>
      </div>

      <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px;">
        This is an automated email from Prajapati Ceramic. Please do not reply.
      </p>
    </div>
  </div>
`
,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendWelcomeEmail; // ✅ Make sure this is here
