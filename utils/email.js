const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Send a transactional email.
 * @param {Object} opts - { to, subject, html, text }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const message = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    text: text || html?.replace(/<[^>]*>/g, ''),
  }

  const info = await transporter.sendMail(message)
  console.log(`📧 Email sent to ${to}: ${info.messageId}`)
  return info
}

/**
 * Contact form notification to admin.
 */
const sendContactNotification = async ({ firstName, lastName, email, subject, message }) => {
  return sendEmail({
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `[Portfolio] New contact: ${subject}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #121212; color: #F5F1EA; padding: 40px; border-radius: 4px;">
        <div style="border-bottom: 2px solid #0f4c5c; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="color: #C9B79C; margin: 0; font-weight: 300; font-size: 1.5rem;">New Contact Message</h2>
        </div>
        <p><strong style="color: #C9B79C;">From:</strong> ${firstName} ${lastName} (${email})</p>
        <p><strong style="color: #C9B79C;">Subject:</strong> ${subject}</p>
        <div style="background: rgba(15,76,92,0.2); border-left: 3px solid #0f4c5c; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #B8C2C7; line-height: 1.8;">${message}</p>
        </div>
        <a href="mailto:${email}" style="display: inline-block; background: #0f4c5c; color: #F5F1EA; padding: 12px 24px; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 10px;">Reply to ${firstName}</a>
      </div>
    `,
  })
}

/**
 * Auto-reply to contact form submitter.
 */
const sendContactAutoReply = async ({ firstName, email }) => {
  return sendEmail({
    to: email,
    subject: "Thanks for reaching out — Mixzy",
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #121212; color: #F5F1EA; padding: 40px; border-radius: 4px;">
        <div style="border-bottom: 2px solid #C9B79C; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="color: #C9B79C; margin: 0; font-weight: 300;">Hello ${firstName},</h2>
        </div>
        <p style="color: #B8C2C7; line-height: 1.8;">Thank you for getting in touch! I've received your message and will respond within 24 hours.</p>
        <p style="color: #B8C2C7; line-height: 1.8;">In the meantime, feel free to explore my <a href="${process.env.FRONTEND_URL}/projects" style="color: #C9B79C;">portfolio</a> or connect with me on <a href="https://linkedin.com" style="color: #C9B79C;">LinkedIn</a>.</p>
        <p style="color: #7A8A91; font-size: 0.85rem; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px;">
          Mixzy · Full Stack Developer · ${process.env.FRONTEND_URL}
        </p>
      </div>
    `,
  })
}

/**
 * Admin reply to a contact message.
 */
const sendContactReply = async ({ to, firstName, subject, originalMessage, reply }) => {
  return sendEmail({
    to,
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #121212; color: #F5F1EA; padding: 40px; border-radius: 4px;">
        <div style="border-bottom: 2px solid #C9B79C; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="color: #C9B79C; margin: 0; font-weight: 300;">Hello ${firstName},</h2>
        </div>
        <p style="color: #B8C2C7; line-height: 1.8;">Thank you for contacting Mixzy. Here is my reply regarding <strong style="color: #C9B79C;">${subject}</strong>:</p>
        <div style="background: rgba(15,76,92,0.2); border-left: 3px solid #0f4c5c; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; color: #F5F1EA; line-height: 1.8; white-space: pre-wrap;">${reply}</p>
        </div>
        <p style="color: #7A8A91; font-size: 0.8rem; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          Your original message:<br/>
          <span style="color: #B8C2C7;">${originalMessage}</span>
        </p>
        <p style="color: #7A8A91; font-size: 0.85rem; margin-top: 24px;">
          Mixzy · Full Stack Developer · ${process.env.FRONTEND_URL || ''}
        </p>
      </div>
    `,
  })
}

module.exports = { sendEmail, sendContactNotification, sendContactAutoReply, sendContactReply }
