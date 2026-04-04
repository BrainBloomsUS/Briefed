import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { SYSTEM_PROMPT, DEPTH_INSTRUCTIONS, AUDIENCE_INSTRUCTIONS } from '@/lib/constants'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function repairJSON(raw: string): string {
  let text = raw.replace(/```json|```/g, '').trim()
  try { JSON.parse(text); return text } catch {}

  let braces = 0, brackets = 0, inString = false, escape = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (escape) { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{') braces++
    if (ch === '}') braces--
    if (ch === '[') brackets++
    if (ch === ']') brackets--
  }

  if (inString) {
    const lastComma = text.lastIndexOf(',')
    const lastClose = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'))
    text = text.slice(0, Math.max(lastComma, lastClose) + 1)
    braces = 0; brackets = 0; inString = false; escape = false
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (escape) { escape = false; continue }
      if (ch === '\\' && inString) { escape = true; continue }
      if (ch === '"') { inString = !inString; continue }
      if (inString) continue
      if (ch === '{') braces++
      if (ch === '}') braces--
      if (ch === '[') brackets++
      if (ch === ']') brackets--
    }
  }

  text = text.trimEnd().replace(/,\s*$/, '')
  while (brackets > 0) { text += ']'; brackets-- }
  while (braces > 0) { text += '}'; braces-- }
  return text
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, depth = 'standard', audience = 'some', resumeText = '' } = await req.json()

    if (!jobDescription || jobDescription.trim().length < 60) {
      return new Response(JSON.stringify({ error: 'Job description too short.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }

    const hasResume = resumeText && resumeText.trim().length > 100
    const jdCapped = jobDescription.trim().slice(0, 4000)
    const resumeCapped = hasResume ? resumeText.trim().slice(0, 3000) : ''

    const resumeSection = hasResume
      ? `\n\nRESUME PROVIDED:\n"""\n${resumeCapped}\n"""\nCalculate matchScore, recommendedLevel, yourStrengths, skillGaps, talkingPoints, positioningSummary.`
      : '\n\nNO RESUME: set hasResume false, matchScore 0, empty arrays.'

    const userMessage = `${DEPTH_INSTRUCTIONS[depth] || DEPTH_INSTRUCTIONS.standard}
${AUDIENCE_INSTRUCTIONS[audience] || AUDIENCE_INSTRUCTIONS.some}${resumeSection}

Job description:
${jdCapped}`

    // Use streaming to keep connection alive — avoids serverless timeout
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 12000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        let full = ''
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              full += chunk.delta.text
              // Stream raw text to keep connection alive
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('Generate error:', err)
    return new Response(
      JSON.stringify({ error: 'Generation failed. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
