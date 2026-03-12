// services/welcomeEmailService.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = async ({ to, name, accountId }) => {
  try {
    console.log(`📧 Sending welcome email to: ${to}`);

    await sgMail.send({
      from: {
        email: process.env.FROM_EMAIL,
        name: "Byvault Finance",
      },
      to,
      subject: "Welcome to Byvault Finance! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Byvault Finance</title>
          <style>
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #1e293b;
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.08);
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: white;
              margin: 20px 0 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #1e293b;
              margin-bottom: 20px;
            }
            .greeting strong {
              color: #2563eb;
            }
            .welcome-message {
              background: #f0f9ff;
              border-radius: 16px;
              padding: 25px;
              margin: 25px 0;
              border-left: 4px solid #2563eb;
            }
            .account-box {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              border-radius: 16px;
              padding: 25px;
              color: white;
              margin: 25px 0;
            }
            .account-number {
              font-size: 24px;
              font-family: monospace;
              letter-spacing: 2px;
              background: rgba(255,255,255,0.1);
              padding: 10px;
              border-radius: 8px;
              text-align: center;
              margin: 15px 0;
            }
            .features {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 30px 0;
            }
            .feature {
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
            }
            .feature-icon {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .feature-title {
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 5px;
            }
            .feature-desc {
              font-size: 12px;
              color: #64748b;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: white;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              font-weight: 600;
              margin: 20px 0;
              box-shadow: 0 4px 6px rgba(37,99,235,0.2);
            }
            .footer {
              background: #f8fafc;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .help-text {
              font-size: 13px;
              color: #64748b;
              margin-top: 20px;
            }
            .help-text a {
              color: #2563eb;
              text-decoration: none;
              font-weight: 500;
            }
            hr {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 30px 0;
            }
            .badge {
              display: inline-block;
              background: #f1f5f9;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
              color: #1e293b;
              margin-right: 8px;
              margin-bottom: 8px;
            }
            .badge.kyc {
              background: #22c55e;
              color: white;
            }
            .badge.twofa {
              background: #3b82f6;
              color: white;
            }
            @media (max-width: 600px) {
              .features {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 15px;">
                <tr>
                  <td style="
                    width: 70px;
                    height: 70px;
                    background: white;
                    border-radius: 20px;
                    text-align: center;
                    vertical-align: middle;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    font-size: 36px;
                    font-weight: bold;
                    color: #2563eb;
                    line-height: 70px;
                  ">B</td>
                </tr>
              </table>
              <h1>Welcome to Byvault Finance! 🎉</h1>
            </div>

            <div class="content">
              <div class="greeting">
                Hello <strong>${name}</strong>,
              </div>
              
              <p>Thank you for choosing Byvault Finance! We're thrilled to have you on board and excited to help you on your financial journey.</p>

              <div class="welcome-message">
                <p style="margin:0; font-size: 18px; color: #1e293b; font-weight: 500;">Your financial future starts here</p>
                <p style="margin:10px 0 0; color: #475569;">Experience banking that works for you, not against you.</p>
              </div>

              <div class="account-box">
                <p style="margin:0; font-size: 14px; opacity: 0.8;">Your Account ID</p>
                <div class="account-number">${accountId}</div>
                <p style="margin:10px 0 0; font-size: 13px; opacity: 0.7;">Use this ID for transfers and customer support</p>
              </div>

              <h3 style="color: #1e293b; margin-bottom: 15px;">What you can do with Byvault Finance:</h3>
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">💳</div>
                  <div class="feature-title">Virtual Cards</div>
                  <div class="feature-desc">Instant virtual cards for secure online payments</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">⚡</div>
                  <div class="feature-title">Instant Transfers</div>
                  <div class="feature-desc">Send money instantly to any account</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">₿</div>
                  <div class="feature-title">Crypto Trading</div>
                  <div class="feature-desc">Buy, sell, and trade cryptocurrencies</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">📊</div>
                  <div class="feature-title">Smart Analytics</div>
                  <div class="feature-desc">Track your spending with AI insights</div>
                </div>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">
                  Go to Your Dashboard
                </a>
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td style="width: 25%; text-align: center; padding: 0 10px;">
                    <a href="${process.env.FRONTEND_URL}/deposit" style="text-decoration: none; color: #1e293b;">
                      <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px; font-size: 20px; line-height: 40px; text-align: center; margin: 0 auto 8px;">💰</div>
                      <div style="font-size: 12px; font-weight: 500;">Deposit</div>
                    </a>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 0 10px;">
                    <a href="${process.env.FRONTEND_URL}/transfer" style="text-decoration: none; color: #1e293b;">
                      <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px; font-size: 20px; line-height: 40px; text-align: center; margin: 0 auto 8px;">↗️</div>
                      <div style="font-size: 12px; font-weight: 500;">Transfer</div>
                    </a>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 0 10px;">
                    <a href="${process.env.FRONTEND_URL}/cards" style="text-decoration: none; color: #1e293b;">
                      <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px; font-size: 20px; line-height: 40px; text-align: center; margin: 0 auto 8px;">💳</div>
                      <div style="font-size: 12px; font-weight: 500;">Get Card</div>
                    </a>
                  </td>
                  <td style="width: 25%; text-align: center; padding: 0 10px;">
                    <a href="${process.env.FRONTEND_URL}/support" style="text-decoration: none; color: #1e293b;">
                      <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px; font-size: 20px; line-height: 40px; text-align: center; margin: 0 auto 8px;">🎧</div>
                      <div style="font-size: 12px; font-weight: 500;">Support</div>
                    </a>
                  </td>
                </tr>
              </table>

              <hr>
              <h3 style="color: #1e293b; margin-bottom: 15px;">✨ Getting Started Tips</h3>
              <ul style="color: #475569; padding-left: 20px;">
                <li style="margin-bottom: 12px;">
                  <strong style="color: #2563eb;">Complete KYC Verification</strong>
                  <span style="display: block; margin-top: 4px; font-size: 14px;">Verify your identity to unlock higher limits and all features</span>
                  <span class="badge kyc" style="margin-top: 8px;">Required</span>
                </li>
                <li style="margin-bottom: 12px;">
                  <strong style="color: #2563eb;">Complete your profile</strong>
                  <span style="display: block; margin-top: 4px; font-size: 14px;">Add your phone number and address for enhanced security</span>
                </li>
                <li style="margin-bottom: 12px;">
                  <strong style="color: #2563eb;">Set up 2FA</strong>
                  <span style="display: block; margin-top: 4px; font-size: 14px;">Enable two-factor authentication for extra protection</span>
                  <span class="badge twofa" style="margin-top: 8px;">Recommended</span>
                </li>
                <li style="margin-bottom: 12px;">
                  <strong style="color: #2563eb;">Save beneficiaries</strong>
                  <span style="display: block; margin-top: 4px; font-size: 14px;">Add frequent transfer recipients for quick access</span>
                </li>
              </ul>

              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin:0 0 10px; font-weight: 600;">📋 Your Verification Status:</p>
                <span class="badge">✅ Email Verified</span>
                <span class="badge">⏳ KYC Pending</span>
                <span class="badge">⏳ 2FA Not Set</span>
              </div>
            </div>

            <div class="footer">
              <div class="help-text">
                <p style="margin:0 0 10px;">
                  Need help? <a href="${process.env.FRONTEND_URL}/support">Visit our Support Center</a>
                </p>
                <p style="margin:0; font-size: 11px; color: #94a3b8;">
                  © ${new Date().getFullYear()} Byvault Finance. All rights reserved.<br>
                  800 Nicollet Mall Minneapolis, MN 55304
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ Welcome email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error?.response?.body || error);
    return false;
  }
};