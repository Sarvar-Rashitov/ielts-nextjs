'use client'

import { useRouter } from "next/navigation"

export default function ChoosePaymentVersion() {

const router = useRouter()

const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@ieltscdi.com"
const message = "Hello, I would like a subscription on your platform. I have payment issues, could you solve this for me?"

return (

<div className="min-h-screen bg-gray-100 flex items-center justify-center">

<div className="bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-white/40">

<h1 className="text-3xl font-extrabold text-black mb-3">
Choose your payment version
</h1>

<p className="text-gray-500 mb-4">
Select the method that suits you best
</p>

{/* TRUST WORDS */}
<p className="text-sm text-gray-400 mb-8">
Cancel anytime • Secure payment • Instant access • No hidden fees
</p>

<div className="flex flex-col gap-4">

<button
onClick={() => {
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Subscription Request&body=Hello, I would like to get a plan by paying via Payoneer`
  }}
className="w-full px-6 py-4 rounded-xl font-bold text-white 
bg-gradient-to-r from-black/90 via-gray-900/90 to-black/80
backdrop-blur-xl border border-white/10
shadow-lg shadow-black/20
transition-all duration-300 
hover:scale-[1.04] hover:shadow-2xl hover:shadow-black/30
active:scale-[0.97]"
>
Pay By Payoneer
</button>

<button
onClick={() => router.push("/payment/payme")}
className="w-full px-6 py-4 rounded-xl font-bold text-white 
bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-blue-600/90
backdrop-blur-xl border border-white/20
shadow-lg shadow-blue-500/20
transition-all duration-300 
hover:scale-[1.04] hover:shadow-2xl hover:shadow-blue-500/30
active:scale-[0.97]"
>
Payme
</button>

</div>

{/* SUPPORT OPTIONS */}
<div className="mt-8 space-y-3">

<button
onClick={() => window.open(
`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Subscription Request&body=${encodeURIComponent(message)}`,
"_blank"
)}
className="w-full text-sm text-black underline hover:opacity-70"
>
Or send an e-mail
</button>

<button
onClick={() => window.open(`https://t.me/jasurbeksielts?text=${encodeURIComponent(message)}`, "_blank")}
className="w-full text-sm text-blue-600 underline hover:opacity-70"
>
Or contact on Telegram
</button>

</div>

</div>

</div>

)
}