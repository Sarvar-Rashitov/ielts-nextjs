'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import {
  AuthShell, Field, ErrorBanner,
  SubmitButton, OrDivider, GoogleButton, TrustRow,
} from "../components"

export default function RegisterPage() {
  const router = useRouter()
  const [name,     setName]     = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleSignup = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return }
    if (password.length < 8)          { setError("Password must be at least 8 characters."); return }

    setLoading(true); setError("")

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    setLoading(false)

    if (err)          { setError(err.message); return }
    if (data.session) { router.replace("/dashboard"); return }

    router.replace("/auth/login")
  }

  const handleGoogle = async () => {
    // ✅ Explicitly hardcode localhost:3000 for local dev.
    // For production, use the real hostname without any port.
    const { hostname, protocol } = window.location
    const origin = hostname === "localhost"
      ? "http://localhost:3000"
      : `${protocol}//${hostname}`

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
        queryParams: { prompt: "select_account" },
      },
    })
  }

  return (
    <AuthShell
      leftTitle="Your IELTS score,"
      leftAccent="faster than ever"
      leftDesc="Real exam simulations, AI feedback, and smart progress tracking — all in one place."
      showStats
    >
      <h1 className="text-2xl font-extrabold text-gray-950 tracking-[-0.5px] mb-1">
        Create your account
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Start improving your score in 30 seconds
      </p>

      <div className="flex flex-col gap-4">
        <Field
          label="Full name"
          type="text"
          placeholder="Jasurbek Abdullayev"
          value={name}
          onChange={setName}
          disabled={loading}
        />
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          disabled={loading}
        />
        <Field
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={setPassword}
          disabled={loading}
          hint="At least 8 characters"
        />
      </div>

      <ErrorBanner message={error} />

      <div className="flex flex-col gap-3 mt-5">
        <SubmitButton
          loading={loading}
          label="Create account →"
          loadingLabel="Creating account…"
          onClick={handleSignup}
        />
        <OrDivider />
        <GoogleButton onClick={handleGoogle} disabled={loading} />
      </div>

      <p className="text-center text-xs text-gray-400 mt-7">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/auth/login")}
          className="text-red-500 font-semibold hover:underline"
        >
          Sign in
        </button>
      </p>

      <div className="mt-4">
        <TrustRow items={["Free to start", "No card needed", "Cancel anytime"]} />
      </div>
    </AuthShell>
  )
}
