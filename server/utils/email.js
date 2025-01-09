import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: "no-reply@yourapp.com",
    to: email,
    subject: "Verify Your Email",
    html: `
        <h1>Welcome to MyApp!</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
