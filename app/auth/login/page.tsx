'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import {
  AuthShell, Field, ErrorBanner,
  SubmitButton, OrDivider, GoogleButton, TrustRow,
} from "../components"

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return }
    setLoading(true); setError("")

    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (err) { setError("Invalid email or password."); return }
    router.replace("/dashboard")
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <AuthShell
      leftTitle="Welcome back —"
      leftAccent="pick up where you left off"
      leftDesc="Your progress, scores, and study plan are waiting for you."
      showStats
    >
      <h1 className="text-2xl font-extrabold text-gray-950 tracking-[-0.5px] mb-1">
        Sign in to your account
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Continue your IELTS journey
      </p>

      <div className="flex flex-col gap-4" onKeyDown={onKeyDown}>
        <Field
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          disabled={loading}
        />
        <div>
          <Field
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={setPassword}
            disabled={loading}
          />
          <div className="flex justify-end mt-1.5">
            <button
              onClick={() => router.push("/auth/reset")}
              className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>

      <ErrorBanner message={error} />

      <div className="flex flex-col gap-3 mt-5">
        <SubmitButton
          loading={loading}
          label="Sign in →"
          loadingLabel="Signing in…"
          onClick={handleLogin}
        />
        <OrDivider />
        <GoogleButton onClick={handleGoogle} disabled={loading} />
      </div>

      <p className="text-center text-xs text-gray-400 mt-7">
        New to IELTS CDI?{" "}
        <button
          onClick={() => router.push("/auth/register")}
          className="text-red-500 font-semibold hover:underline"
        >
          Create account
        </button>
      </p>

      <div className="mt-4">
        <TrustRow items={["Free to start", "No card needed"]} />
      </div>
    </AuthShell>
  )
}
