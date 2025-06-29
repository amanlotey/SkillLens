'use client'

import React, { useState } from 'react'
import ResultDisplay from './ResultDisplay'

const SkillStackForm = () => {
  const [resume, setResume] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const handleTextChange = (e) => {
    setResume(e.target.value)
    setFormError('')
    setResults(null)
  }

  const handleAnalyze = async () => {
    if (resume.trim().length < 10) {
      setFormError('Please paste a complete resume')
      return
    }
    if (jobTitle.trim().length < 3) {
      setFormError('Please enter a valid job title')
      return
    }

    setFormError('')
    setLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobTitle }),
      })

      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        setFormError(data.error || 'Something went wrong. Try again.')
      }
    } catch (error) {
      console.error('❌ Error analyzing:', error)
      setFormError('An unexpected error occurred. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 text-[#f8f8f8]">
      <h1 className="text-3xl font-bold text-center text-[#e37c3c]">SkillStack AI</h1>

      <div className="space-y-4">
        <textarea
          className="w-full h-40 p-3 bg-[#171721] text-white rounded border border-[#872B97] focus:outline-none focus:ring-2 focus:ring-[#FF3C68]"
          placeholder="Paste your resume here..."
          value={resume}
          onChange={handleTextChange}
        />

        <input
          className="w-full p-3 bg-[#171721] text-white rounded border border-[#872B97] focus:outline-none focus:ring-2 focus:ring-[#FF3C68]"
          type="text"
          placeholder="Enter target job title (e.g., QA Engineer)"
          value={jobTitle}
          onChange={(e) => {
            setJobTitle(e.target.value)
            setFormError('')
            setResults(null)
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-[#FF7130] hover:bg-[#FF3C68] transition-all text-white px-6 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {formError && (
          <p className="text-[#FF3C68] mt-2 text-sm">{formError}</p>
        )}
      </div>

      {results && (
        <ResultDisplay
          missingSkills={results.missingSkills}
          recommendedCourses={results.recommendedCourses}
        />
      )}
    </div>
  )
}

export default SkillStackForm
