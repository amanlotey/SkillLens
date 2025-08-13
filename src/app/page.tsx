'use client'

import { useMemo, useState } from 'react'
import { FiFileText, FiBriefcase, FiRefreshCw } from 'react-icons/fi'
import { FaSearch } from 'react-icons/fa'
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
    <div className="min-h-screen bg-gradient-to-br from-[#71cde4] to-[#435363] p-6">
      <main className="max-w-6xl mx-auto glass-card shadow-2xl p-10 animate-fadeIn">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-[#1f2937] leading-tight">
            Skills Gap <span className="text-[#3C6E71]">Analyzer</span>
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Paste your resume and the job description. 
            <span className="italic"> We’ll highlight overlaps, gaps, and provide a short learning plan.</span>
          </p>
        </header>

        {/* Inputs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume */}
          <div>
            <label htmlFor="resume" className="block font-semibold text-[#1f2937] mb-3 flex items-center gap-2">
              <FiFileText className="text-[#3C6E71]" /> Your Resume
            </label>
            <textarea
              id="resume"
              placeholder="Paste your resume..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={14}
              className="w-full border border-gray-300 rounded-xl p-4 text-sm resize-y 
                focus:outline-none focus:border-[#3C6E71] focus:ring-4 focus:ring-[#3C6E71]/20 
                text-black bg-[#f9fafb] shadow-inner"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Tip: remove images/tables; text works best.</span>
              <span>{chars.resume} chars</span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="jd" className="block font-semibold text-[#1f2937] mb-3 flex items-center gap-2">
              <FiBriefcase className="text-[#3C6E71]" /> Job Description
            </label>
            <textarea
              id="jd"
              placeholder="Paste the job description..."
              value={job}
              onChange={(e) => setJob(e.target.value)}
              rows={14}
              className="w-full border border-gray-300 rounded-xl p-4 text-sm resize-y 
                focus:outline-none focus:border-[#3C6E71] focus:ring-4 focus:ring-[#3C6E71]/20 
                text-black bg-[#f9fafb] shadow-inner"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Focus on responsibilities & required skills.</span>
              <span>{chars.job} chars</span>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <div className="flex gap-4 justify-end mt-8">
          <button
            onClick={analyze}
            disabled={loading || !resume.trim() || !job.trim()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
              loading || !resume.trim() || !job.trim()
                ? 'bg-[#3C6E71]/60 cursor-not-allowed'
                : 'bg-[#3C6E71] hover:bg-[#284B63] hover:shadow-xl'
            }`}
          >
            <FaSearch />
            {loading ? 'Analyzing…' : 'Analyze Skills Gap'}
          </button>
          <button
            onClick={clearAll}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gray-100 text-[#284B63] hover:bg-gray-200 transition-all duration-300 shadow-md disabled:opacity-60"
          >
            <FiRefreshCw />
            Clear
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 border border-red-300 bg-red-50 text-red-700 p-3 rounded-lg">
            <strong>Request failed:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && <ResultsSection result={result} />}
      </main>
    </div>
  )
}
