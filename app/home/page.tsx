'use client'

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useRouter } from "next/navigation"

export default function HomePage() {

  const router = useRouter()
  const [loggedIn,setLoggedIn] = useState(false)

  useEffect(()=>{

    const getUser = async () => {

      const { data } = await supabase.auth.getUser()

      if(data.user){
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }

    }

    getUser()

  },[])

  const featureBtn =
    "bg-white text-blue-600 hover:text-blue-700 hover:-translate-y-[2px] hover:shadow-xl transition-all duration-200 p-4 rounded-xl shadow text-sm font-semibold flex items-center justify-center gap-2"

  const handleClick = async () => {

const { data } = await supabase.auth.getUser()

if(!data.user){
alert("Please sign up first.")
router.push("/auth/login")
return
}

router.push("/dashboard")

}

  return (

    <main className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <aside className="w-64 bg-white border-r flex flex-col justify-between">

        <div className="p-6">

          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🎓</span>
            <h1 className="text-lg font-semibold text-gray-800">
              IELTS CDI
            </h1>
          </div>
  {/* 🔥 PROFILE BLOCK */}

<div className="flex flex-col items-center mt-6">

  <img
    src="student.png"
    alt="profile"
    className="w-20 h-20 rounded-full object-cover border mb-3 shadow"
  />

  <p className="text-sm font-semibold text-gray-800 text-center">
    Jasurbek Abdullayev
  </p>

  <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed px-2">
    The creator of this website is an IELTS instructor helping students achieve Band 7+ through structured practice and real exam strategies.
  </p>

</div>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* HERO */}

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 text-center">

          <h2 className="text-lg font-semibold">
            Welcome to Niners Arena!
          </h2>

          {!loggedIn && (

            <p className="mt-3 text-sm">
              To use our website, please sign up first
            </p>

          )}

        </div>

        {/* CONTENT */}

        <div className="flex-1 flex flex-col items-center justify-center p-10">

          <h3 className="text-lg font-semibold mb-10 text-gray-700">
            The most popular features
          </h3>

          <div className="grid grid-cols-3 gap-6 max-w-3xl w-full">

            <button onClick={handleClick} className={featureBtn}>
              📖 Learn Vocabulary
            </button>

            <button onClick={handleClick} className={featureBtn}>
              🎧 Listening Practice
            </button>

            <button onClick={handleClick} className={featureBtn}>
              📚 Reading Practice
            </button>

            <button onClick={handleClick} className={featureBtn}>
              ✍️ Writing Practice
            </button>

            <button onClick={handleClick} className={featureBtn}>
              ⭐ Band 9.0 Samples
            </button>

            <button onClick={handleClick} className={featureBtn}>
              📝 Take a Full Mock
            </button>

            <button onClick={handleClick} className={featureBtn}>
              📦 My Special Prep Materials
            </button>

            <button
              onClick={handleClick}
              className={`${featureBtn} col-span-3`}
            >
              🎤 Speaking Practice
            </button>

          </div>

        </div>

        {/* FOOTER */}

        <footer className="text-center text-sm text-gray-500 pb-10 px-6">

          <p>© 2025 IELTS CDI Platform</p>

          <p className="mt-2 max-w-3xl mx-auto text-xs leading-relaxed">
            This is an independent English language practice platform.
          </p>

        </footer>

      </div>

    </main>

  )
}