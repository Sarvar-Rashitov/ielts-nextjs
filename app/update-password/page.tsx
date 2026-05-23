'use client'

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm,  setConfirm]  = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [success,  setSuccess]  = useState(false)
  const [ready,    setReady]    = useState(false) // ✅ wait for session to be established

  useEffect(() => {
    // ✅ Supabase puts the recovery token in the URL hash.
    // onAuthStateChange detects the PASSWORD_RECOVERY event and
    // sets the session automatically — we just need to wait for it.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true)
      }
      // Also handle if they arrive already having exchanged the code
      // via the server-side callback route
      if (event === "SIGNED_IN" && session) {
        setReady(true)
      }
    })

    // Check if there's already an active session (server-side callback path)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUpdate = async () => {
    if (!password || !confirm) { setError("Please fill in all fields"); return }
    if (password.length < 8)   { setError("Password must be at least 8 characters"); return }
    if (password !== confirm)   { setError("Passwords do not match"); return }

    setLoading(true)
    setError("")

    const { error } = await supabase.auth.updateUser({ password })

    if (error) { setError(error.message); setLoading(false); return }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push("/auth/login"), 2000)
  }

  // ✅ Show a loading state while waiting for the recovery session
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-[420px] text-center">
          <p className="text-gray-500 text-sm">Verifying your reset link…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-[420px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create New Password
        </h1>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">
              ✅ Your password has been successfully updated!
            </p>
            <p className="text-gray-600 text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
