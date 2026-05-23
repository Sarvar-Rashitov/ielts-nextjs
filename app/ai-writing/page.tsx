'use client'

import { useRouter } from "next/navigation"

export default function AIWritingPage() {

const router = useRouter()

return (

<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col items-center justify-center p-10">

<h1 className="text-4xl font-extrabold mb-4">
AI Writing Correction
</h1>

<p className="text-gray-400 mb-12 text-center max-w-xl">
Choose which IELTS writing task you want the AI to evaluate.
Upload your Task 1 chart or write your Task 2 essay and receive
a detailed band score analysis.
</p>

<div className="grid md:grid-cols-2 gap-10">

{/* TASK 1 */}

<div
onClick={()=>router.push("/ai-writing/task1")}
className="bg-white text-black font-bold px-10 py-8 rounded-xl text-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition text-center"
>

<h2 className="text-2xl mb-3">
IELTS Writing Task 1
</h2>

<p className="text-gray-700 text-sm font-normal">
Upload your chart image and write your report.
AI will analyse your response like a real IELTS examiner.
</p>

</div>


{/* TASK 2 */}

<div
onClick={()=>router.push("/ai-writing/task2")}
className="bg-white text-black font-bold px-10 py-8 rounded-xl text-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition text-center"
>

<h2 className="text-2xl mb-3">
IELTS Writing Task 2
</h2>

<p className="text-gray-700 text-sm font-normal">
Write your essay and receive a detailed band score,
feedback, and improvement suggestions.
</p>

</div>

</div>


{/* BACK BUTTON */}

<button
onClick={()=>router.push("/dashboard")}
className="mt-12 text-gray-400 hover:text-white transition"
>
← Back to Dashboard
</button>

</div>

)

}