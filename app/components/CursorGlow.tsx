'use client'

import { useEffect, useState } from "react"

export default function CursorGlow() {

  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {

    let raf = 0

    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)

      raf = requestAnimationFrame(() => {
        setPos({
          x: e.clientX,
          y: e.clientY
        })
      })
    }

    window.addEventListener("mousemove", handleMove)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(raf)
    }

  }, [])

  return (
    <div
      className="fixed pointer-events-none select-none"
      style={{
        left: pos.x - 220,
        top: pos.y - 220,
        width: 440,
        height: 440,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at center, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.15) 35%, transparent 70%)",
        filter: "blur(70px)",
        opacity: 0.8,
        zIndex: -1,
        transform: "translate3d(0,0,0)",
        transition: "opacity 0.2s ease"
      }}
    />
  )
}