'use client'

import Navbar from "./Navbar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">

      {/* NAVBAR */}
      <Navbar />

      {/* LAYOUT */}
      <div className="flex">

        {/* MAIN */}
        <main
          className={`
            transition-all duration-300 ease-in-out w-full pt-16
          `}
        >
          {children}
        </main>

      </div>
    </div>
  )
}