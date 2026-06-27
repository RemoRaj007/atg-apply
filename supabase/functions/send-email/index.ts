import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM = 'ATG Apply <noreply@atgapply.com>'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type TemplateData = Record<string, string>

const templates: Record<string, (d: TemplateData) => { subject: string; html: string }> = {
  welcome: (d) => ({
    subject: 'Welcome to ATG Apply!',
    html: `<p>Hi ${d.name},</p><p>Welcome to ATG Apply! Your profile is set up and your dedicated ATG team will start curating job opportunities for you shortly.</p><p>Log in any time to review and approve recommended jobs.</p><p>Best,<br>The ATG Apply Team</p>`,
  }),

  job_recommended: (d) => ({
    subject: `New job match: ${d.title} at ${d.company}`,
    html: `<p>Hi ${d.name},</p><p>We found a great match for you: <strong>${d.title}</strong> at <strong>${d.company}</strong> (${d.location || 'Remote'}).</p><p>Log in to approve or decline this opportunity before the deadline${d.deadline ? ` (${d.deadline})` : ''}.</p><p>Best,<br>The ATG Apply Team</p>`,
  }),

  application_submitted: (d) => ({
    subject: `Application submitted: ${d.title}`,
    html: `<p>Hi ${d.name},</p><p>Your application for <strong>${d.title}</strong> at <strong>${d.company}</strong> has been submitted successfully.</p><p>We'll keep you updated on the status. You can track all applications in your dashboard.</p><p>Best,<br>The ATG Apply Team</p>`,
  }),

  support_reply: (d) => ({
    subject: 'New message from your ATG team',
    html: `<p>Hi ${d.name},</p><p>Your ATG team has replied to your support message:</p><blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">${d.message}</blockquote><p>Log in to continue the conversation.</p><p>Best,<br>The ATG Apply Team</p>`,
  }),

  upgrade_prompt: (d) => ({
    subject: 'Your applications are running low',
    html: `<p>Hi ${d.name},</p><p>You have only <strong>${d.remaining}</strong> application${d.remaining === '1' ? '' : 's'} remaining on your current plan.</p><p>Upgrade now to keep the momentum going — your ATG team is ready to do more!</p><p>Best,<br>The ATG Apply Team</p>`,
  }),
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const { to, type, data = {} } = await req.json()

    if (!to || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, type' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const builder = templates[type]
    if (!builder) {
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY secret not configured' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const { subject, html } = builder(data)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })

    const body = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: body.message ?? 'Resend API error' }), {
        status: res.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ id: body.id }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
