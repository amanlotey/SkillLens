type GapResult = {
  candidate_core_skills?: string[]
  job_required_skills?: string[]
  skills_matched?: string[]
  skills_missing?: string[]
  priority_learning_plan?: { skill: string; why: string; starter_resources: string[] }[]
  notes?: string
}

export default function ResultsSection({ result }: { result: GapResult | null }) {
  if (!result) return null

  return (
    <section className="mt-8 space-y-6">
      <SkillChips title="Matched skills" items={result.skills_matched} tone="ok" />
      <SkillChips title="Missing skills" items={result.skills_missing} tone="warn" />

      {Array.isArray(result.priority_learning_plan) && result.priority_learning_plan.length > 0 && (
        <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white">
          <h3 className="font-semibold text-[#284B63] mb-3">Priority learning plan</h3>
          <ol className="list-decimal list-inside space-y-3">
            {result.priority_learning_plan.map((p, i) => (
              <li key={i}>
                <div className="font-bold text-[#353535]">{p.skill}</div>
                {p.why && <div className="text-gray-500 text-sm mt-1">{p.why}</div>}
                {p.starter_resources?.length > 0 && (
                  <ul className="list-disc list-inside text-[#284B63] text-sm mt-1">
                    {p.starter_resources.map((r, j) =>
                      r.startsWith('http') ? (
                        <li key={j}>
                          <a
                            href={r}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#3C6E71] break-words"
                          >
                            {r}
                          </a>
                        </li>
                      ) : (
                        <li key={j}>{r}</li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {result.notes && (
        <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white">
          <h3 className="font-semibold text-[#284B63] mb-2">Notes</h3>
          <p className="text-gray-500">{result.notes}</p>
        </div>
      )}

      <details className="text-sm mt-6">
        <summary className="cursor-pointer text-gray-500">Raw result JSON</summary>
        <pre className="bg-[#1f2937] text-gray-200 p-3 rounded-lg overflow-x-auto mt-2">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </section>
  )
}

function SkillChips({ title, items, tone }: { title: string; items?: string[]; tone: 'ok' | 'warn' }) {
  if (!items?.length) return null
  return (
    <div className="p-4 border border-[#D9D9D9] rounded-lg bg-white">
      <h3 className="font-semibold text-[#284B63] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((s, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full border text-sm ${
              tone === 'warn'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-[#EFF6F7] text-[#284B63] border-[#3C6E71]/30'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
