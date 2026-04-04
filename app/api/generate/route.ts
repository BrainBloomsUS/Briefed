import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { AUDIENCE_INSTRUCTIONS } from '@/lib/constants'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

async function callClaude(prompt: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })
  return msg.content.map((b: {type: string; text?: string}) => b.type === 'text' ? b.text || '' : '').join('')
}

function cleanJSON(raw: string): string {
  const s = raw.indexOf('{')
  const e = raw.lastIndexOf('}')
  if (s === -1 || e === -1) return raw
  return raw.slice(s, e + 1)
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, depth = 'standard', audience = 'some', resumeText = '' } = await req.json()
    if (!jobDescription || jobDescription.trim().length < 60) {
      return new Response(JSON.stringify({ error: 'Job description too short.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }
    const jd = jobDescription.trim().slice(0, 4000)
    const resume = resumeText && resumeText.trim().length > 100 ? resumeText.trim().slice(0, 3000) : ''
    const audienceNote = AUDIENCE_INSTRUCTIONS[audience] || AUDIENCE_INSTRUCTIONS.some
    const courseCount = depth === 'quick' ? 3 : depth === 'deep' ? 6 : 4
    const hasResumeVal = resume ? 'true' : 'false'
    const resumeBlock = resume ? 'Resume: ' + resume + ' Set hasResume:true, matchScore 0-100, recommendedLevel (beginner/some/technical), matchLabel, yourStrengths (3 bullets), skillGaps (2-3), talkingPoints (3 first-person), positioningSummary (2 sentences).' : 'No resume. Set hasResume:false, matchScore:0, empty arrays.'

    const [call1Raw, call2Raw] = await Promise.all([
      callClaude('Career coach. Return ONLY raw JSON starting with { ending with }, no markdown no backticks. ' + audienceNote + ' Job: ' + jd + ' ' + resumeBlock + ' JSON: {"company":"","role":"","industry":"","overview":"2 sentences","keySkills":["s1","s2","s3","s4","s5"],"resumeAnalysis":{"hasResume":' + hasResumeVal + ',"matchScore":0,"recommendedLevel":"some","matchLabel":"Some background knowledge","yourStrengths":[],"skillGaps":[],"talkingPoints":[],"positioningSummary":""},"courses":[{"code":"101","title":"","subtitle":"","sections":[{"type":"prose","heading":"","content":"2 sentences"},{"type":"bullets","heading":"Key points","items":["p1","p2","p3"]}]}]} Make exactly ' + courseCount + ' courses each with exactly 2 sections. SHORT text only.'),
      callClaude('Career coach. Return ONLY raw JSON starting with { ending with }, no markdown no backticks. Job: ' + jd + ' JSON: {"competitorTable":{"competitors":["C1","C2","C3"],"rows":[{"category":"cat","company":"what they offer","competitor1":"c1 offer","competitor2":"c2 offer","competitor3":"c3 offer"}]},"careerTips":["tip1","tip2","tip3","tip4"],"glossary":[{"term":"TERM","fullForm":"Full Form","definition":"one sentence"}]} Make exactly 6 competitor rows, exactly 4 career tips, exactly 12 glossary terms.')
    ])

    const part1 = JSON.parse(cleanJSON(call1Raw))
    const part2 = JSON.parse(cleanJSON(call2Raw))
    const merged = { ...part1, ...part2 }

    return new Response(JSON.stringify(merged), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Generate error:', err)
    return new Response(JSON.stringify({ error: 'Generation failed. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
