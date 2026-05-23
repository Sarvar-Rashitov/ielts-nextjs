'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import { AuthShell, Field, ErrorBanner } from "../components"

export default function ResetPage() {
  const router  = useRouter()
  const [email,   setEmail]   = useState("")
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleReset = async () => {
    if (!email) { setError("Please enter your email address."); return }
    setLoading(true); setError("")

    // ✅ Same safe origin logic — hardcode port 3000 for localhost
    const { hostname, protocol } = window.location
    const origin = hostname === "localhost"
      ? "http://localhost:3000"
      : `${protocol}//${hostname}`

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/update-password`,
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <AuthShell
      leftTitle="Reset your"
      leftAccent="password"
      leftDesc="Enter your email and we'll send you a secure link to get back in."
      showStats={false}
    >
      {sent ? (
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-2xl">
            ✉️
          </div>
          <h2 className="text-xl font-extrabold text-gray-950 tracking-tight">
            Check your inbox
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[260px]">
            We sent a reset link to{" "}
            <span className="font-semibold text-gray-800">{email}</span>.
            Check your inbox or spam folder.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 w-full py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-[-0.5px] mb-1">
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            No worries — we'll email you a reset link.
          </p>

          <div className="flex flex-col gap-4">
            <Field
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              disabled={loading}
            />
          </div>

          <ErrorBanner message={error} />

          <button
            onClick={handleReset}
            disabled={loading}
            className="mt-5 w-full py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-900/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Sending…
              </span>
            ) : "Send reset link →"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-7">
            Remember your password?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-red-500 font-semibold hover:underline"
            >
              Back to sign in
            </button>
          </p>
        </>
      )}
    </AuthShell>
  )
}
