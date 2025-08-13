// src/lib/groqSkillGap.ts
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function getSkillsGap(resumeText: string, jobText: string) {
  const system = `You analyze a candidate's resume vs a job description and return ONLY JSON.
For each skill in "priority_learning_plan", the "starter_resources" must be direct clickable URLs (starting with https://), not just names.

Example output:
{
  "candidate_core_skills": ["JavaScript", "TypeScript"],
  "job_required_skills": ["AWS", "GraphQL"],
  "skills_matched": ["TypeScript"],
  "skills_missing": ["AWS", "GraphQL"],
  "priority_learning_plan": [
    {
      "skill": "AWS",
      "why": "Required for the job and important for cloud computing",
      "starter_resources": [
        "https://docs.aws.amazon.com",
        "https://www.youtube.com/results?search_query=aws+tutorials",
        "https://www.udemy.com/courses/search/?q=aws"
      ]
    }
  ],
  "notes": "Short summary here."
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
