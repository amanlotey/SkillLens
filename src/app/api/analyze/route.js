import { formatAiResponse } from '../../../../lib/formatAiResponse.js'

export async function POST(req) {
  const { resume, jobTitle } = await req.json()

  if (!resume || !jobTitle) {
    return Response.json({ error: 'Missing resume or job title' }, { status: 400 })
  }

  const prompt = `Given the resume:\n${resume}\nand the target job title: ${jobTitle}, list some missing skills and some recommended courses. Format:\nMissing Skills:\nRecommended Courses:`

  try {
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    )

    if (!hfRes.ok) {
      const errText = await hfRes.text()
      console.error('Hugging Face API error:', errText)
      return Response.json({ error: 'Hugging Face API failed', details: errText }, { status: 500 })
    }

    const data = await hfRes.json()
    const rawText = data[0]?.generated_text || ''
    console.log('[DEBUG] Hugging Face response:', rawText)

    const formatted = formatAiResponse(rawText)

    return Response.json(formatted)
  } catch (error) {
    console.error('Server Error:', error)
    return Response.json({ error: 'Unexpected server error', details: error.message }, { status: 500 })
  }
}
