import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple in-memory store just to prevent duplicate subs in the same serverless instance
// For real dedup, use a DB like Supabase or PlanetScale
const subscribed = new Set()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  if (subscribed.has(email.toLowerCase())) {
    return res.status(200).json({ message: 'Already registered.' })
  }

  try {
    // Send confirmation email to the subscriber
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: email,
      subject: '🫘 You\'re registered. Stay vigilant.',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="background:#050508; color:#f0f0f0; font-family:'Helvetica Neue',sans-serif; margin:0; padding:40px 20px;">
            <div style="max-width:480px; margin:0 auto; border:1px solid rgba(255,255,255,0.1); border-top:3px solid #e8ff47; padding:40px 32px; background:#0d0d15;">
              <p style="font-size:11px; letter-spacing:0.2em; color:#e8ff47; margin:0 0 24px;">⚠ OPERATION: STOP THE BEANS</p>
              <h1 style="font-size:36px; font-weight:900; letter-spacing:0.04em; margin:0 0 16px; text-transform:uppercase;">You're registered.<br/>Stay vigilant.</h1>
              <p style="color:rgba(240,240,240,0.55); line-height:1.7; margin:0 0 24px; font-size:15px;">
                You've taken the first step. When our beta drops, you'll be the first to know — and the first to stop it.
              </p>
              <p style="color:rgba(240,240,240,0.55); line-height:1.7; margin:0 0 32px; font-size:15px;">
                Until then: watch your canned goods.
              </p>
              <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:24px;">
                <p style="font-size:11px; color:rgba(240,240,240,0.2); letter-spacing:0.1em; margin:0;">CLEARANCE LEVEL: LEGUME · THREAT LEVEL: ACTIVE</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    // Notify yourself about the new signup
    if (process.env.NOTIFY_EMAIL) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        to: process.env.NOTIFY_EMAIL,
        subject: `🫘 New signup: ${email}`,
        html: `<p>New email registered: <strong>${email}</strong></p>`,
      })
    }

    subscribed.add(email.toLowerCase())
    return res.status(200).json({ message: 'Subscribed successfully.' })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to subscribe. Please try again.' })
  }
}
