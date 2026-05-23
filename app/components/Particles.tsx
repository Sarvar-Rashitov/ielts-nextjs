'use client'

import { useMemo } from "react"

export default function Particles() {

  const particles = useMemo(() => {

    return Array.from({ length: 30 }).map((_, i) => {

      const size = Math.random() * 5 + 2
      const top = Math.random() * 100
      const left = Math.random() * 100
      const delay = Math.random() * 6
      const duration = Math.random() * 8 + 6

      return {
        id: i,
        size,
        top,
        left,
        delay,
        duration
      }

    })

  }, [])

  return (

    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">

      {particles.map(p => (

        <span
          key={p.id}
          className="absolute rounded-full bg-blue-400/40"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.top}%`,
            left: `${p.left}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: "blur(0.5px)"
          }}
        />

      ))}

      <style jsx>{`

        @keyframes float {

          0% {
            transform: translateY(0px);
            opacity: 0.3;
          }

          50% {
            transform: translateY(-25px);
            opacity: 0.8;
          }

          100% {
            transform: translateY(0px);
            opacity: 0.3;
          }

        }

      `}</style>

    </div>

  )
}