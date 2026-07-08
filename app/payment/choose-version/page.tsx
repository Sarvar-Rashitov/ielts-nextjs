'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

type PlanType = "basic" | "premium" | "ultimate"
type DurationType = "monthly" | "2" | "3" | "5"

const PLAN_PRICES: Record<DurationType, Record<PlanType, { usd: number; som: number }>> = {
  monthly: {
    basic: { usd: 900, som: 98000 },
    premium: { usd: 1900, som: 118000 },
    ultimate: { usd: 2900, som: 228000 },
  },
  "2": {
    basic: { usd: 1500, som: 163000 },
    premium: { usd: 3500, som: 220000 },
    ultimate: { usd: 5400, som: 424000 },
  },
  "3": {
    basic: { usd: 2300, som: 250000 },
    premium: { usd: 5300, som: 329000 },
    ultimate: { usd: 8300, som: 650000 },
  },
  "5": {
    basic: { usd: 4000, som: 436000 },
    premium: { usd: 8000, som: 496000 },
    ultimate: { usd: 12500, som: 991000 },
  },
}

export default function ChoosePaymentVersion() {

const router = useRouter()
const [selectedPlan, setSelectedPlan] = useState<PlanType>("premium")
const [selectedDuration, setSelectedDuration] = useState<DurationType>("monthly")
const [loading, setLoading] = useState(false)

const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@ieltscdi.com"
const message = "Hello, I would like a subscription on your platform. I have payment issues, could you solve this for me?"

const handlePayment = async (provider: "click" | "payme" | "payoneer") => {
  if (provider === "payoneer") {
    window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Subscription Request&body=Hello, I would like to get a plan by paying via Payoneer`
    return
  }
  
  setLoading(true)
  try {
    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: selectedPlan,
        duration: selectedDuration,
        provider,
        amount: PLAN_PRICES[selectedDuration][selectedPlan].som,
      }),
    })
    const data = await res.json()
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl
    }
  } catch {
    console.error("Payment error")
  } finally {
    setLoading(false)
  }
}

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
<p className="text-sm text-gray-400 mb-6">
Cancel anytime • Secure payment • Instant access • No hidden fees
</p>

{/* Plan Selection */}
<div className="mb-6">
  <label className="text-xs font-semibold text-gray-500 mb-2 block">Plan</label>
  <div className="flex gap-2">
    {(["basic", "premium", "ultimate"] as PlanType[]).map((p) => (
      <button
        key={p}
        onClick={() => setSelectedPlan(p)}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
          selectedPlan === p
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {p.charAt(0).toUpperCase() + p.slice(1)}
      </button>
    ))}
  </div>
</div>

{/* Duration Selection */}
<div className="mb-6">
  <label className="text-xs font-semibold text-gray-500 mb-2 block">Duration</label>
  <div className="flex gap-2 flex-wrap">
    {(["monthly", "2", "3", "5"] as DurationType[]).map((d) => (
      <button
        key={d}
        onClick={() => setSelectedDuration(d)}
        className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
          selectedDuration === d
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {d === "monthly" ? "1 Mo" : `${d} Mo`}
      </button>
    ))}
  </div>
</div>

{/* Price Display */}
<div className="mb-6 p-3 bg-gray-50 rounded-lg">
  <div className="text-2xl font-bold text-gray-900">
    {(PLAN_PRICES[selectedDuration][selectedPlan].som / 1000).toFixed(0)},000 so'm
  </div>
  <div className="text-xs text-gray-400">
    ${PLAN_PRICES[selectedDuration][selectedPlan].usd / 100}
  </div>
</div>

<div className="flex flex-col gap-4">

<button
onClick={() => handlePayment("click")}
disabled={loading}
className="w-full px-6 py-4 rounded-xl font-bold text-white 
bg-gradient-to-r from-yellow-500/90 via-yellow-400/90 to-yellow-500/90
backdrop-blur-xl border border-white/20
shadow-lg shadow-yellow-500/20
transition-all duration-300 
hover:scale-[1.04] hover:shadow-2xl hover:shadow-yellow-500/30
active:scale-[0.97]
disabled:opacity-50 disabled:cursor-not-allowed"
>
{loading ? "Loading..." : "Click.uz"}
</button>

<button
onClick={() => handlePayment("payoneer")}
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
onClick={() => handlePayment("payme")}
disabled={loading}
className="w-full px-6 py-4 rounded-xl font-bold text-white 
bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-blue-600/90
backdrop-blur-xl border border-white/20
shadow-lg shadow-blue-500/20
transition-all duration-300 
hover:scale-[1.04] hover:shadow-2xl hover:shadow-blue-500/30
active:scale-[0.97]
disabled:opacity-50 disabled:cursor-not-allowed"
>
{loading ? "Loading..." : "Payme"}
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