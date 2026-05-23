'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "./lib/supabase"
import { motion } from "framer-motion"

// ─── Reusable fade-up wrapper ───────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-red-500">
        {children}
      </span>
    </div>
  )
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="inline-flex items-center gap-3 mb-5">
      <span className="w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
        {n}
      </span>
      <span className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-400">
        Step {String(n).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    // ✅ Step 1: If Supabase dumped ?code= on the root page instead of
    // /auth/callback, forward it there immediately so the session is exchanged.
    const params = new URLSearchParams(window.location.search)
    const code   = params.get("code")
    const next   = params.get("next") ?? "/dashboard"

    if (code) {
      window.location.href = `/auth/callback?code=${code}&next=${next}`
      return // stop — page is navigating away
    }

    // ✅ Step 2: Verify session server-side (getUser hits Supabase network,
    // unlike getSession which only reads the local cookie — catches deleted users)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true)
      } else {
        supabase.auth.signOut({ scope: "local" }) // clear any stale cookie
        setIsLoggedIn(false)
      }
    })

    // ✅ Step 3: Listen for future auth changes (sign in, sign out, OAuth return)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            setIsLoggedIn(true)
            router.replace("/dashboard")
          }
        }
        if (event === "SIGNED_OUT") {
          setIsLoggedIn(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const features = [
    {
      icon: "📋",
      title: "Real exam practice",
      desc: "Timed tests that mirror the actual IELTS format — not random exercises.",
    },
    {
      icon: "🤖",
      title: "AI writing feedback",
      desc: "Instant, detailed evaluation on Task 1 and Task 2 with band score breakdowns.",
    },
    {
      icon: "📊",
      title: "Progress tracking",
      desc: "See your band scores improve over time and identify weak areas fast.",
    },
    {
      icon: "🎧",
      title: "Listening tests",
      desc: "300+ audio-based tests across all IELTS listening question types.",
    },
    {
      icon: "🎤",
      title: "Speaking practice",
      desc: "Practice all three parts with timed prompts and structured responses.",
    },
    {
      icon: "⚡",
      title: "Inspera-like interface",
      desc: "The test environment looks and feels exactly like the real digital IELTS.",
    },
  ]

  const steps = [
    {
      label: "Understand the test",
      desc: "Read the instructions and get familiar with the format — just like on exam day.",
      src: "/instructions.png",
      alt: "IELTS instructions screen",
    },
    {
      label: "Take the real test",
      desc: "Work through authentic IELTS-style questions in a fully timed environment.",
      src: "/reading-test.png",
      alt: "IELTS reading test interface",
    },
    {
      label: "Own your dashboard",
      desc: "Review your score, track your progress, and know exactly what to work on next.",
      src: "/dashboard.png",
      alt: "IELTS CDI dashboard",
    },
  ]

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-[15px] font-bold tracking-tight">
            IELTS <span className="text-red-500">CDI</span>
          </span>
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              Features
            </button>
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              How it works
            </button>
            <button
              onClick={() => router.push("/pricing")}
              className="text-sm text-gray-500 hover:text-gray-900 transition"
            >
              Pricing
            </button>
            {isLoggedIn === false && (
              <button
                onClick={() => router.push("/auth/login")}
                className="text-sm text-gray-500 hover:text-gray-900 transition"
              >
                Sign in
              </button>
            )}
          </div>

          {isLoggedIn === true ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
            >
              Go to Dashboard →
            </button>
          ) : isLoggedIn === false ? (
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
            >
              Get started free
            </button>
          ) : (
            <div className="w-[140px] h-[38px] rounded-xl bg-gray-100 animate-pulse" />
          )}
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-red-600 tracking-wide">
                6,500+ students already improving
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-[-1.5px] text-gray-950"
          >
            Boost your IELTS score{" "}
            <span className="text-red-500">faster than ever</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="mt-6 text-lg text-gray-500 leading-relaxed max-w-md"
          >
            Real exam simulations, instant AI feedback, and smart progress
            tracking — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            {isLoggedIn === true ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl transition-all duration-150 shadow-lg shadow-red-100"
              >
                Go to Dashboard →
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth/register")}
                className="bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl transition-all duration-150 shadow-lg shadow-red-100"
              >
                Get started free →
              </button>
            )}
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-500 font-semibold text-[15px] px-7 py-3.5 rounded-2xl transition-all duration-150"
            >
              See how it works
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5 text-sm text-gray-400 flex flex-wrap gap-x-5 gap-y-1"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> Start in 30 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500 font-bold">✓</span> Cancel anytime
            </span>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 bg-red-100 rounded-3xl blur-2xl opacity-40 scale-95" />
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200">
            <img
              src="/reading-preview.png"
              alt="IELTS CDI reading interface"
              className="w-full h-auto"
            />
          </div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ─────────────────────────────────────────────────── */}
      <div className="border-t border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4">
          {[
            { n: "6,500+", l: "Active students" },
            { n: "235+", l: "Reading passages" },
            { n: "94%", l: "Success rate" },
            { n: "24/7", l: "AI feedback" },
          ].map((s, i) => (
            <div key={i} className="text-center px-4 border-r border-gray-200 last:border-r-0">
              <div className="text-3xl font-bold text-red-500 tracking-tight">{s.n}</div>
              <div className="text-sm text-gray-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <FadeUp>
          <SectionLabel>What you get</SectionLabel>
          <h2 className="text-4xl font-bold tracking-[-0.8px] text-gray-950 leading-tight">
            Everything you need to hit <br className="hidden md:block" />
            your target score
          </h2>
          <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-md">
            Built specifically for IELTS — not a generic English app.
          </p>
        </FadeUp>

        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="group h-full bg-white border border-gray-100 hover:border-red-100 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:shadow-red-50 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg mb-5 group-hover:bg-red-100 transition-colors">
                  {f.icon}
                </div>
                <div className="text-[15px] font-semibold text-gray-900 mb-2">{f.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="demo" className="bg-gray-50 border-t border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp className="text-center mb-20">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-4xl font-bold tracking-[-0.8px] text-gray-950">
              Three steps to a better score
            </h2>
            <p className="mt-4 text-gray-500 text-base max-w-md mx-auto leading-relaxed">
              From zero to test-ready — no guesswork, no confusion.
            </p>
          </FadeUp>

          <div className="flex flex-col gap-20">
            {steps.map((step, i) => (
              <FadeUp key={i} delay={0.05}>
                <div>
                  <StepBadge n={i + 1} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.label}</h3>
                  <p className="text-sm text-gray-500 mb-8 max-w-sm leading-relaxed">{step.desc}</p>
                  <div className="group rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xl shadow-gray-100 transition-transform duration-500 hover:scale-[1.015]">
                    <img
                      src={step.src}
                      alt={step.alt}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO DEMO ──────────────────────────────────────────────────── */}
      <section className="bg-[#080808] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <SectionLabel>Live demo</SectionLabel>
            <h2 className="text-4xl font-bold tracking-[-0.8px] text-white">
              Watch the real exam interface
            </h2>
            <p className="mt-4 text-gray-500 text-base italic">
              The same Inspera-like environment you'll use on test day
            </p>
          </FadeUp>
          <FadeUp>
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
              <video
                src="/reading-demo.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto max-h-[620px] object-contain bg-black"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-2xl mx-auto px-6">
          <FadeUp>
            <div className="bg-red-50 border border-red-100 rounded-[28px] px-10 py-14 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-[-1px] text-gray-950 leading-tight">
                Start improving your score today
              </h2>
              <p className="mt-5 text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
                Real practice. Sharp feedback. Measurable progress. No guessing.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
                {isLoggedIn === true ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white font-semibold text-[15px] px-8 py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-red-200"
                  >
                    Go to Dashboard →
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="bg-red-500 hover:bg-red-600 active:scale-[0.97] text-white font-semibold text-[15px] px-8 py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-red-200"
                  >
                    Get started — it takes 30 seconds
                  </button>
                )}
                <button
                  onClick={() => router.push("/pricing")}
                  className="border border-red-200 hover:border-red-300 hover:bg-red-100/50 text-red-500 font-semibold text-[15px] px-8 py-4 rounded-2xl transition-all duration-150"
                >
                  View pricing
                </button>
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> Free to start</span>
                <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> No card needed</span>
                <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> Cancel anytime</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-400">
            IELTS <span className="text-red-400">CDI</span>
          </span>
          <span className="text-xs text-gray-400">© 2025 IELTS CDI Platform</span>
        </div>
      </footer>

    </main>
  )
}
