import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Email to support team
    await sgMail.send({
      from: { email: process.env.EMAIL_FROM, name: "Byvault Contact Form" },
      to: process.env.EMAIL_FROM,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 100px;">Name:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    // Auto-reply to user
    await sgMail.send({
      from: { email: process.env.EMAIL_FROM, name: "Byvault Finance Support" },
      to: email,
      subject: "Thank you for contacting Byvault Finance",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2563eb;">Thank you for reaching out, ${name}!</h2>
          <p>We have received your message and will get back to you within <strong>24-48 hours</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your message:</h3>
            <p style="margin-bottom: 0; color: #4b5563;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 14px;">
            <strong>Need immediate assistance?</strong><br>
            Call us at: <a href="tel:+14696961911" style="color: #2563eb;">+1-469-696-1911</a>
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: "Message sent successfully! We'll get back to you soon." });

  } catch (error) {
    console.error("Contact form error:", error?.response?.body || error);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
  }
};