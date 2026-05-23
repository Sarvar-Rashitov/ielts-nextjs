'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = "7d" | "30d" | "90d" | "all"

type TestResult = {
  id: string
  test_type: string
  test_id: number
  score: number | null
  completed_at: string
}

type Stats = {
  tests: number
  avgBand: number
  accuracy: number
  studyHours: number
  prevTests: number
  prevAvgBand: number
  prevAccuracy: number
}

type SkillStat = {
  label: string
  pct: number
  count: number
  color: string
  icon: string
  bg: string
}

type MonthBand = {
  month: string
  band: number
}

type StreakData = {
  current: number
  best: number
  totalDays: number
  grid: ("done" | "partial" | "empty")[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SKILL_META: Record<string, { color: string; icon: string; bg: string }> = {
  reading:   { color: "#3b82f6", icon: "📖", bg: "#eff6ff" },
  listening: { color: "#f97316", icon: "🎧", bg: "#fff7ed" },
  writing:   { color: "#a855f7", icon: "✍️", bg: "#faf5ff" },
  speaking:  { color: "#22c55e", icon: "🎤", bg: "#f0fdf4" },
}

const SCORE_TO_BAND = (score: number): number => {
  if (score >= 39) return 9.0
  if (score >= 37) return 8.5
  if (score >= 35) return 8.0
  if (score >= 33) return 7.5
  if (score >= 30) return 7.0
  if (score >= 27) return 6.5
  if (score >= 23) return 6.0
  if (score >= 19) return 5.5
  if (score >= 15) return 5.0
  return 4.5
}

const filterByPeriod = (results: TestResult[], period: Period): TestResult[] => {
  if (period === "all") return results
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return results.filter(r => new Date(r.completed_at) >= cutoff)
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return `Today, ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
  if (diff === 1) return "Yesterday"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const getBandColor = (band: number): string => {
  if (band >= 7.0) return "#22c55e"
  if (band >= 6.0) return "#ef4444"
  return "#f97316"
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MetricCard({
  label, value, trend, valueColor = "#111"
}: {
  label: string
  value: string | number
  trend: React.ReactNode
  valueColor?: string
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-red-100 hover:shadow-md hover:shadow-red-50/30 transition-all duration-200">
      <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-2">{label}</div>
      <div className="text-[26px] font-extrabold tracking-tight leading-none" style={{ color: valueColor }}>{value}</div>
      <div className="text-[11px] text-gray-400 mt-1.5">{trend}</div>
    </div>
  )
}

function SkillBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[12px] font-semibold text-gray-500 w-16">{label}</div>
      <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-[11px] font-bold text-gray-700 w-8 text-right">{pct}%</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProgressPage() {
  const router = useRouter()

  const [period, setPeriod] = useState<Period>("30d")
  const [allResults, setAllResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) { router.replace("/auth/login"); return }

      const user = session.session.user
      setEmail(user.email ?? "")

      const { data } = await supabase
        .from("test_results")
        .select("id, test_type, test_id, score, completed_at")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })

      setAllResults(data ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  // ── Derived data ────────────────────────────────────────────────────────────
  const results = filterByPeriod(allResults, period)

  const prevCutoff = (() => {
    if (period === "all") return null
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const start = new Date(); start.setDate(start.getDate() - days * 2)
    const end   = new Date(); end.setDate(end.getDate() - days)
    return allResults.filter(r => {
      const d = new Date(r.completed_at)
      return d >= start && d < end
    })
  })()

  const withScore = results.filter(r => r.score !== null)
  const prevWithScore = prevCutoff?.filter(r => r.score !== null) ?? []

  const avgBand = withScore.length
    ? Number((withScore.reduce((a, b) => a + SCORE_TO_BAND(b.score!), 0) / withScore.length).toFixed(1))
    : 0
  const prevAvgBand = prevWithScore.length
    ? Number((prevWithScore.reduce((a, b) => a + SCORE_TO_BAND(b.score!), 0) / prevWithScore.length).toFixed(1))
    : 0

  const accuracy = withScore.length
    ? Math.round(withScore.reduce((a, b) => a + (b.score! / 40) * 100, 0) / withScore.length)
    : 0
  const prevAccuracy = prevWithScore.length
    ? Math.round(prevWithScore.reduce((a, b) => a + (b.score! / 40) * 100, 0) / prevWithScore.length)
    : 0

  // Study hours: estimate 45 min per test
  const studyHours = Math.round((results.length * 45) / 60)

  // Skill stats
  const skillStats: SkillStat[] = ["reading", "listening", "writing", "speaking"].map(skill => {
    const skillResults = withScore.filter(r => r.test_type === skill)
    const pct = skillResults.length
      ? Math.round(skillResults.reduce((a, b) => a + (b.score! / 40) * 100, 0) / skillResults.length)
      : 0
    return { label: skill.charAt(0).toUpperCase() + skill.slice(1), pct, count: skillResults.length, ...SKILL_META[skill] }
  })

  const weakest = [...skillStats].filter(s => s.count > 0).sort((a, b) => a.pct - b.pct)[0]

  // Monthly band chart (last 6 months)
  const monthBands: MonthBand[] = (() => {
    const months: MonthBand[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const label = d.toLocaleString("en-US", { month: "short" })
      const monthResults = allResults.filter(r => {
        const rd = new Date(r.completed_at)
        return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear() && r.score !== null
      })
      const band = monthResults.length
        ? Number((monthResults.reduce((a, b) => a + SCORE_TO_BAND(b.score!), 0) / monthResults.length).toFixed(1))
        : 0
      months.push({ month: label, band })
    }
    return months
  })()

  const maxBand = Math.max(...monthBands.map(m => m.band), 6)

  // Recent tests (last 5)
  const recentTests = [...allResults]
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    .slice(0, 5)

  // Streak
  const streakData: StreakData = (() => {
    const days = new Set(
      allResults.map(r => new Date(r.completed_at).toDateString())
    )
    let current = 0
    let best = 0
    let streak = 0
    const today = new Date()

    for (let i = 0; i < 90; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      if (days.has(d.toDateString())) {
        streak++
        if (i === 0 || streak > 1) current = streak
        best = Math.max(best, streak)
      } else {
        if (i === 0) current = 0
        streak = 0
      }
    }

    // Build 21-day grid
    const grid: ("done" | "partial" | "empty")[] = []
    for (let i = 20; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      grid.push(days.has(d.toDateString()) ? "done" : "empty")
    }

    return { current, best, totalDays: days.size, grid }
  })()

  const diff = (curr: number, prev: number, suffix = "") => {
    if (!prev) return <span className="text-gray-300">No prev data</span>
    const d = curr - prev
    const sign = d >= 0 ? "+" : ""
    return <span className={d >= 0 ? "font-bold text-green-500" : "font-bold text-red-400"}>{sign}{d.toFixed(suffix ? 1 : 0)}{suffix}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Loading your progress…</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen bg-[#f8f8f6] text-gray-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-5 px-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-[30px] h-[30px] bg-red-500 rounded-lg flex items-center justify-center text-sm">🎓</div>
          <span className="text-[15px] font-extrabold tracking-tight">
            IELTS <span className="text-red-500">CDI</span>
          </span>
        </div>

        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-300 px-2 mb-1">Main</p>
        {[
          ["Dashboard",   "/"],
          ["My Progress", "/progress"],
          ["Mock Tests",  "/mock"],
        ].map(([label, href]) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all text-left mb-0.5
              ${href === "/progress"
                ? "bg-red-50 text-red-500 font-semibold"
                : "text-gray-400 hover:bg-red-50 hover:text-red-500"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${href === "/progress" ? "bg-red-500" : "bg-current opacity-40"}`} />
            {label}
          </button>
        ))}

        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-300 px-2 mt-4 mb-1">Practice</p>
        {[
          ["Reading",   "/practice/reading"],
          ["Listening", "/practice/listening"],
          ["Writing",   "/practice/writing"],
          ["Speaking",  "/practice/speaking"],
        ].map(([label, href]) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all text-left mb-0.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
            {label}
          </button>
        ))}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {email[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="text-left min-w-0">
              <div className="text-[12px] font-semibold text-gray-800 truncate">{email.split("@")[0]}</div>
              <div className="text-[10px] text-gray-400 truncate">{email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-7 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[15px] font-bold text-gray-900">My progress</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Track your improvement over time</p>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["7d", "30d", "90d", "all"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                  period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-7 overflow-y-auto">

          {/* ── METRICS ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <MetricCard
              label="Tests taken"
              value={results.length}
              trend={prevCutoff ? <>{diff(results.length, prevCutoff.length)} vs prev period</> : "All time"}
            />
            <MetricCard
              label="Avg band score"
              value={avgBand || "—"}
              valueColor="#ef4444"
              trend={prevCutoff && prevAvgBand ? <>{diff(avgBand, prevAvgBand, "")} band improvement</> : "All time avg"}
            />
            <MetricCard
              label="Accuracy"
              value={accuracy ? `${accuracy}%` : "—"}
              valueColor="#22c55e"
              trend={prevCutoff && prevAccuracy ? <>{diff(accuracy, prevAccuracy)}% from prev period</> : "All time avg"}
            />
            <MetricCard
              label="Study hours"
              value={`${studyHours}h`}
              valueColor="#3b82f6"
              trend={<>Avg <span className="font-bold text-gray-600">{results.length ? Math.round((studyHours * 60) / results.length) : 0} min</span> per test</>}
            />
          </div>

          {/* ── BAND CHART + SKILLS ───────────────────────────────────────── */}
          <div className="grid grid-cols-[1fr_300px] gap-4 mb-4">

            {/* Band chart */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-4">Band score over time</div>
              {monthBands.every(m => m.band === 0) ? (
                <div className="flex items-center justify-center h-36 text-gray-300 text-sm">
                  No data yet — complete some tests first
                </div>
              ) : (
                <>
                  <div className="flex items-flex-end gap-2 h-36">
                    {monthBands.map((m, i) => {
                      const heightPct = m.band ? Math.max((m.band / 9) * 100, 8) : 0
                      const intensity = i / (monthBands.length - 1)
                      const r = Math.round(252 + (220 - 252) * intensity)
                      const g = Math.round(165 + (38 - 165) * intensity)
                      const b = Math.round(165 + (38 - 165) * intensity)
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-bold text-gray-500">{m.band || "—"}</span>
                          <div className="w-full bg-gray-50 rounded-lg overflow-hidden" style={{ height: "100px" }}>
                            <div
                              className="w-full rounded-lg transition-all duration-700"
                              style={{
                                height: `${heightPct}%`,
                                marginTop: `${100 - heightPct}%`,
                                background: m.band ? `rgb(${r},${g},${b})` : "transparent"
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-300 font-medium">{m.month}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-[2px] flex-1 rounded-full" style={{ background: "linear-gradient(90deg, #fca5a5, #dc2626)" }} />
                    <span className="text-[10px] text-gray-300 font-bold">Target: 7.0</span>
                  </div>
                </>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-4">Skill breakdown</div>
              <div className="flex flex-col gap-4">
                {skillStats.map(s => (
                  <SkillBar key={s.label} label={s.label} pct={s.pct} color={s.color} />
                ))}
              </div>
              {weakest && (
                <div className="mt-5 pt-4 border-t border-gray-50">
                  <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-2">Weakest area</div>
                  <div
                    className="flex items-center gap-3 rounded-xl p-3 border"
                    style={{ background: weakest.bg, borderColor: weakest.color + "33" }}
                  >
                    <span style={{ fontSize: 18 }}>{weakest.icon}</span>
                    <div>
                      <div className="text-[12px] font-bold" style={{ color: weakest.color }}>
                        {weakest.label} — {weakest.pct}%
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Focus here to improve your band</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── BOTTOM ROW ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">

            {/* Recent tests */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-3">Recent tests</div>
              {recentTests.length === 0 ? (
                <div className="text-center text-gray-300 text-sm py-6">No tests yet</div>
              ) : (
                recentTests.map((r, i) => {
                  const meta = SKILL_META[r.test_type] ?? SKILL_META.reading
                  const band = r.score !== null ? SCORE_TO_BAND(r.score) : null
                  return (
                    <div key={r.id} className={`flex items-center gap-3 py-2.5 ${i < recentTests.length - 1 ? "border-b border-gray-50" : ""}`}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[14px]" style={{ background: meta.bg }}>
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-gray-800 truncate">
                          {r.test_type.charAt(0).toUpperCase() + r.test_type.slice(1)} · Test {r.test_id}
                        </div>
                        <div className="text-[10px] text-gray-400">{formatDate(r.completed_at)}</div>
                      </div>
                      <div className="text-[13px] font-extrabold flex-shrink-0" style={{ color: band ? getBandColor(band) : "#bbb" }}>
                        {r.score !== null ? `${r.score}/40` : "—"}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Skill accuracy */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-3">Accuracy by skill</div>
              {skillStats.map((s, i) => (
                <div key={s.label} className={`flex items-center gap-3 py-2.5 ${i < skillStats.length - 1 ? "border-b border-gray-50" : ""}`}>
                  <div className="text-[13px] w-[18px]">{s.icon}</div>
                  <div className="text-[12px] font-medium text-gray-600 flex-1">{s.label}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-[4px] bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 w-7 text-right">{s.pct}%</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-gray-50">
                <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-2">Total tests by skill</div>
                <div className="grid grid-cols-2 gap-2">
                  {skillStats.map(s => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <span style={{ fontSize: 12 }}>{s.icon}</span>
                      <span className="text-[11px] text-gray-500">{s.label}</span>
                      <span className="text-[11px] font-bold text-gray-800 ml-auto">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-3">Study streak</div>
              <div className="text-[48px] font-black text-red-500 tracking-[-2px] leading-none">{streakData.current}</div>
              <div className="text-[12px] text-gray-400 mt-1 mb-4">
                {streakData.current === 0 ? "Start your streak today!" : streakData.current === 1 ? "day streak — keep going!" : "day streak — keep it up!"}
              </div>

              {/* 21-day grid */}
              <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                {streakData.grid.map((day, i) => (
                  <div
                    key={i}
                    className="rounded-[4px]"
                    style={{
                      height: 18,
                      background: day === "done" ? "#ef4444" : day === "partial" ? "#fca5a5" : "#f3f3f1"
                    }}
                  />
                ))}
              </div>
              <div className="grid mt-1" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} className="text-center text-[9px] text-gray-300 font-bold">{d}</div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 grid grid-cols-3 text-center">
                <div>
                  <div className="text-[15px] font-extrabold text-gray-900">{streakData.current}</div>
                  <div className="text-[9px] text-gray-300 uppercase tracking-[0.06em] mt-0.5">Current</div>
                </div>
                <div>
                  <div className="text-[15px] font-extrabold text-gray-900">{streakData.best}</div>
                  <div className="text-[9px] text-gray-300 uppercase tracking-[0.06em] mt-0.5">Best</div>
                </div>
                <div>
                  <div className="text-[15px] font-extrabold text-gray-900">{streakData.totalDays}</div>
                  <div className="text-[9px] text-gray-300 uppercase tracking-[0.06em] mt-0.5">Total days</div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
