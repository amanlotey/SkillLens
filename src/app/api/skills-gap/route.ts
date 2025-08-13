// src/app/api/skills-gap/route.ts
import { NextResponse } from 'next/server'
import { getSkillsGap } from '../../../../lib/groqSkillGap'

export async function POST(req: Request) {
  try {
    const { resume, job } = await req.json()

    if (!resume || !job) {
      return NextResponse.json({ error: 'Missing resume or job' }, { status: 400 })
    }

    const result = await getSkillsGap(resume, job)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Failed to analyze skills gap' },
      { status: 500 }
    )
  }
}
