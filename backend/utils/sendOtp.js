const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const sendOtpEmail = async (to, otp) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "FixItFast", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject: "Your OTP Verification Code",
      htmlContent: `
        <div style="font-family:Arial;padding:20px">
          <h2>FixItFast OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#FF5722;letter-spacing:8px">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to send email");
  }
};

module.exports = sendOtpEmail;