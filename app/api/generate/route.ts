import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { SYSTEM_PROMPT, DEPTH_INSTRUCTIONS, AUDIENCE_INSTRUCTIONS } from '@/lib/constants'

export const maxDuration = 120

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, depth = 'standard', audience = 'some', resumeText = '' } = await req.json()

    if (!jobDescription || jobDescription.trim().length < 60) {
      return new Response(JSON.stringify({ error: 'Job description too short — please include more detail.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hasResume = resumeText && resumeText.trim().length > 100

    // Build the user message — resume enriches the prompt significantly
    const resumeSection = hasResume
      ? `\n\nRESUME PROVIDED — perform full personalized analysis:\n"""\n${resumeText.trim().slice(0, 6000)}\n"""\n\nBased on this resume vs the job description: calculate matchScore (0-100), set recommendedLevel, identify yourStrengths (specific experiences that map to this JD), skillGaps (what JD requires that resume lacks), talkingPoints (first-person interview statements), and positioningSummary (elevator pitch).`
      : '\n\nNO RESUME PROVIDED — set hasResume to false, matchScore to 0, empty arrays for resume fields.'

    const userMessage = `${DEPTH_INSTRUCTIONS[depth] || DEPTH_INSTRUCTIONS.standard}
${AUDIENCE_INSTRUCTIONS[audience] || AUDIENCE_INSTRUCTIONS.some}${resumeSection}

Job description:
${jobDescription.trim()}`

    const stream = client.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
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
