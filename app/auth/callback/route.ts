import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code       = requestUrl.searchParams.get("code")
  const next       = requestUrl.searchParams.get("next") ?? "/dashboard"

  // ✅ Derive origin from the incoming request itself — this is always correct
  // regardless of what port Next.js is running on or what env vars say.
  // We never use process.env or window.location here.
  const host     = request.headers.get("host") ?? "localhost:3000"
  const protocol = host.startsWith("localhost") ? "http" : "https"
  const origin   = `${protocol}://${host}`

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login", origin))
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()             { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Auth callback error:", error.message)
    return NextResponse.redirect(new URL("/auth/login?error=oauth_failed", origin))
  }

  // Detect password recovery flow
  if (next === "/update-password" || data?.session?.user?.recovery_sent_at) {
    return NextResponse.redirect(new URL("/update-password", origin))
  }

  return NextResponse.redirect(new URL(next, origin))
}
