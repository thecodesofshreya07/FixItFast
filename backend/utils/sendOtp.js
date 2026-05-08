const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"FixItFast" <${process.env.BREVO_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>FixItFast OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#FF5722;letter-spacing:8px">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;