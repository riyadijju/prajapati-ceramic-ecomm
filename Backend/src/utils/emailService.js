
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, username, token) => {
  const verificationUrl = `http://localhost:5173/verify-email/${token}`;

  const mailOptions = {
    from: `Prajapati Ceramic <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your Prajapati Ceramic account",
    html: `
      <p>Hello ${username},</p>
      <p>Thanks for signing up with <strong>Prajapati Ceramics</strong>!</p>
      <p>Please verify your email to complete your registration:</p>
      <p><a href="${verificationUrl}" style="background: #d4a017; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">Verify Email</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>Regards,<br>Prajapati Ceramic Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
