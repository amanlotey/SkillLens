'use client'

type Props = {
  resume: string
  job: string
  chars: { resume: string; job: string }
  setResume: (v: string) => void
  setJob: (v: string) => void
}

export default function TextAreas({ resume, job, chars, setResume, setJob }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Resume */}
      <div>
        <label htmlFor="resume" className="block font-semibold text-[#353535] mb-2">
          Your Resume
        </label>
        <textarea
          id="resume"
          placeholder="Paste your resume..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={14}
          className="w-full border border-[#D9D9D9] rounded-lg p-3 text-sm resize-y 
                     focus:outline-none text-black focus:border-[#3C6E71] focus:ring-2 focus:ring-[#3C6E71] bg-[#f7f9fa]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Tip: remove images/tables; text works best.</span>
          <span>{chars.resume} chars</span>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="jd" className="block font-semibold text-[#353535] mb-2">
          Job Description
        </label>
        <textarea
          id="jd"
          placeholder="Paste the job description..."
          value={job}
          onChange={(e) => setJob(e.target.value)}
          rows={14}
          className="w-full border border-[#D9D9D9] rounded-lg p-3 text-sm resize-y 
                     focus:outline-none text-black focus:border-[#3C6E71] focus:ring-2 focus:ring-[#3C6E71] bg-[#f7f9fa]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Focus on responsibilities & required skills.</span>
          <span>{chars.job} chars</span>
        </div>
      </div>
    </section>
  )
}
