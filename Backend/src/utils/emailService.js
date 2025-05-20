// backend/utils/emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (to, username) => {
  const mailOptions = {
    from: `"Prajapati Ceramic" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to Prajapati Ceramic!",
    html: `
      <p>Hello ${username},</p>

      <p>Thank you for registering with <strong>Prajapati Ceramics</strong>!</p>

      <p>Your account has been successfully created.</p>

      <p><a href="http://localhost:5173/login" style="color: #f77f00; font-weight: bold;">Click here to login to your account</a></p>

      <p>Regards,<br>The Prajapati Ceramic Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };
