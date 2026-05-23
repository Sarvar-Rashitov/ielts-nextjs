// ─── auth/components.tsx ─────────────────────────────────────────────────────
// Shared pieces used by all 4 auth pages.
// Copy this file to: app/auth/components.tsx

'use client'

import { ReactNode } from "react"
import { useRouter } from "next/navigation"

// ── Brand panel (left side) ──────────────────────────────────────────────────
export function AuthShell({
  children,
  leftTitle,
  leftAccent,
  leftDesc,
  showStats = true,
}: {
  children: ReactNode
  leftTitle: string
  leftAccent: string
  leftDesc: string
  showStats?: boolean
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[880px] grid md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/80">

        {/* LEFT */}
        <div className="bg-[#0a0a0a] px-10 py-12 flex flex-col justify-between">
          <div className="text-[15px] font-bold tracking-tight text-white">
            IELTS <span className="text-red-500">CDI</span>
          </div>

          <div className="py-10">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-red-500">
                Band 9 system
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-white leading-tight tracking-[-0.6px] mb-4">
              {leftTitle}{" "}
              <span className="text-red-500">{leftAccent}</span>
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mb-8">
              {leftDesc}
            </p>

            {showStats && (
              <div className="flex gap-3">
                {[
                  { num: "6,500+", label: "Students" },
                  { num: "94%",    label: "Success rate" },
                  { num: "24/7",   label: "AI feedback" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div className="text-xl font-extrabold text-red-500 tracking-tight">{s.num}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-[11px] text-gray-700">© 2025 IELTS CDI Platform</div>
        </div>

        {/* RIGHT */}
        <div className="bg-white px-10 py-12 flex flex-col justify-center">
          {children}
        </div>

      </div>
    </div>
  )
}

// ── Labelled input field ──────────────────────────────────────────────────────
export function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  hint,
}: {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  hint?: string
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.07em] uppercase text-gray-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          w-full px-4 py-3 rounded-xl
          border border-gray-200 bg-gray-50
          text-sm text-gray-900 placeholder:text-gray-300
          focus:outline-none focus:border-gray-900 focus:bg-white
          disabled:opacity-50
          transition-all duration-150
        "
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

// ── Inline error banner ───────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null
  return (
    <p className="text-[12px] text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
      {message}
    </p>
  )
}

// ── Primary submit button ─────────────────────────────────────────────────────
export function SubmitButton({
  loading,
  label,
  loadingLabel,
  onClick,
}: {
  loading: boolean
  label: string
  loadingLabel: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        w-full py-3 rounded-xl
        bg-gray-950 hover:bg-gray-800
        text-white text-sm font-semibold
        transition-all duration-150
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        shadow-lg shadow-gray-900/10
      "
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {loadingLabel}
        </span>
      ) : label}
    </button>
  )
}

// ── OR divider ────────────────────────────────────────────────────────────────
export function OrDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-xs text-gray-300">or</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

// ── Google OAuth button ───────────────────────────────────────────────────────
export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        w-full py-3 rounded-xl
        border border-gray-200 bg-white hover:bg-gray-50
        text-sm font-medium text-gray-700
        flex items-center justify-center gap-2.5
        transition-all duration-150 active:scale-[0.98]
        disabled:opacity-50
      "
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  )
}

// ── Trust badges row ──────────────────────────────────────────────────────────
export function TrustRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {items.map((t) => (
        <span key={t} className="text-[10px] text-gray-300 flex items-center gap-1">
          <span className="text-green-500 font-bold">✓</span> {t}
        </span>
      ))}
    </div>
  )
}
