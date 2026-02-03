import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  userEmail: string,
  verifyLink: string,
): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are missing");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyLink}" target="_blank">${verifyLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};
