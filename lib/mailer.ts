import nodemailer, { Transporter } from "nodemailer";

type SendOTPEmailParams = {
  to: string;
  otp: string;
};

export const sendOTPEmail = async ({
  to,
  otp,
}: SendOTPEmailParams): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    // Email options type-safe
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "OTP Verification Code",
      html: `
        <div style="font-family: Arial; text-align: center;">
          <h2>🔐 OTP Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #0ea5e9; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send OTP email");
  }
};