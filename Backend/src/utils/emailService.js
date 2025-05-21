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
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f6f2; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #e4dcd2;">
    <h2 style="color: #4e2929;">Welcome to Prajapati Ceramic, ${username}!</h2>
    
    <p style="font-size: 16px; color: #4e2929;">
      We're absolutely thrilled to have you join our artistic community.
    </p>

    <hr style="border: none; border-top: 1px solid #e4dcd2; margin: 20px 0;" />

    <h3 style="color: #4e2929;">About Prajapati Ceramic</h3>
    <p style="font-size: 15px; color: #4e2929;">
      Prajapati Ceramic is dedicated to preserving and celebrating the timeless artistry of the Prajapati community. Our mission is to promote traditional ceramic craftsmanship while providing a modern platform for artists and enthusiasts alike.
    </p>

    <p style="font-size: 15px; color: #4e2929;">
      As part of our family, you'll get exclusive access to artisan products, stories behind each creation, and a chance to support this vibrant cultural legacy.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5173/login" style="background-color: #d4a017; color: #4e2929; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
        Go to Login
      </a>
    </div>

    <p style="font-size: 13px; color: #777; text-align: center;">
      This is an automated email from Prajapati Ceramic. Please do not reply.
    </p>
  </div>
`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendWelcomeEmail; // ✅ Make sure this is here
