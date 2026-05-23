'use client'

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { supabase } from "../lib/supabase"

type Props = {
  toggleSidebar?: () => void
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="2" y1="4" x2="14" y2="4" />
    <line x1="2" y1="8" x2="14" y2="8" />
    <line x1="2" y1="12" x2="14" y2="12" />
  </svg>
)

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="3" y1="3" x2="13" y2="13" />
    <line x1="13" y1="3" x2="3" y2="13" />
  </svg>
)

const IconHeadphones = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const IconMic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
)

const IconSparkle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
)

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)

const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconSupport = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconDiamond = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9z" />
    <path d="M11 3L8 9l4 13 4-13-3-6" />
    <line x1="2" y1="9" x2="22" y2="9" />
  </svg>
)

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const IconDashboard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

// ─── Nav items config ─────────────────────────────────────────────────────────
const PRACTICE_ITEMS = [
  { icon: <IconHeadphones />, label: "Listening", sub: "300 tests",  link: "/practice/listening" },
  { icon: <IconBook />,       label: "Reading",   sub: "300 tests",  link: "/practice/reading"   },
  { icon: <IconEdit />,       label: "Writing",   sub: "Task 1 & 2", link: "/practice/writing"   },
  { icon: <IconMic />,        label: "Speaking",  sub: "All parts",  link: "/practice/speaking"  },
]

const TOOL_ITEMS = [
  { icon: <IconSparkle />, label: "AI Writing", sub: "Instant band feedback", link: "/ai-writing" },
  { icon: <IconChart />,   label: "My Results", sub: "Scores & progress",     link: "/results"    },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar({ toggleSidebar }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  const [user, setUser]         = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [origin, setOrigin]       = useState({ x: 40, y: 40 })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting]           = useState(false)

  const menuRef   = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  // SCROLL
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handle)
    return () => window.removeEventListener("scroll", handle)
  }, [])

  // OUTSIDE CLICK
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target as Node)) return
      if (buttonRef.current?.contains(e.target as Node)) return
      setMenuOpen(false)
    }
    document.addEventListener("click", handle)
    return () => document.removeEventListener("click", handle)
  }, [])

  // ESC
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false) }
    document.addEventListener("keydown", handle)
    return () => document.removeEventListener("keydown", handle)
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const deleteAccount = async () => {
    setDeleting(true)
    try {
      const { data: session } = await supabase.auth.getSession()
      const userId = session.session?.user?.id
      if (userId) {
        // Call server-side API to delete auth user + all data
        await fetch("/api/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        })
      }
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const isHome      = pathname === "/"
  const isDashboard = pathname === "/dashboard"
  const testMatch   = pathname.match(/\/practice\/(?:reading|listening)\/(?:test\/|)(\d+)$/)
  const testNumber  = testMatch ? testMatch[1] : null
  const testType    = pathname.includes("listening") ? "Listening" : "Reading"
  const shouldShowMenu = !isHome

  const isActive = (link: string) => {
    if (link.startsWith("http")) return false
    return pathname === link || pathname.startsWith(link + "/")
  }

  const navigate = (link: string) => {
    setMenuOpen(false)
    if (link.startsWith("http")) window.open(link, "_blank")
    else router.push(link)
  }

  const initial  = user?.email?.[0]?.toUpperCase() ?? "U"
  const username = user?.email?.split("@")[0] ?? ""

  return (
    <>
      {/* ── BACKDROP ──────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-300 ${
          menuOpen ? "opacity-100 bg-black/50 backdrop-blur-sm" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── DROPDOWN MENU ─────────────────────────────────────────────── */}
      <div
        ref={menuRef}
        style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
        className={`
          fixed top-[56px] left-0 w-full z-40 px-5
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${menuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
        `}
      >
        <div className="rounded-2xl bg-[#0c0c0c] border border-white/[0.06] p-5 shadow-2xl">

          {/* Practice Tests */}
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/25 mb-3">
            Practice Tests
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {PRACTICE_ITEMS.map(({ icon, label, sub, link }) => (
              <button
                key={label}
                onClick={() => navigate(link)}
                className={`
                  flex flex-col gap-3 p-3.5 rounded-xl text-left transition-all duration-150 border
                  ${isActive(link)
                    ? "bg-white/10 border-white/15"
                    : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.07] hover:border-white/10"}
                `}
              >
                <div className="text-white/50 pointer-events-none">{icon}</div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{label}</div>
                  <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tools & Results */}
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/25 mb-3">
            Tools &amp; Results
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {TOOL_ITEMS.map(({ icon, label, sub, link }) => (
              <button
                key={label}
                onClick={() => navigate(link)}
                className={`
                  flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-150 border
                  ${isActive(link)
                    ? "bg-white/10 border-white/15"
                    : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.07] hover:border-white/10"}
                `}
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/50 flex-shrink-0 pointer-events-none">
                  {icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{label}</div>
                  <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <div className="flex gap-2">
              <button
                onClick={() => navigate("https://t.me/jasurbeks_ielts")}
                className="flex items-center gap-2 text-[12px] text-white/35 hover:text-white/60 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] px-3 py-2 rounded-lg transition-all"
              >
                <IconSend /> Telegram
              </button>
              <button
                onClick={() => navigate("/support")}
                className="flex items-center gap-2 text-[12px] text-white/35 hover:text-white/60 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] px-3 py-2 rounded-lg transition-all"
              >
                <IconSupport /> Support
              </button>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[10px] font-bold text-red-400">
                    {initial}
                  </div>
                  <span className="text-[11px] text-white/30">{username}</span>
                </div>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 text-[11px] text-red-400/50 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 border border-white/[0.04] hover:border-red-500/20 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Delete account
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/40">Sure?</span>
                    <button
                      onClick={deleteAccount}
                      disabled={deleting}
                      className="text-[11px] font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-[11px] text-white/30 hover:text-white/60 bg-white/[0.03] border border-white/[0.05] px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── NAVBAR ────────────────────────────────────────────────────── */}
      <div
        className={`
          fixed top-0 left-0 w-full h-14 z-50
          flex items-center justify-between px-5
          transition-all duration-300
          ${scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm"
            : "bg-white/90 backdrop-blur-xl border-b border-gray-100"}
        `}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-[14px] font-bold text-gray-900 tracking-tight">
              IELTS <span className="text-red-500">CDI</span>
            </span>
          </Link>

          {/* Divider + Menu button */}
          {shouldShowMenu && (
            <>
              <div className="w-px h-4 bg-gray-200" />
              <button
                ref={buttonRef}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const rect = buttonRef.current?.getBoundingClientRect()
                  if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
                  setMenuOpen(prev => !prev)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all"
              >
                <span className="pointer-events-none">
                  {menuOpen ? <IconClose /> : <IconMenu />}
                </span>
              </button>
            </>
          )}
        </div>

        {/* CENTER */}
        <span className="text-[13px] font-medium text-gray-500 absolute left-1/2 -translate-x-1/2 pointer-events-none">
          {testNumber ? `${testType} Test ${testNumber}` : "IELTS CDI Platform"}
        </span>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {testNumber && (
            <button
              onClick={() => router.push(`/practice/${testType.toLowerCase()}`)}
              className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          )}

          {loading ? null : user ? (
            <>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[11px] font-bold text-red-500 flex-shrink-0">
                {initial}
              </div>

              {/* Dashboard button — only shown when signed in, disabled on dashboard */}
              {!isDashboard ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  <IconDashboard />
                  Dashboard
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-300 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-lg cursor-default select-none">
                  <IconDashboard />
                  Dashboard
                </div>
              )}

              <button
                onClick={() => router.push("/pricing")}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-all"
              >
                <IconDiamond />
                Upgrade
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <IconLogout />
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="text-[12px] font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-1.5 rounded-lg transition-all"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </>
  )
}
