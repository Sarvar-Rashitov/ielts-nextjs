'use client'

import { useState } from "react"

export default function Task2Page(){

const [essay,setEssay] = useState("")
const [result,setResult] = useState("")
const [loading,setLoading] = useState(false)

const wordCount = essay.trim().split(/\s+/).filter(Boolean).length


const handleCheck = async ()=>{

if(!essay){
alert("Write your essay first")
return
}

setLoading(true)

try{

const res = await fetch("/api/check-task2",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
essay:essay
})
})

const data = await res.json()

setResult(data.result)

}catch{

alert("AI request failed")

}

setLoading(false)

}


return(

<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">

<h1 className="text-4xl font-extrabold mb-10">
IELTS Writing Task 2
</h1>


{/* ESSAY BOX */}

<div className="mb-4">

<p className="mb-3 text-lg font-semibold">
Write your essay
</p>

<textarea
value={essay}
onChange={(e)=>setEssay(e.target.value)}
placeholder="Write your Task 2 essay here..."
className="w-full h-64 p-4 rounded-lg bg-gray-800 text-white outline-none"
/>

</div>


{/* WORD COUNT */}

<p className="text-gray-400 mb-6">
Words: {wordCount} / Recommended: 250+
</p>


{/* CHECK BUTTON */}

<button
onClick={handleCheck}
className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:scale-105 transition"
>
{loading ? "Analyzing..." : "Check My Essay"}
</button>


{/* RESULT PANEL */}

{result && (

<div className="mt-10 bg-gray-800 p-6 rounded-lg">

<h2 className="text-2xl font-bold mb-4">
AI Evaluation
</h2>

<pre className="whitespace-pre-wrap text-gray-300">
{result}
</pre>

</div>

)}

</div>

)

}