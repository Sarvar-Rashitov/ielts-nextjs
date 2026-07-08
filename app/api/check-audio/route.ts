import { NextResponse } from "next/server"

// Check if audio files exist in Supabase Storage
export async function GET() {
  const audioUrls = [
    "https://uvcnkaolhovqnofzngtx.supabase.co/storage/v1/object/public/audio/Part-1.mp3",
    "https://uvcnkaolhovqnofzngtx.supabase.co/storage/v1/object/public/audio/Part-2.mp3",
    "https://uvcnkaolhovqnofzngtx.supabase.co/storage/v1/object/public/audio/Part-3.mp3",
    "https://uvcnkaolhovqnofzngtx.supabase.co/storage/v1/object/public/audio/Part-4.mp3",
  ]

  const results = await Promise.all(
    audioUrls.map(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" })
        return {
          url: url.split("/").pop(),
          status: res.ok ? "OK" : "NOT_FOUND",
          statusCode: res.status,
        }
      } catch {
        return {
          url: url.split("/").pop(),
          status: "ERROR",
          statusCode: 0,
        }
      }
    })
  )

  return NextResponse.json({ audioFiles: results })
}
