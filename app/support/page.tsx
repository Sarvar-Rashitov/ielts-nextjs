'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabase"

export default function Support(){

const router = useRouter()

const [email,setEmail] = useState("")
const [message,setMessage] = useState("")
const [sent,setSent] = useState(false)
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

useEffect(()=>{

const getUser = async () => {

const { data } = await supabase.auth.getSession()

if(data.session){
setEmail(data.session.user.email || "")
}

}

getUser()

},[])

const sendQuery = async () => {

if(!message.trim()){ setError("Please write your message."); return }

setLoading(true)
setError("")

try {
  const res = await fetch("/api/support",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email, message })
  })

  if(!res.ok) throw new Error("Failed to send")

  setSent(true)
  setTimeout(()=>{ router.push("/dashboard") }, 3000)
} catch {
  setError("Failed to send message. Please try again.")
} finally {
  setLoading(false)
}

}

return(

<div className="min-h-screen bg-black text-white flex items-center justify-center">

<div className="bg-gray-900 p-10 rounded-xl w-[500px]">

<h1 className="text-2xl font-bold mb-6">
Support
</h1>

<p className="text-gray-400 mb-6">
If you have any questions or need any help, please send it to us.
</p>

{!sent && (

<>

<textarea
className="w-full h-40 p-4 rounded-lg bg-black border border-gray-700 mb-3"
placeholder="Write your question here..."
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

{error && (
  <p className="text-red-400 text-sm mb-3">{error}</p>
)}

<button
onClick={sendQuery}
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold disabled:opacity-50"
>
{loading ? "Sending..." : "Send"}
</button>

</>

)}

{sent && (

<div className="text-green-400 text-center text-lg font-semibold">
Thank you very much! Your query has been submitted.
</div>

)}

</div>

</div>

)

}