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

const MATCH_RUBRIC = `
Score the resume against the job description using this exact 5-category rubric. Each category has a max points value. Add them up for the final matchScore (0-100).

CATEGORY 1 - Industry Proximity (max 20 points):
Compare the candidate's most recent company/role to the industry of the job description.
- Same industry, directly relevant company = 20 points
- Adjacent industry with transferable context = 10 points
- Different industry, minimal overlap = 0 points

CATEGORY 2 - Keyword and Skills Match (max 30 points):
Count exact matches AND meaningful synonyms between JD requirements and resume content.
- 80-100% of key JD skills/tools appear in resume = 30 points
- 50-79% match = 20 points
- 25-49% match = 10 points
- Under 25% match = 0 points

CATEGORY 3 - Seniority Alignment (max 20 points):
Compare the level of the role (individual contributor, manager, director, VP) to the candidate's current/most recent title and years of experience.
- Strong match in seniority level = 20 points
- One level off (slightly over or under qualified) = 10 points
- Significantly misaligned = 0 points

CATEGORY 4 - Required Tools and Tech (max 20 points):
Identify specific software, platforms, certifications, or technical skills the JD explicitly requires. Count how many appear in the resume.
- 75%+ of required tools present = 20 points
- 40-74% present = 12 points
- Under 40% present = 4 points
- None present = 0 points

CATEGORY 5 - Accomplishments Relevance (max 10 points):
Do the candidate's measurable results (revenue generated, CSAT scores, team size, growth metrics) map to what this role values?
- Strong, directly relevant accomplishments = 10 points
- Some relevant accomplishments = 5 points
- Generic or no measurable accomplishments = 0 points

After scoring all 5 categories, add the points. This total IS the matchScore.
Set recommendedLevel based on matchScore: 0-35 = "beginner", 36-69 = "some", 70-100 = "technical".`

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

    const resumeBlock = resume
      ? `Resume provided:\n"""\n${resume}\n"""\n\n${MATCH_RUBRIC}\n\nUsing the rubric above, score each category, sum the points, and set matchScore to the total. Set matchLabel based on score: 0-35 = "Complete beginner", 36-69 = "Some background knowledge", 70-100 = "Experienced & technical". Set yourStrengths to 3 specific bullets from the resume that directly map to JD requirements (reference actual titles, companies, metrics). Set skillGaps to 2-3 honest gaps where the JD requires something not evident in the resume. Set talkingPoints to 3 first-person interview statements that connect their background to this role. Set positioningSummary to a 2-sentence elevator pitch written in first person.`
      : 'No resume provided. Set hasResume:false, matchScore:0, recommendedLevel:"some", matchLabel:"Some background knowledge", all arrays empty, positioningSummary empty string.'

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
