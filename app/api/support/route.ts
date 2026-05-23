import { Resend } from 'resend'

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@ieltscdi.com'

export async function POST(req: Request) {

const { email, message } = await req.json()

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not set — support email not sent")
  return Response.json({ success: true })
}

const resend = new Resend(process.env.RESEND_API_KEY)

try {

await resend.emails.send({
from: 'Support <onboarding@resend.dev>',
to: SUPPORT_EMAIL,
subject: 'New Support Query',
html: `
<h2>New message from platform</h2>
<p><strong>User Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message}</p>
`
})

await resend.emails.send({
from: 'IELTS Platform <onboarding@resend.dev>',
to: email,
subject: 'Your query has been received',
html: `
<p>Your query has been submitted successfully.</p>

<p>Please wait for our response in 2–3 hours.  
It might also take longer, but we will try to respond as soon as possible.</p>
`
})

return Response.json({ success: true })

}
catch(error){

return Response.json({ success:false })

}

}