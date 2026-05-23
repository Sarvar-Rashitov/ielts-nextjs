'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────
type PlanKey = "monthly" | "2" | "3" | "5"

interface PriceItem {
  usd: string
  som: string
  oldUsd?: string
  oldSom?: string
  save?: string
}

interface PlanPrices {
  basic: PriceItem
  premium: PriceItem
  ultimate: PriceItem
}

// ─── Pricing data ─────────────────────────────────────────────────────────────
const PRICING: Record<PlanKey, PlanPrices> = {
  monthly: {
    basic:   { usd: "$9",   som: "98,000 so'm" },
    premium: { usd: "$19",  som: "118,000 so'm" },
    ultimate:{ usd: "$29",  som: "228,000 so'm" },
  },
  "2": {
    basic:   { usd: "$15", oldUsd: "$18", save: "17%", som: "163,000 so'm", oldSom: "196,000 so'm" },
    premium: { usd: "$35", oldUsd: "$38", save: "7%",  som: "220,000 so'm", oldSom: "236,000 so'm" },
    ultimate:{ usd: "$54", oldUsd: "$58", save: "7%",  som: "424,000 so'm", oldSom: "456,000 so'm" },
  },
  "3": {
    basic:   { usd: "$23", oldUsd: "$27", save: "15%", som: "250,000 so'm", oldSom: "294,000 so'm" },
    premium: { usd: "$53", oldUsd: "$57", save: "7%",  som: "329,000 so'm", oldSom: "354,000 so'm" },
    ultimate:{ usd: "$83", oldUsd: "$87", save: "5%",  som: "650,000 so'm", oldSom: "684,000 so'm" },
  },
  "5": {
    basic:   { usd: "$40",  oldUsd: "$45",  save: "11%", som: "436,000 so'm",  oldSom: "490,000 so'm" },
    premium: { usd: "$80",  oldUsd: "$95",  save: "16%", som: "496,000 so'm",  oldSom: "590,000 so'm" },
    ultimate:{ usd: "$125", oldUsd: "$145", save: "13%", som: "991,000 so'm",  oldSom: "1,140,000 so'm" },
  },
}

const TABS: { key: PlanKey; label: string; save?: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "2",       label: "2 Months", save: "17%" },
  { key: "3",       label: "3 Months", save: "15%" },
  { key: "5",       label: "5 Months", save: "16%" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function CheckIcon({ dark = false, highlight = false }) {
  const bg = highlight
    ? "bg-gray-900"
    : dark
    ? "bg-white/10"
    : "bg-green-50"
  const color = highlight ? "text-white" : dark ? "text-green-400" : "text-green-600"
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${bg} ${color} text-[9px] font-bold`}
    >
      ✓
    </span>
  )
}

function FeatureList({
  items,
  dark = false,
  highlight = false,
}: {
  items: string[]
  dark?: boolean
  highlight?: boolean
}) {
  return (
    <ul className="flex flex-col gap-2.5 flex-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <CheckIcon dark={dark} highlight={highlight} />
          <span
            className={`text-sm leading-snug ${
              dark ? "text-gray-400" : highlight ? "text-gray-700" : "text-gray-600"
            }`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

function PriceDisplay({
  item,
  dark = false,
}: {
  item: PriceItem
  dark?: boolean
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-2">
        <span
          className={`text-4xl font-extrabold tracking-tight ${
            dark ? "text-white" : "text-gray-950"
          }`}
        >
          {item.usd}
        </span>
        {item.oldUsd && (
          <span className="text-sm text-gray-400 line-through">{item.oldUsd}</span>
        )}
      </div>
      <div className={`text-xs mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
        {item.som}
        {item.oldSom && (
          <span className="line-through ml-2 text-gray-400">{item.oldSom}</span>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Pricing() {
  const router = useRouter()
  const [plan, setPlan] = useState<PlanKey>("monthly")

  const { basic, premium, ultimate } = PRICING[plan]

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-16">

      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-red-500 mb-3">
          Pricing
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-1.5px] text-gray-950">
          Simple, honest pricing
        </h1>
        <p className="mt-3 text-base text-gray-500 max-w-sm mx-auto">
          Choose a plan. Start improving. No hidden fees.
        </p>
      </div>

      {/* Duration tabs */}
      <div className="flex justify-center flex-wrap gap-2 mb-12">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPlan(tab.key)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
              border transition-all duration-150
              ${
                plan === tab.key
                  ? "bg-gray-950 text-white border-gray-950 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
              }
            `}
          >
            {tab.label}
            {tab.save && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  plan === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-green-50 text-green-600"
                }`}
              >
                Save {tab.save}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 max-w-5xl mx-auto">

        {/* ── STARTER ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col shadow-sm">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-400 mb-4">
            Starter
          </p>
          <div className="mb-5">
            <div className="text-4xl font-extrabold tracking-tight text-gray-950">$0</div>
            <div className="text-xs mt-1 text-gray-400">Free forever</div>
          </div>
          <div className="h-px bg-gray-100 mb-5" />
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-300 mb-3">
            Includes
          </p>
          <FeatureList
            items={[
              "2 Listening tests",
              "2 Reading tests",
              "1 Speaking mock",
              "1 Writing correction",
            ]}
          />
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 w-full py-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
          >
            Start free
          </button>
        </div>

        {/* ── BASIC ── */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col shadow-sm relative">
          {basic.save && (
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full">
              Save {basic.save}
            </span>
          )}
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-400 mb-4">
            Basic
          </p>
          <PriceDisplay item={basic} />
          <div className="h-px bg-gray-100 mb-5" />
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-300 mb-3">
            Includes
          </p>
          <FeatureList
            items={[
              "10 Listening tests",
              "10 Reading tests",
              "5 Speaking mocks",
              "10 Writing corrections",
              "Weekly articles",
            ]}
          />
          <button
            onClick={() => router.push("/payment/choose-version")}
            className="mt-6 w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
          >
            Get Basic
          </button>
        </div>

        {/* ── PREMIUM (highlighted) ── */}
        <div className="bg-white border-2 border-gray-950 rounded-2xl p-6 flex flex-col shadow-xl relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[10px] font-bold tracking-[0.1em] uppercase px-4 py-1 rounded-full whitespace-nowrap">
            Most popular
          </span>
          {premium.save && (
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full">
              Save {premium.save}
            </span>
          )}
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-950 mb-4">
            Premium
          </p>
          <PriceDisplay item={premium} />
          <div className="h-px bg-gray-100 mb-5" />
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-300 mb-3">
            Includes
          </p>
          <FeatureList
            items={[
              "30 Listening tests",
              "30 Reading tests",
              "20 Speaking mocks",
              "30 Writing corrections",
              "Weekly articles",
              "Weakness analysis",
            ]}
            highlight
          />
          <button
            onClick={() => router.push("/payment/choose-version")}
            className="mt-6 w-full py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98] shadow-lg shadow-gray-900/20"
          >
            Get Premium
          </button>
        </div>

        {/* ── ULTIMATE ── */}
        <div className="bg-gray-950 border border-white/5 rounded-2xl p-6 flex flex-col shadow-xl relative">
          {ultimate.save && (
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-900/40 text-green-400 border border-green-800/50 px-2 py-0.5 rounded-full">
              Save {ultimate.save}
            </span>
          )}
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-500 mb-4">
            Ultimate
          </p>
          <PriceDisplay item={ultimate} dark />
          <div className="h-px bg-white/10 mb-5" />
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-600 mb-3">
            Includes
          </p>
          <FeatureList
            items={[
              "Unlimited listening",
              "Unlimited reading",
              "Unlimited speaking",
              "Unlimited writing",
              "Weekly articles",
              "Weakness analysis",
            ]}
            dark
          />
          <button
            onClick={() => router.push("/payment/choose-version")}
            className="mt-6 w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-950 text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
          >
            Get Ultimate
          </button>
        </div>

      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 mt-10">
        All plans include access to the Inspera-like exam interface.{" "}
        <button
          onClick={() => router.push("/auth/register")}
          className="text-red-500 hover:underline font-medium"
        >
          Questions? Contact us.
        </button>
      </p>

    </div>
  )
}
