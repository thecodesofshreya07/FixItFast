// const nodemailer = require("nodemailer");


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendOtpEmail = async (to, otp) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject: "Your OTP Verification Code",
//     html: `
//       <div style="font-family:Arial;padding:20px">
//         <h2>FixItFast OTP Verification</h2>
//         <p>Your OTP is:</p>
//         <h1>${otp}</h1>
//         <p>This OTP will expire in 5 minutes.</p>
//       </div>
//     `,
//   });
// };

// module.exports = sendOtpEmail;

const nodemailer = require("nodemailer");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log("VERIFY ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>FixItFast OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;