'use client'

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"

type TestResult = {
  test_id: number
  score: number | null
}

export default function ReadingSetPage() {

  const router = useRouter()
  const params = useParams()

  // setId is the first test number in the package (1, 11, 21, 31...)
  const startId = Number(params.id)
  const endId = startId + 9
  const packageNumber = Math.ceil(startId / 10)

  const [results, setResults] = useState<Record<number, TestResult>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        router.replace("/auth/login")
        return
      }

      const { data } = await supabase
        .from("test_results")
        .select("test_id, score")
        .eq("user_id", authData.user.id)
        .eq("test_type", "reading")
        .gte("test_id", startId)
        .lte("test_id", endId)

      if (data) {
        const map: Record<number, TestResult> = {}
        data.forEach((r) => { map[r.test_id] = r })
        setResults(map)
      }

      setLoading(false)
    }

    fetchResults()
  }, [startId, endId, router])

  // Correct global test IDs: e.g. startId=11 → [11,12,13...20]
  const tests = Array.from({ length: 10 }, (_, i) => startId + i)
  const doneCount = tests.filter(id => results[id]).length

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/practice/reading")}
          className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-1.5 rounded-lg hover:border-gray-300 transition"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-medium text-gray-900">
            Package {packageNumber} · Reading
          </h1>
          <p className="text-sm text-gray-400">Tests {startId} – {endId}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.round((doneCount / 10) * 100)}%` }}
            />
          </div>
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {doneCount} / 10 done
          </span>
        </div>
      </div>

      {/* Test grid */}
      <div className="grid grid-cols-5 gap-3">
        {tests.map((testId) => {
          const result = results[testId]
          const done = !!result

          return (
            <div
              key={testId}
              onClick={() => router.push(`/practice/reading/${testId}`)}
              className={`
                bg-white rounded-2xl border p-4 flex flex-col gap-3 cursor-pointer transition
                ${done
                  ? "border-emerald-200 hover:border-emerald-300"
                  : "border-gray-100 hover:border-gray-200"
                }
              `}
            >
              <p className="text-sm font-medium text-gray-900">Test {testId}</p>
              <div className="flex items-center justify-between">
                {done ? (
                  <>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Done
                    </span>
                    {result.score !== null && (
                      <span className="text-xs text-gray-400">
                        {result.score}/40
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    New
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
