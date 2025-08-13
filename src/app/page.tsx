'use client'

import { useMemo, useState } from 'react'
import Header from '@/components/Header'
import TextAreas from '@/components/TextAreas'
import ResultsSection from '@/components/ResultSection'

type GapResult = {
  candidate_core_skills?: string[]
  job_required_skills?: string[]
  skills_matched?: string[]
  skills_missing?: string[]
  priority_learning_plan?: { skill: string; why: string; starter_resources: string[] }[]
  notes?: string
  [key: string]: any
}


export default function Page() {
  const [resume, setResume] = useState('')
  const [job, setJob] = useState('')
  const [result, setResult] = useState<GapResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chars = useMemo(
    () => ({ resume: resume.length.toLocaleString(), job: job.length.toLocaleString() }),
    [resume, job]
  )

  const analyze = async () => {
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/skills-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, job }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Request failed')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => { setResume(''); setJob(''); setResult(null); setError(null) }

  return (
    <div className="min-h-screen bg-[#353535] p-6">
      <main className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl border border-[#D9D9D9] p-8">
        <Header />

        <TextAreas
          resume={resume}
          job={job}
          chars={chars}
          setResume={setResume}
          setJob={setJob}
        />

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={analyze}
            disabled={loading || !resume.trim() || !job.trim()}
            className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md transition 
              ${loading || !resume.trim() || !job.trim()
                ? 'bg-[#3C6E71]/60 cursor-not-allowed'
                : 'bg-[#3C6E71] hover:bg-[#284B63]'}`}
          >
            {loading ? 'Analyzing…' : 'Analyze Skills Gap'}
          </button>
          <button
            onClick={clearAll}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-[#284B63] hover:bg-gray-200 disabled:opacity-60"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-4 border border-red-300 bg-red-50 text-red-700 p-3 rounded-lg">
            <strong>Request failed:</strong> {error}
          </div>
        )}

        {result && <ResultsSection result={result} />}
      </main>
    </div>
  )
}
