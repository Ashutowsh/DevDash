import nodemailer from "nodemailer";

export async function sendCreditsEmail(
  email: string,
  username: string,
  credits: number
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Dev Dash" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Dev Dash Credits Have Been Added 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hello, ${username} 👋</h2>
          <p>Thank you for your purchase!</p>
          <p><strong>${credits} credits</strong> have been added to your Dev Dash account.</p>
          <p>Enjoy building with power and speed. 🚀</p>
          <br />
          <p style="font-size: 0.9em; color: gray;">If you didn’t request this, please contact us immediately.</p>
        </div>
      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Verification email sent successfully to the user.",
      data: mailResponse,
    };
  } catch (emailError) {
    console.error("Error sending email verification.", emailError);
    return {
      success: false,
      message: "Failed to send verification email to the user.",
    };
  }
}
