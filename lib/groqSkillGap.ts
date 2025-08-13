// src/lib/groqSkillGap.ts
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function getSkillsGap(resumeText: string, jobText: string) {
  const system = `You analyze a candidate resume vs a job description and return ONLY JSON.
{
  "candidate_core_skills": string[],
  "job_required_skills": string[],
  "skills_matched": string[],
  "skills_missing": string[],
  "priority_learning_plan": [
    { "skill": string, "why": string, "starter_resources": string[] }
  ],
  "notes": string
}`

  const user = `[RESUME]
${resumeText}

[JOB_DESCRIPTION]
${jobText}`

  const resp = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_completion_tokens: 900,
  })

  const content = resp.choices[0].message?.content || '{}'
  return JSON.parse(content)
}
