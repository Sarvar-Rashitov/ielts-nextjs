'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"success" | "pending" | "failed">("success")

  useEffect(() => {
    const paymentStatus = searchParams.get("status")
    if (paymentStatus === "failed") {
      setStatus("failed")
    } else if (paymentStatus === "pending") {
      setStatus("pending")
    }
  }, [searchParams])

  return (
    <div className="bg-white/70 backdrop-blur-xl p-10 rounded-2xl shadow-xl text-center max-w-md w-full border border-white/40">
      {status === "success" && (
        <>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-black mb-3">Payment Successful!</h1>
          <p className="text-gray-500 mb-6">Your subscription has been activated. You now have access to all premium features.</p>
          <button onClick={() => router.push("/dashboard")} className="w-full px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:scale-[1.02] transition-all">
            Go to Dashboard
          </button>
        </>
      )}

      {status === "pending" && (
        <>
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-black mb-3">Payment Processing</h1>
          <p className="text-gray-500 mb-6">Your payment is being processed. You will receive a confirmation shortly.</p>
          <button onClick={() => router.push("/dashboard")} className="w-full px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:scale-[1.02] transition-all">
            Go to Dashboard
          </button>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-black mb-3">Payment Failed</h1>
          <p className="text-gray-500 mb-6">Something went wrong with your payment. Please try again or contact support.</p>
          <button onClick={() => router.push("/payment/choose-version")} className="w-full px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:scale-[1.02] transition-all">
            Try Again
          </button>
        </>
      )}
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
