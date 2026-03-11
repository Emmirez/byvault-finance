// services/emailService.js
import nodemailer from "nodemailer";


// Create transporter with explicit configuration
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Email transporter error:", error);
    console.log("❌ Error code:", error.code);
    console.log("❌ Error command:", error.command);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});


// Generate 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send 2FA code email
export const send2FACode = async (userEmail, code) => {
  try {
    console.log(`📧 Attempting to send email to: ${userEmail}`);

    const mailOptions = {
      from: `"Byvault Finance Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your Two-Factor Authentication Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Byvault Finance</h1>
            <p style="color: #666; margin: 5px 0;">Two-Factor Authentication</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 30px; border-radius: 8px; text-align: center;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Your Verification Code</h2>
            <div style="background-color: #2563eb; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #666; font-size: 14px; margin: 20px 0 0 0;">
              This code will expire in 10 minutes.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
            <p>If you didn't request this code, please contact support immediately.</p>
            <p>&copy; ${new Date().getFullYear()} Byvault Finance. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${userEmail}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  try {
    const mailOptions = {
      from: `"Byvault Finance" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password - Byvault Finance",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Byvault Finance</h1>
              <p style="color: #bfdbfe; margin: 10px 0 0; font-size: 14px;">Secure Password Reset</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 20px;">Hello ${name},</h2>
              <p style="color: #475569; margin: 0 0 20px;">We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">Reset Password</a>
              </div>
              
              <p style="color: #64748b; margin: 0 0 15px; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="background: #f1f5f9; padding: 12px; border-radius: 6px; color: #2563eb; word-break: break-all; font-size: 13px; margin: 0;">${resetUrl}</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 10px; font-size: 13px;">This link will expire in 1 hour for security reasons.</p>
                <p style="color: #64748b; margin: 0; font-size: 13px;">If you didn't request this password reset, please ignore this email or contact support.</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0 0 10px; font-size: 12px;">© 2026 Byvault Finance. All rights reserved.</p>
              <p style="color: #94a3b8; margin: 0; font-size: 11px;">800 Nicollet Mall Minneapolis, MN 55304</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return false;
  }
};
