'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"

type Plan = "free" | "premium" | "ultimate"

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IcoReading = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const IcoWriting = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const IcoSpeaking = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
)

const IcoListening = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

const IcoMockExam = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

const IcoBand9 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const IcoVocab = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const IcoMaterials = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const IcoProgress = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)

const IcoTips = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const IcoChevron = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  { icon: <IcoReading />,   iconBg: "bg-blue-50",   iconColor: "text-blue-500",   title: "Reading",   desc: "Academic passages with timed scoring.",    href: "/practice/reading",   hoverBorder: "hover:border-blue-200",   topBar: "bg-blue-500",   btn: "bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white"   },
  { icon: <IcoWriting />,   iconBg: "bg-purple-50", iconColor: "text-purple-500", title: "Writing",   desc: "Task 1 & 2 with AI band evaluation.",      href: "/practice/writing",   hoverBorder: "hover:border-purple-200", topBar: "bg-purple-500", btn: "bg-purple-50 text-purple-700 hover:bg-purple-500 hover:text-white" },
  { icon: <IcoSpeaking />,  iconBg: "bg-green-50",  iconColor: "text-green-500",  title: "Speaking",  desc: "Record answers and get instant feedback.",  href: "/practice/speaking",  hoverBorder: "hover:border-green-200",  topBar: "bg-green-500",  btn: "bg-green-50 text-green-700 hover:bg-green-500 hover:text-white"   },
  { icon: <IcoListening />, iconBg: "bg-orange-50", iconColor: "text-orange-500", title: "Listening", desc: "Real CDI audio tests with answer keys.",    href: "/practice/listening", hoverBorder: "hover:border-orange-200", topBar: "bg-orange-500", btn: "bg-orange-50 text-orange-700 hover:bg-orange-500 hover:text-white" },
]

const QUICK_LINKS = [
  { icon: <IcoMockExam />, iconBg: "bg-gray-50", iconColor: "text-gray-500", label: "Full Mock Exam",  sub: "All 4 sections, timed",   href: "/mock"    },
  { icon: <IcoBand9 />,    iconBg: "bg-gray-50", iconColor: "text-gray-500", label: "Band 9 Samples",  sub: "Annotated model answers", href: "/samples" },
]

const RESOURCES = [
  { icon: <IcoVocab />,     label: "Vocabulary Builder", href: "/vocabulary" },
  { icon: <IcoMaterials />, label: "Prep Materials",      href: "/materials"  },
  { icon: <IcoProgress />,  label: "My Full Progress",    href: "/progress"   },
  { icon: <IcoTips />,      label: "Instructor Tips",     href: "/tips"       },
]

const PLAN_CHIP: Record<Plan, string> = {
  free:     "bg-gray-100 text-gray-600",
  premium:  "bg-blue-100 text-blue-700",
  ultimate: "bg-purple-100 text-purple-700",
}

const SKILL_COLORS = [
  { label: "Reading",   color: "bg-blue-500"   },
  { label: "Listening", color: "bg-orange-500" },
  { label: "Writing",   color: "bg-purple-500" },
  { label: "Speaking",  color: "bg-green-500"  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function NavItem({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={active}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 text-left ${
        active ? "bg-red-50 text-red-500 font-semibold cursor-default" : "text-gray-400 hover:bg-red-50 hover:text-red-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-red-500" : "bg-current opacity-40"}`} />
      {label}
    </button>
  )
}

function StatCard({ label, value, sub, valueClass = "text-gray-900" }: { label: string; value: string | number; sub: string; valueClass?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-red-100 hover:shadow-lg hover:shadow-red-50/50 transition-all duration-200">
      <div className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-2">{label}</div>
      <div className={`text-[26px] font-extrabold tracking-tight leading-none ${valueClass}`}>{value}</div>
      <div className="text-[11px] text-gray-400 mt-1.5">{sub}</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()

  const [email, setEmail]     = useState("")
  const [plan, setPlan]       = useState<Plan>("free")
  const [loading, setLoading] = useState(true)
  const [skillPcts, setSkillPcts] = useState<number[]>([0, 0, 0, 0])
  const [stats, setStats] = useState({
    tests: 0,
    band: 0,
    studyMins: 0,
    accuracy: 0,
  })

  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.replace("/auth/login"); return }

      const user = data.session.user
      setEmail(user.email ?? "")

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("email", user.email)
        .single()

      if (profile?.plan) setPlan(profile.plan.toLowerCase().trim() as Plan)

      const { data: results } = await supabase
        .from("test_results")
        .select("score, test_type, completed_at")
        .eq("user_id", user.id)

      const count = results?.length ?? 0

      // Band: convert score/40 to IELTS band
      const scoreToBand = (s: number) => {
        if (s >= 39) return 9.0; if (s >= 37) return 8.5; if (s >= 35) return 8.0
        if (s >= 33) return 7.5; if (s >= 30) return 7.0; if (s >= 27) return 6.5
        if (s >= 23) return 6.0; if (s >= 19) return 5.5; if (s >= 15) return 5.0
        return 4.5
      }

      const withScore = results?.filter(r => r.score !== null) ?? []
      const avgBand = withScore.length
        ? Number((withScore.reduce((a, b) => a + scoreToBand(b.score), 0) / withScore.length).toFixed(1))
        : 0

      // Accuracy: avg (score/40)*100
      const accuracy = withScore.length
        ? Math.round(withScore.reduce((a, b) => a + (b.score / 40) * 100, 0) / withScore.length)
        : 0

      // Study time: estimate 45 min per test
      const studyMins = count * 45

      // Skill percentages
      const types = ["reading", "listening", "writing", "speaking"]
      const pcts = types.map(t => {
        const tr = withScore.filter(r => r.test_type === t)
        return tr.length ? Math.round(tr.reduce((a, b) => a + (b.score / 40) * 100, 0) / tr.length) : 0
      })

      setStats({ tests: count, band: avgBand, studyMins, accuracy })
      setSkillPcts(pcts)
      setLoading(false)
    }
    checkAccess()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace("/auth/login")
  }

  const firstName = email.split("@")[0] ?? "there"
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  // Format study time nicely
  const formatStudyTime = (mins: number) => {
    if (mins === 0) return "0 min"
    if (mins < 60) return `${mins} min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f8f6]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400 font-medium">Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f6] text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-5 px-3 flex-shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-[30px] h-[30px] bg-red-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="text-[15px] font-extrabold tracking-tight">
            IELTS <span className="text-red-500">CDI</span>
          </span>
        </div>

        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-300 px-2 mb-1">Main</p>
        {/* Dashboard is active — disabled, no navigation */}
        <NavItem label="Dashboard"   active />
        <NavItem label="My Progress" onClick={() => router.push("/progress")} />
        <NavItem label="Mock Tests"  onClick={() => router.push("/mock")} />

        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-300 px-2 mt-4 mb-1">Practice</p>
        <NavItem label="Reading"   onClick={() => router.push("/practice/reading")} />
        <NavItem label="Listening" onClick={() => router.push("/practice/listening")} />
        <NavItem label="Writing"   onClick={() => router.push("/practice/writing")} />
        <NavItem label="Speaking"  onClick={() => router.push("/practice/speaking")} />

        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-300 px-2 mt-4 mb-1">Resources</p>
        <NavItem label="Band 9 Samples" onClick={() => router.push("/samples")} />
        <NavItem label="Vocabulary"     onClick={() => router.push("/vocabulary")} />
        <NavItem label="Materials"      onClick={() => router.push("/materials")} />

        {/* User */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-[30px] h-[30px] rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600 text-xs font-bold flex-shrink-0">
              {email[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="text-left min-w-0">
              <div className="text-[12px] font-semibold text-gray-800 truncate">{firstName}</div>
              <div className="text-[10px] text-gray-400 truncate">{plan} plan · sign out</div>
            </div>
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-7 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-[15px] font-bold text-gray-900">Dashboard</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${PLAN_CHIP[plan]}`}>
              {plan}
            </span>
            {plan === "free" && (
              <button
                onClick={() => router.push("/pricing")}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-full transition-all"
              >
                Upgrade
              </button>
            )}

          </div>
        </header>

        <main className="flex-1 p-7 overflow-y-auto">

          {/* Welcome Banner */}
          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-5 flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[19px] font-extrabold tracking-tight text-gray-950">
                Welcome back, {firstName}
              </h2>
              <p className="text-[13px] text-gray-400 mt-1">
                You're on track — keep practising to hit Band 7.0
              </p>
            </div>
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-red-500">
                {stats.tests} {stats.tests === 1 ? "session" : "sessions"} completed
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard
              label="Tests Taken"
              value={stats.tests}
              sub="Total completed"
            />
            <StatCard
              label="Avg Band Score"
              value={stats.band || "—"}
              sub="Target: 7.0"
              valueClass="text-red-500"
            />
            <StatCard
              label="Accuracy"
              value={stats.accuracy ? `${stats.accuracy}%` : "—"}
              sub="Avg correct answers"
              valueClass="text-green-600"
            />
            <StatCard
              label="Study Time"
              value={formatStudyTime(stats.studyMins)}
              sub={`~45 min per test`}
              valueClass="text-blue-600"
            />
          </div>

          {/* Body */}
          <div className="grid grid-cols-[1fr_248px] gap-4">

            {/* Left */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-3">
                Practice Modules
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {MODULES.map((m) => (
                  <div
                    key={m.title}
                    onClick={() => router.push(m.href)}
                    className={`bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer transition-all duration-200 relative overflow-hidden group ${m.hoverBorder} hover:shadow-md hover:-translate-y-0.5`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[3px] ${m.topBar} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center`}>
                        {m.icon}
                      </div>
                      <span className="text-gray-200 text-lg group-hover:translate-x-0.5 group-hover:text-gray-400 transition-all duration-150">›</span>
                    </div>
                    <div className="text-[14px] font-bold text-gray-900 mb-1">{m.title}</div>
                    <div className="text-[11px] text-gray-400 leading-relaxed">{m.desc}</div>
                    <button
                      className={`mt-3.5 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 ${m.btn}`}
                      onClick={(e) => { e.stopPropagation(); router.push(m.href) }}
                    >
                      Start →
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-300 mb-3">
                Quick Access
              </p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_LINKS.map((q) => (
                  <div
                    key={q.label}
                    onClick={() => router.push(q.href)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-red-100 hover:shadow-md hover:shadow-red-50/50 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className={`w-8 h-8 rounded-lg ${q.iconBg} ${q.iconColor} flex items-center justify-center mb-3`}>
                      {q.icon}
                    </div>
                    <div className="text-[13px] font-bold text-gray-900">{q.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{q.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3">

              {/* Skill Progress */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold tracking-[0.09em] uppercase text-gray-300 mb-4">
                  Skill Progress
                </p>
                {SKILL_COLORS.map((s, i) => (
                  <div key={s.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-gray-700">{s.label}</span>
                      <span className="text-gray-400">{skillPcts[i] || 0}%</span>
                    </div>
                    <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.color} transition-all duration-700`}
                        style={{ width: `${skillPcts[i] || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resources */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold tracking-[0.09em] uppercase text-gray-300 mb-3">
                  Resources
                </p>
                {RESOURCES.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => router.push(r.href)}
                    className="w-full flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-b-0 hover:text-red-500 transition-colors text-left group"
                  >
                    <span className="text-gray-400 group-hover:text-red-400 transition-colors">{r.icon}</span>
                    <span className="text-[12px] font-medium text-gray-600 group-hover:text-red-500 transition-colors flex-1">
                      {r.label}
                    </span>
                    <span className="text-gray-200 group-hover:text-red-300 transition-colors">
                      <IcoChevron />
                    </span>
                  </button>
                ))}
              </div>

              {/* Upgrade card */}
              {plan === "free" && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-[13px] font-bold text-gray-900 mb-1">Upgrade to Premium</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                    Unlock AI writing feedback, speaking practice, and full mock exams.
                  </p>
                  <button
                    onClick={() => router.push("/pricing")}
                    className="w-full bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white text-[12px] font-bold py-2.5 rounded-xl transition-all duration-150"
                  >
                    Upgrade now →
                  </button>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
