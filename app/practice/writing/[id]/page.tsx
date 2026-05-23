'use client'

import { useRouter, useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { supabase } from "../../../lib/supabase"

// File lives at:  app/practice/writing/[id]/page.tsx
// Route example:  /practice/writing/1
//
// ─── HOW TO ADD A NEW WRITING TEST ───────────────────────────────────────────
//  1. Create your test HTML file and name it exactly:
//       /public/tests/writing-test-N.html
//     where N is the test number (1, 2, 3, … 300).
//  2. That's it. No code changes needed. The iframe loads it automatically.
//
//  The test HTML should post a message when complete, e.g.:
//    window.parent.postMessage({ type: "TEST_COMPLETE", score: 32 }, "*")
// ─────────────────────────────────────────────────────────────────────────────

export default function WritingTest() {
  const router = useRouter()
  const params = useParams()

  const testId = Number(params.id)

  const [started, setStarted] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [saving, setSaving] = useState(false)
  const submittedRef = useRef(false)

  // ─── Access check (identical logic to reading) ──────────────────────────────
  useEffect(() => {
    const checkLimit = async () => {
      let localPlan = "free"
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("plan")
        if (stored) localPlan = stored.toLowerCase().trim()
      }

      const getPackageAccess = (testId: number, plan: string) => {
        const normalized = plan.toLowerCase()
        const packageNumber = Math.ceil(testId / 10)
        if (normalized === "free")     return testId <= 1  // free: 1 writing test
        if (normalized === "basic")    return packageNumber === 1
        if (normalized === "premium")  return packageNumber === 1 || packageNumber === 2
        if (normalized === "ultimate") return true
        return false
      }

      if (!getPackageAccess(testId, localPlan)) {
        router.replace("/pricing")
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace("/auth/login")
        return
      }

      setAllowed(true)
      setChecking(false)
    }

    checkLimit()
  }, [router, testId])

  // ─── Listen for TEST_COMPLETE from iframe ───────────────────────────────────
  useEffect(() => {
    if (!started) return

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "TEST_COMPLETE") return

      if (submittedRef.current) return
      submittedRef.current = true

      const score = event.data.score ?? null
      setSaving(true)

      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id

      if (userId) {
        await supabase.from("test_results").upsert(
          {
            user_id: userId,
            test_type: "writing",        // ← "writing"
            test_id: testId,
            score: score,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,test_type,test_id" }
        )
      }

      // Redirect back to the correct set page
      const packageStart = Math.floor((testId - 1) / 10) * 10 + 1
      router.push(`/practice/writing/set/${packageStart}`)
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [started, testId, router])

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Checking access…</p>
        </div>
      </div>
    )
  }

  if (!allowed) return null

  // ─── Saving overlay ─────────────────────────────────────────────────────────
  if (saving) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">Saving your result…</p>
          <p className="text-sm text-gray-500">You'll be redirected in a moment.</p>
        </div>
      </div>
    )
  }

  // ─── Instructions screen ────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-2xl w-full">

          <h1 className="text-xl font-bold text-black mb-4">IELTS Writing</h1>
          <p className="mb-4 text-black">Time: 60 minutes</p>

          <h2 className="font-bold text-black mt-6 mb-2">INSTRUCTIONS TO CANDIDATES</h2>
          <ul className="list-disc ml-5 mb-4 text-black">
            <li>Answer both Task 1 and Task 2.</li>
            <li>Write at least 150 words for Task 1 and at least 250 words for Task 2.</li>
            <li>You can change your answers at any time during the test.</li>
          </ul>

          <h2 className="font-bold text-black mt-6 mb-2">INFORMATION FOR CANDIDATES</h2>
          <ul className="list-disc ml-5 mb-6 text-black">
            <li>Task 2 carries more marks than Task 1.</li>
            <li>Write your answers in the answer boxes provided.</li>
            <li>The test clock will show you when there are 10 and 5 minutes remaining.</li>
          </ul>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setStarted(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Start Test
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ─── Test iframe ─────────────────────────────────────────────────────────────
  // Loads /public/tests/writing-test-{testId}.html
  return (
    <div className="w-screen h-screen flex flex-col bg-black overflow-hidden">
      <iframe
        src={`/tests/writing-test-${testId}.html`}
        className="w-full h-full border-0"
      />
    </div>
  )
}
