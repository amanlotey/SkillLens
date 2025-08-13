'use client'
import { useMemo, useState } from 'react'

type GapResult = {
  candidate_core_skills?: string[]
  job_required_skills?: string[]
  skills_matched?: string[]
  skills_missing?: string[]
  priority_learning_plan?: { skill: string; why: string; starter_resources: string[] }[]
  notes?: string
  [key: string]: any
}

const COLORS = {
  bg: '#0e0f11',           // page background (very dark)
  card: '#FFFFFF',         // surface
  border: '#D9D9D9',
  text: '#353535',
  textMuted: '#6b7280',
  primary: '#3C6E71',      // teal
  primaryDark: '#284B63',  // deep blue
  chip: '#EFF6F7',
  danger: '#b91c1c',
  codeBg: '#1f2937',
}

export default function Page() {
  const [resume, setResume] = useState('')
  const [job, setJob] = useState('')
  const [result, setResult] = useState<GapResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chars = useMemo(() => ({
    resume: resume.length.toLocaleString(),
    job: job.length.toLocaleString()
  }), [resume, job])

  const handleAnalyze = async () => {
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

  const handleClear = () => {
    setResume('')
    setJob('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="page">
      <main className="shell">
        <header className="header">
          <h1>Skills Gap Analyzer</h1>
          <p>Paste your resume and the job description. We’ll highlight overlaps, gaps, and give a short learning plan.</p>
        </header>

        <section className="grid">
          <div className="field">
            <label htmlFor="resume">Your Resume</label>
            <textarea
              id="resume"
              placeholder="Paste your resume…"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={14}
            />
            <div className="hint">
              <span className="muted">Tip: remove images/tables; text works best.</span>
              <span className="count">{chars.resume} chars</span>
            </div>
          </div>

          <div className="field">
            <label htmlFor="jd">Job Description</label>
            <textarea
              id="jd"
              placeholder="Paste the job description…"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              rows={14}
            />
            <div className="hint">
              <span className="muted">Focus on responsibilities & required skills.</span>
              <span className="count">{chars.job} chars</span>
            </div>
          </div>
        </section>

        <div className="actions">
          <button
            className="btn primary"
            onClick={handleAnalyze}
            disabled={loading || !resume.trim() || !job.trim()}
            aria-busy={loading}
          >
            {loading ? 'Analyzing…' : 'Analyze Skills Gap'}
          </button>
          <button className="btn ghost" onClick={handleClear} disabled={loading && !result && !error}>
            Clear
          </button>
        </div>

        {error && (
          <div className="alert">
            <strong>Request failed:</strong> {error}
          </div>
        )}

        {result && (
          <section className="results">
            <ResultChips title="Matched skills" items={result.skills_matched} tone="ok" />
            <ResultChips title="Missing skills" items={result.skills_missing} tone="warn" />

            {Array.isArray(result.priority_learning_plan) && result.priority_learning_plan.length > 0 && (
              <div className="card">
                <h3>Priority learning plan</h3>
                <ol className="plan">
                  {result.priority_learning_plan.map((p, i) => (
                    <li key={i}>
                      <div className="plan-skill">{p.skill}</div>
                      {p.why && <div className="plan-why">{p.why}</div>}
                      {Array.isArray(p.starter_resources) && p.starter_resources.length > 0 && (
                        <ul className="resources">
                          {p.starter_resources.map((r, j) => <li key={j}>{r}</li>)}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {result.notes && (
              <div className="card">
                <h3>Notes</h3>
                <p className="muted">{result.notes}</p>
              </div>
            )}

            {/* Fallback raw JSON for debugging / unexpected keys */}
            <details className="raw">
              <summary>Raw result JSON</summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
          </section>
        )}
      </main>

      {/* Styles */}
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: ${COLORS.bg};
          padding: 48px 16px;
        }
        .shell {
          max-width: 1100px;
          margin: 0 auto;
          background: ${COLORS.card};
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .header h1 {
          color: ${COLORS.primaryDark};
          text-align: center;
          margin: 4px 0 8px;
          letter-spacing: 0.2px;
        }
        .header p {
          text-align: center;
          color: ${COLORS.textMuted};
          margin: 0 0 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 900px) {
          .grid { grid-template-columns: 1fr 1fr; }
        }

        .field { display: flex; flex-direction: column; }
        label {
          font-weight: 600;
          color: ${COLORS.text};
          margin: 4px 0 8px;
        }
        textarea {
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 0.98rem;
          line-height: 1.45;
          resize: vertical;
          transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
          background: #f7f9fa;
        }
        textarea:focus {
          outline: none;
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 3px rgba(60,110,113,.18);
          background: #fff;
        }
        .hint {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
        }
        .muted { color: ${COLORS.textMuted}; font-size: 0.9rem; }
        .count { color: ${COLORS.textMuted}; font-variant-numeric: tabular-nums; }

        .actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin: 16px 0 8px;
        }
        .btn {
          border: none;
          border-radius: 10px;
          padding: 12px 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .06s ease, background .2s ease, opacity .2s ease;
        }
        .btn:active { transform: translateY(1px); }
        .btn:disabled { cursor: not-allowed; opacity: .6; }

        .btn.primary {
          background: ${COLORS.primary};
          color: #fff;
          box-shadow: 0 8px 18px rgba(40,75,99,.18);
        }
        .btn.primary:hover:not(:disabled) { background: ${COLORS.primaryDark}; }

        .btn.ghost {
          background: #eef3f4;
          color: ${COLORS.primaryDark};
        }
        .btn.ghost:hover:not(:disabled) { background: #e3ecee; }

        .alert {
          margin-top: 12px;
          border: 1px solid rgba(185,28,28,.25);
          background: #fdecec;
          color: ${COLORS.danger};
          padding: 10px 12px;
          border-radius: 10px;
        }

        .results { display: grid; gap: 16px; margin-top: 18px; }
        .card {
          border: 1px solid ${COLORS.border};
          border-radius: 14px;
          padding: 16px;
          background: #fff;
        }
        .card h3 {
          margin: 0 0 10px;
          color: ${COLORS.primaryDark};
        }

        /* chips */
        .chipWrap { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip {
          padding: 6px 10px;
          border-radius: 9999px;
          background: ${COLORS.chip};
          color: ${COLORS.primaryDark};
          border: 1px solid rgba(60,110,113,.25);
          font-size: .9rem;
        }
        .chip.warn { background: #fff2f2; color: #8a1c1c; border-color: #f2c8c8; }

        /* ordered plan */
        .plan { margin: 0; padding-left: 20px; }
        .plan li { margin: 10px 0; }
        .plan-skill { font-weight: 700; color: ${COLORS.text}; }
        .plan-why { color: ${COLORS.textMuted}; margin: 4px 0 6px; }
        .resources { margin: 0; padding-left: 18px; color: ${COLORS.primaryDark}; }

        .raw summary { cursor: pointer; color: ${COLORS.textMuted}; margin-top: 6px; }
        .raw pre {
          background: ${COLORS.codeBg};
          color: #e5e7eb;
          padding: 12px;
          border-radius: 10px;
          overflow: auto;
          border: 1px solid rgba(0,0,0,.2);
        }
      `}</style>
    </div>
  )
}

/* ---------- Small result components ---------- */

function ResultChips({
  title,
  items,
  tone = 'ok'
}: {
  title: string
  items?: string[]
  tone?: 'ok' | 'warn'
}) {
  if (!items || items.length === 0) return null
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="chipWrap">
        {items.map((s, i) => (
          <span className={`chip ${tone === 'warn' ? 'warn' : ''}`} key={i}>{s}</span>
        ))}
      </div>
    </div>
  )
}
