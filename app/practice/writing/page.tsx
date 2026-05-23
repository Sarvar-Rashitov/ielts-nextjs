'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

// ─── Same package/set structure as reading ───────────────────────────────────
// 10 sets × 3 packages × 10 tests = 300 writing tests total
// Test HTML files: /tests/writing-test-1.html … /tests/writing-test-300.html

const generateSets = () => {
  const sets = []
  let testNumber = 1
  for (let s = 1; s <= 10; s++) {
    const packs = []
    for (let p = 1; p <= 3; p++) {
      packs.push({
        name: `Package ${(s - 1) * 3 + p}`,
        range: [testNumber, testNumber + 9] as [number, number],
      })
      testNumber += 10
    }
    sets.push({ name: `Set ${s}`, packs })
  }
  return sets
}

const sets = generateSets()

// ─── Access logic — identical to reading ─────────────────────────────────────
const isUnlocked = (plan: string, setName: string, packName: string, range: [number, number]) => {
  const p = plan.toLowerCase()
  if (p === "free") return range[0] <= 1  // free: 1 writing test
  if (p === "basic") return setName === "Set 1" && packName === "Package 1"
  if (p === "premium")
    return setName === "Set 1" && (packName === "Package 1" || packName === "Package 2")
  if (p === "ultimate") return true
  return false
}

export default function WritingPractice() {
  const router = useRouter()

  const [subscription, setSubscription] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("plan") || "free"
    }
    return "free"
  })

  const [packageProgress, setPackageProgress] = useState<Record<number, number>>({})

  useEffect(() => {
    const init = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("email", authData.user.email)
        .single()

      if (profile) {
        setSubscription(profile.plan)
        localStorage.setItem("plan", profile.plan)
      }

      const { data: results } = await supabase
        .from("test_results")
        .select("test_id")
        .eq("user_id", authData.user.id)
        .eq("test_type", "writing")   // ← "writing" instead of "reading"

      if (results) {
        const progress: Record<number, number> = {}
        results.forEach(({ test_id }) => {
          const packageStart = Math.floor((test_id - 1) / 10) * 10 + 1
          progress[packageStart] = (progress[packageStart] || 0) + 1
        })
        setPackageProgress(progress)
      }
    }

    init()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="mb-8">
        <h1 className="text-2xl font-medium text-gray-900">Writing tests</h1>
        <p className="text-sm text-gray-500 mt-1">30 packages · 300 tests total</p>
      </div>

      {sets.map((set, i) => (
        <div key={i} className="mb-10">

          <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
            {set.name}
          </p>

          <div className="grid grid-cols-3 gap-3">
            {set.packs.map((pack, j) => {
              const unlocked = isUnlocked(subscription, set.name, pack.name, pack.range)
              const locked = !unlocked
              const done = packageProgress[pack.range[0]] || 0
              const total = 10
              const pct = Math.round((done / total) * 100)

              return (
                <div
                  key={j}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:border-gray-200 transition"
                  style={{ opacity: locked ? 0.85 : 1 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{pack.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tests {pack.range[0]} – {pack.range[1]}
                      </p>
                    </div>
                    {locked && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                        Pro
                      </span>
                    )}
                  </div>

                  {!locked && (
                    <div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-1 bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{done} / {total} done</p>
                    </div>
                  )}

                  <div className="flex justify-end mt-auto">
                    {locked ? (
                      <button
                        onClick={() => router.push("/pricing")}
                        className="text-xs font-medium px-4 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                      >
                        Unlock
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(`/practice/writing/set/${pack.range[0]}`)
                        }
                        className="text-xs font-medium px-4 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                      >
                        {done === total ? "Review" : done > 0 ? "Continue" : "Open"}
                      </button>
                    )}
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      ))}

    </div>
  )
}
