import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {

  const { userId } = await req.json()

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )
  
  await supabaseAdmin.from("test_results").delete().eq("user_id", userId)
  await supabaseAdmin.from("profiles").delete().eq("id", userId)
  await supabaseAdmin.from("subscriptions").delete().eq("user_id", userId)

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}