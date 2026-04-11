'use client'
import { useState, useRef, useCallback } from 'react'
import type { GuideData, GuideCourse, GuideSection, GenerationStatus, ResumeAnalysis } from '@/lib/types'
import { EXAMPLE_JDS } from '@/lib/constants'
import { useCredits } from '@/lib/useCredits'

// ── Icons (inline SVG components) ────────────────────────────
const Icon = {
  Chevron: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Sparkle: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8z" />
    </svg>
  ),
  Download: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  BookOpen: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Zap: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Target: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Users: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ArrowRight: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Check: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Share: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Star: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
}

// ── Your Edge — Resume Analysis Section ──────────────────────
function YourEdge({ analysis, role, company }: { analysis: ResumeAnalysis; role: string; company: string }) {
  const [tpOpen, setTpOpen] = useState(false)
  if (!analysis?.hasResume) return null

  const scoreColor = analysis.matchScore >= 70 ? '#52D9C1' : analysis.matchScore >= 40 ? '#F0C040' : '#F08080'
  const levelColors: Record<string, string> = {
    technical: 'rgba(82,217,193,0.25)',
    some: 'rgba(240,192,64,0.25)',
    beginner: 'rgba(240,128,128,0.25)',
  }

  return (
    <div className="edge-card fade-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div className="edge-label">Your Edge</div>
          <div className="edge-title">Personalized Brief — {role} @ {company}</div>
          <div className="edge-subtitle">Based on your resume cross-referenced against this job description</div>
        </div>
        <div style={{ background: levelColors[analysis.recommendedLevel] || 'rgba(255,255,255,0.1)', border: `1px solid ${scoreColor}40`, borderRadius: 'var(--r-full)', padding: '6px 14px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Recommended level</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: scoreColor }}>{analysis.matchLabel}</div>
        </div>
      </div>

      {/* Match score bar */}
      <div style={{ marginBottom: 20 }}>
        <div className="match-score-row">
          <div>
            <div className="match-score-num" style={{ color: scoreColor }}>{analysis.matchScore}%</div>
            <div className="match-score-label">Resume match to job description</div>
          </div>
          <div className="match-badge" style={{ borderColor: `${scoreColor}40`, color: scoreColor, background: `${scoreColor}15` }}>
            {analysis.matchScore >= 70 ? 'Strong match' : analysis.matchScore >= 40 ? 'Partial match' : 'Growth opportunity'}
          </div>
        </div>
        <div className="match-bar-wrap">
          <div className="match-bar-fill" style={{ width: `${analysis.matchScore}%`, background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})` }} />
        </div>
      </div>

      {/* Strengths + Gaps grid */}
      {(analysis.yourStrengths?.length > 0 || analysis.skillGaps?.length > 0) && (
        <div className="edge-grid">
          {analysis.yourStrengths?.length > 0 && (
            <div className="edge-panel">
              <div className="edge-panel-title green">✓ Your strengths for this role</div>
              {analysis.yourStrengths.map((s, i) => (
                <div className="edge-item" key={i}>
                  <div className="edge-dot-green" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
          {analysis.skillGaps?.length > 0 && (
            <div className="edge-panel">
              <div className="edge-panel-title amber">→ Areas to address</div>
              {analysis.skillGaps.map((g, i) => (
                <div className="edge-item" key={i}>
                  <div className="edge-dot-amber" />
                  <span>{g}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Talking points */}
      {analysis.talkingPoints?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: tpOpen ? 10 : 0 }}
            onClick={() => setTpOpen(o => !o)}
          >
            <div className="edge-panel-title green" style={{ margin: 0 }}>Interview talking points ({analysis.talkingPoints.length})</div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{tpOpen ? '▲ hide' : '▼ show'}</span>
          </div>
          {tpOpen && (
            <div className="talking-points-panel fade-in">
              {analysis.talkingPoints.map((tp, i) => (
                <div className="talking-point" key={i}>
                  <div className="tp-num">{i + 1}</div>
                  <span>{tp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Elevator pitch */}
      {analysis.positioningSummary && (
        <div>
          <div className="edge-panel-title green" style={{ marginBottom: 8 }}>Your elevator pitch for this role</div>
          <div className="positioning-box">"{analysis.positioningSummary}"</div>
        </div>
      )}
    </div>
  )
}

// ── Resume Upload Component ───────────────────────────────────
function ResumeUpload({ onResumeParsed, resumeFileName }: {
  onResumeParsed: (text: string, fileName: string) => void
  resumeFileName: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [parsing, setParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractText = async (file: File): Promise<string> => {
    // Read as text for text-based PDFs and .txt files
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const raw = e.target?.result as string
        // Strip PDF binary/non-printable characters, keep readable text
        const cleaned = raw
          .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        resolve(cleaned.length > 100 ? cleaned : raw)
      }
      reader.readAsText(file, 'utf-8')
    })
  }

  const handleFile = async (file: File) => {
    if (!file) return
    const validTypes = ['application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const validExt = /\.(pdf|txt|doc|docx)$/i.test(file.name)
    if (!validTypes.includes(file.type) && !validExt) {
      alert('Please upload a PDF, Word document, or text file.')
      return
    }
    setParsing(true)
    try {
      const text = await extractText(file)
      onResumeParsed(text, file.name)
    } catch {
      alert('Could not read the file. Try a .txt or copy-paste your resume text.')
    } finally {
      setParsing(false)
    }
  }

  const hasFile = !!resumeFileName

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        Resume <span style={{ background: 'var(--accent)', color: 'white', fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, marginLeft: 6, letterSpacing: '0.04em', verticalAlign: 'middle' }}>UNLOCK PERSONALIZATION</span>
      </label>

      {/* Value prop strip */}
      {!resumeFileName && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
          {[
            { icon: 'track_changes', text: 'See how your skills map to the role' },
            { icon: 'record_voice_over', text: 'Get interview talking points written for you' },
            { icon: 'insights', text: 'Know exactly where to focus your prep' },
          ].map(item => (
            <div key={item.text} style={{ background: 'var(--brand-faint)', border: '1px solid var(--brand-light)', borderRadius: 'var(--r-sm)', padding: '8px 10px', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
              <span className="mat-icon" style={{ fontSize: '16px', color: 'var(--brand-mid)', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className={`upload-zone ${isDragging ? 'drag-over' : ''} ${hasFile ? 'has-file' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault(); setIsDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        {parsing ? (
          <>
            <div style={{ width: 20, height: 20, border: '2px solid var(--brand-light)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
            <div className="upload-text">Reading your resume...</div>
          </>
        ) : hasFile ? (
          <>
            <span className="mat-icon" style={{ color: 'var(--accent)', fontSize: '28px', display: 'block', marginBottom: 6 }}>check_circle</span>
            <div className="upload-success">{resumeFileName}</div>
            <div className="upload-sub" style={{ color: 'var(--accent-dark)', marginTop: 4 }}>Resume loaded — your brief will be fully personalized</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 6 }}>Click to swap file</div>
          </>
        ) : (
          <>
            <span className="mat-icon" style={{ color: 'var(--brand)', fontSize: '28px', display: 'block', marginBottom: 6 }}>upload_file</span>
            <div className="upload-text">Drop your resume here or click to browse</div>
            <div className="upload-sub" style={{ marginTop: 5 }}>
              PDF, Word, or .txt &nbsp;·&nbsp; Up to 4,000 characters of resume content used &nbsp;·&nbsp; Your resume stays private and is never stored
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Section renderer ─────────────────────────────────────────
function SectionBlock({ section }: { section: GuideSection }) {
  const calloutClass = {
    tip: 'callout-tip',
    warning: 'callout-warning',
    info: 'callout-info',
  }[section.calloutType || 'tip']

  const calloutIcon = { tip: '💡', warning: '⚠️', info: 'ℹ️' }[section.calloutType || 'tip']

  return (
    <div>
      {section.heading && (
        <div className="section-label">
          <span>{section.heading}</span>
        </div>
      )}

      {section.type === 'prose' && (
        <div className="prose-content">
          <p>{section.content}</p>
        </div>
      )}

      {section.type === 'callout' && (
        <div className={`callout ${calloutClass}`}>
          <span style={{ fontSize: '1rem', flexShrink: 0 }}>{calloutIcon}</span>
          <span>{section.content}</span>
        </div>
      )}

      {section.type === 'bullets' && (
        <div className="prose-content">
          <ul>
            {(section.items as string[])?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {section.type === 'termsBold' && (
        <div>
          {(section.items as { term: string; definition: string }[])?.map((item, i) => (
            <div className="term-row" key={i}>
              <span className="term-key">{item.term}</span>
              <span className="term-def">{item.definition}</span>
            </div>
          ))}
        </div>
      )}

      {section.type === 'table' && (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {section.columns?.map((col, i) => <th key={i}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {section.rows?.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => <td key={j}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Course card ───────────────────────────────────────────────
function CourseCard({ course, index, defaultOpen }: { course: GuideCourse; index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const colors = ['#1B4F72','#148F77','#1A5276','#7D6608','#6C3483','#0E6655','#1F618D','#B7770D','#117A65','#5B2C6F','#154360','#784212']
  const color = colors[index % colors.length]

  return (
    <div className={`course-card fade-up ${open ? 'open' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="course-header" onClick={() => setOpen(o => !o)} role="button" aria-expanded={open}>
        <div className="course-num" style={{ background: color }}>
          {course.code}
        </div>
        <div className="course-meta">
          <div className="course-title">{course.title}</div>
          <div className="course-subtitle">{course.subtitle}</div>
        </div>
        <div className="course-chevron">
          <Icon.Chevron size={18} />
        </div>
      </div>

      {open && (
        <div className="course-body fade-in">
          {course.sections?.map((sec, i) => (
            <SectionBlock key={i} section={sec} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Competitor section ────────────────────────────────────────
function CompetitorSection({ guide }: { guide: GuideData }) {
  const [open, setOpen] = useState(false)
  if (!guide.competitorTable?.rows?.length) return null
  return (
    <div className={`course-card fade-up ${open ? 'open' : ''}`}>
      <div className="course-header" onClick={() => setOpen(o => !o)} role="button">
        <div className="course-num" style={{ background: '#1E3A5F', fontSize: '0.6rem' }}>VS</div>
        <div className="course-meta">
          <div className="course-title">Head-to-head competitor analysis</div>
          <div className="course-subtitle">Product-by-product replacement table — {guide.competitorTable.rows.length} categories</div>
        </div>
        <div className="course-chevron"><Icon.Chevron size={18} /></div>
      </div>
      {open && (
        <div className="course-body fade-in">
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th style={{ background: '#16A34A' }}>{guide.company}</th>
                  {guide.competitorTable.competitors.map(c => <th key={c}>{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {guide.competitorTable.rows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.category}</td>
                    <td style={{ color: '#15803D', fontWeight: 600 }}>{row.company}</td>
                    {guide.competitorTable.competitors.map((_, j) => (
                      <td key={j}>{row[`competitor${j + 1}` as keyof typeof row] || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Career tips ───────────────────────────────────────────────
function CareerSection({ tips }: { tips: string[] }) {
  const [open, setOpen] = useState(false)
  if (!tips?.length) return null
  return (
    <div className={`course-card fade-up ${open ? 'open' : ''}`}>
      <div className="course-header" onClick={() => setOpen(o => !o)} role="button">
        <div className="course-num" style={{ background: '#B7770D', fontSize: '0.6rem' }}>
          <span className="mat-icon" style={{ fontSize: '16px', color: 'white' }}>workspace_premium</span>
        </div>
        <div className="course-meta">
          <div className="course-title">Career strategy & role-specific tips</div>
          <div className="course-subtitle">{tips.length} actionable tips for this exact position</div>
        </div>
        <div className="course-chevron"><Icon.Chevron size={18} /></div>
      </div>
      {open && (
        <div className="course-body fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: 800 }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Glossary ──────────────────────────────────────────────────
function GlossarySection({ entries }: { entries: GuideData['glossary'] }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  if (!entries?.length) return null
  const filtered = entries.filter(e =>
    search === '' ||
    e.term.toLowerCase().includes(search.toLowerCase()) ||
    e.definition.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className={`course-card fade-up ${open ? 'open' : ''}`}>
      <div className="course-header" onClick={() => setOpen(o => !o)} role="button">
        <div className="course-num" style={{ background: '#1F618D', fontSize: '0.6rem' }}>A-Z</div>
        <div className="course-meta">
          <div className="course-title">Glossary — acronyms & industry terms</div>
          <div className="course-subtitle">{entries.length} terms defined in plain English</div>
        </div>
        <div className="course-chevron"><Icon.Chevron size={18} /></div>
      </div>
      {open && (
        <div className="course-body fade-in">
          <input
            className="input"
            placeholder="Search terms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
            style={{ marginBottom: 8 }}
          />
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No terms match your search</div>
            ) : (
              filtered.map((g, i) => (
                <div className="gloss-entry" key={i} style={{ background: i % 2 === 0 ? 'white' : 'var(--bg)' }}>
                  <div>
                    <div className="gloss-term">{g.term}</div>
                    <div className="gloss-full">{g.fullForm}</div>
                  </div>
                  <div className="gloss-def">{g.definition}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Guide header card ─────────────────────────────────────────
function GuideHeader({ guide, onExport, onReset }: { guide: GuideData; onExport: () => void; onReset: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="card-elevated fade-up" style={{ padding: '28px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            {guide.industry}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 4 }}>
            {guide.role}
          </h2>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--brand)', marginBottom: 14 }}>
            @ {guide.company}
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
            {guide.overview}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {guide.keySkills?.map(skill => (
              <span className="skill-tag" key={skill}>{skill}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button className="btn btn-primary btn-sm" onClick={onExport}>
            <Icon.Download size={14} />
            Export DOCX + PDF
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleShare}>
            {copied ? <Icon.Check size={14} /> : <Icon.Share size={14} />}
            {copied ? 'Link copied!' : 'Copy link'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onReset} style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
            ← Start a new brief
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 20 }} className="stats-grid">
        {[
          { n: guide.courses?.length || 0, l: 'Courses' },
          { n: guide.competitorTable?.rows?.length || 0, l: 'Competitor rows' },
          { n: guide.glossary?.length || 0, l: 'Glossary terms' },
          { n: guide.careerTips?.length || 0, l: 'Career tips' },
        ].map(s => (
          <div className="stat-card" key={s.l}>
            <div className="stat-number">{s.n}</div>
            <div className="stat-label">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Loading state ─────────────────────────────────────────────
const STATUS_MESSAGES = [
  'Analyzing the job description...',
  'Identifying the company and industry...',
  'Researching products and tech stack...',
  'Structuring your brief...',
  'Writing deep-dive content...',
  'Mapping the competitor landscape...',
  'Compiling the glossary...',
  'Adding career strategy...',
  'Almost ready...',
]

function LoadingState({ status }: { status: string }) {
  const [elapsed, setElapsed] = useState(0)
  const spinnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Speed ramps from 1.4s per rotation down to 0.4s as time passes (max 60s)
  const progress = Math.min(elapsed / 60, 1)
  const duration = 1.4 - progress * 1.0  // 1.4s → 0.4s

  useEffect(() => {
    if (spinnerRef.current) {
      spinnerRef.current.style.animationDuration = `${duration.toFixed(2)}s`
    }
  }, [duration])

  return (
    <div className="loading-card fade-in" style={{ padding: '48px 32px' }}>
      <div
        ref={spinnerRef}
        className="rainbow-spinner"
        style={{
          width: 56,
          height: 56,
          margin: '0 auto 20px',
          animation: `rainbow-rotate ${duration.toFixed(2)}s linear infinite`,
        }}
      />
      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, color: 'var(--text-primary)' }}>
        Building your brief...
      </div>
      <div className="pulse-anim" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
        {status}
      </div>
      <div style={{ maxWidth: 320, margin: '0 auto' }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>
      <div style={{ marginTop: 20, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
        Claude is researching your industry in real time — typically 30–60 seconds
      </div>
    </div>
  )
}

// ── Input form ────────────────────────────────────────────────
function InputForm({
  onGenerate,
  loading,
}: {
  onGenerate: (jd: string, depth: string, audience: string, resumeText: string) => void
  loading: boolean
}) {
  const [jd, setJd] = useState('')
  const [depth, setDepth] = useState('standard')
  const [audience, setAudience] = useState('some')
  const [error, setError] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')

  const handleResumeParsed = (text: string, fileName: string) => {
    setResumeText(text)
    setResumeFileName(fileName)
  }

  const handleSubmit = () => {
    if (jd.trim().length < 60) {
      setError('Please paste a more complete job description — aim for at least a few sentences covering the role, company, and requirements.')
      return
    }
    setError('')
    onGenerate(jd, depth, audience, resumeText)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Example chips */}
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Try an example role
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EXAMPLE_JDS.map(ex => (
            <button key={ex.label} onClick={() => setJd(ex.jd)} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job description textarea */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          Job description <span style={{ color: 'var(--brand)' }}>*</span>
        </label>
        <textarea
          className="input"
          value={jd}
          onChange={e => { setJd(e.target.value); if (error) setError('') }}
          placeholder="Paste the full job description here — include the role title, company, responsibilities, required skills, and any tech stack mentions. The more detail, the more tailored your brief will be."
          rows={7}
          style={{ minHeight: 160, borderColor: jd.length > 5000 ? '#E53E3E' : jd.length > 4000 ? '#D97706' : undefined }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
          <span style={{ fontSize: '0.72rem', color: error ? 'var(--brand)' : 'var(--text-tertiary)' }}>
            {error}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {jd.length > 5000 && (
              <button
                onClick={() => setJd(jd.slice(0, 5000))}
                style={{ fontSize: '0.72rem', color: 'white', background: '#E53E3E', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600 }}
              >
                Auto-trim to limit
              </button>
            )}
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: jd.length > 5000 ? '#E53E3E' : jd.length > 4000 ? '#D97706' : jd.length > 60 ? 'var(--green)' : 'var(--text-tertiary)'
            }}>
              {jd.length.toLocaleString()} / 5,000
              {jd.length > 5000 ? ' — over limit, will be trimmed' : jd.length > 4000 ? ' — approaching limit' : jd.length > 60 ? ' ✓ ready' : ''}
            </span>
          </div>
        </div>
        {/* Resume limit hint */}
        <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
          <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Tips for best results:</span> Include the job title, company name, key responsibilities, and required skills. Remove lengthy legal boilerplate (EEO statements, benefits descriptions) if over the limit — that content doesn't improve your brief.
        </div>
      </div>

      {/* Resume upload */}
      <ResumeUpload onResumeParsed={handleResumeParsed} resumeFileName={resumeFileName} />

      {/* Resume loaded confirmation */}
      {resumeText && (
        <div style={{ background: 'var(--accent-light)', border: '1px solid rgba(20,143,119,0.3)', borderRadius: 'var(--r-md)', padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="mat-icon mat-icon-sm" style={{ color: 'var(--accent)', flexShrink: 0 }}>psychology</span>
          <div style={{ fontSize: '0.82rem', color: 'var(--accent-dark)', lineHeight: 1.5 }}>
            <strong>Resume loaded.</strong> Your brief will include a personalized match score, strengths, skill gaps, and ready-to-use interview talking points.
          </div>
        </div>
      )}

      {/* Options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="options-grid">
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>Guide depth</label>
          <select className="select" value={depth} onChange={e => setDepth(e.target.value)}>
            <option value="quick">Quick overview (4 courses)</option>
            <option value="standard">Standard depth (6–8 courses)</option>
            <option value="deep">Deep dive (10–12 courses)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>
            {resumeText ? 'Level (AI will auto-select from resume)' : 'Audience level'}
          </label>
          <select className="select" value={audience} onChange={e => setAudience(e.target.value)}
            style={{ borderColor: resumeText ? 'var(--accent)' : undefined }}>
            <option value="beginner">Complete beginner</option>
            <option value="some">Some background knowledge</option>
            <option value="technical">Technical / experienced</option>
          </select>
          {resumeText && <div style={{ fontSize: '0.7rem', color: 'var(--accent-dark)', marginTop: 3 }}>AI will set this based on your resume match score</div>}
        </div>
      </div>

      {/* Generate button */}
      <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading} style={{ width: '100%', fontSize: '1rem' }}>
        {loading ? (
          <>
            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            {resumeText ? 'Building your personalized brief...' : 'Briefing you...'}
          </>
        ) : (
          <>
            <span className="mat-icon mat-icon-sm">auto_fix_high</span>
            {resumeText ? 'Brief Me — Personalized' : 'Brief Me'}
          </>
        )}
      </button>
    </div>
  )
}

// ── Milestone Modal — shown after 3 personalized briefs ───────
function MilestoneModal({ count, onContinue }: { count: number; onContinue: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(13,27,42,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--r-xl)',
        padding: '40px 36px', maxWidth: 480, width: '100%',
        textAlign: 'center', boxShadow: 'var(--shadow-xl)',
        animation: 'fade-up 0.3s ease',
      }}>
        {/* Emoji celebration */}
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎉</div>

        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand)', marginBottom: 8, letterSpacing: '-0.03em' }}>
          You're on a roll!
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          You've created <strong style={{ color: 'var(--text-primary)' }}>{count} personalized briefs</strong> — that's seriously impressive commitment to your prep.
        </div>

        <div style={{
          background: 'var(--brand-faint)', border: '1px solid var(--brand-light)',
          borderRadius: 'var(--r-lg)', padding: '16px 20px', marginBottom: 24, textAlign: 'left',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-mid)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            About Briefed
          </div>
          {[
            'Built by Brain Blooms LLC for continuous learners and career changers',
            'Briefed is and always will be free — finding a new role is hard enough',
            'Your resume and job descriptions are never stored or shared',
            'Powered by Claude AI — the same AI that helped build this tool',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>
          Feeling prepped? Share Briefed with someone else who could use it.
        </div>

        {/* Share row */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgetbriefed.fyi"
            target="_blank" rel="noreferrer"
            style={{
              background: '#0A66C2', color: 'white', borderRadius: 'var(--r-md)',
              padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            Share on LinkedIn
          </a>
        </div>

        <button
          onClick={onContinue}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '0.95rem', padding: '12px' }}
        >
          <span className="mat-icon mat-icon-sm">auto_fix_high</span>
          Keep going — Brief me again
        </button>

        <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
          Briefed is always free. No limits, no credit card, ever.
        </div>
      </div>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div style={{ width: 32, height: 32, background: 'var(--brand)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>B</span>
        </div>
        <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--brand)', letterSpacing: '-0.04em' }}>
          Briefed
        </span>
        <span style={{ fontSize: '0.6rem', fontWeight: 700, background: 'var(--brand)', color: 'white', padding: '2px 7px', borderRadius: 4, marginLeft: 2, letterSpacing: '0.05em' }}>BETA</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Powered by Claude AI</span>
      </div>
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────
function Hero() {
  return (
    <div className="hero-gradient" style={{ padding: '64px 24px 48px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {['Any Role', 'Any Industry', 'Zero to Expert', 'Under 60 Seconds'].map(label => (
          <span className="feature-chip" key={label}>{label}</span>
        ))}
      </div>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.03em' }}>
        Get fully
        <span style={{ background: 'linear-gradient(135deg, #52D9C1, #A8EDDF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {' '}briefed{' '}
        </span>
        on any role
      </h1>
      <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.8)', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.65 }}>
        Paste any job description. Get a structured, course-style field guide covering products, tools, competitors, and career strategy — before your first day, first call, or first interview.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
        {[
          { icon: 'menu_book', text: 'Structured courses' },
          { icon: 'analytics', text: 'Competitor analysis' },
          { icon: 'library_books', text: 'Full glossary' },
          { icon: 'trending_up', text: 'Career tips' },
          { icon: 'download', text: 'Export to PDF' },
        ].map(item => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
            <span className="mat-icon mat-icon-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── How it works section ──────────────────────────────────────
function HowItWorks() {
  return (
    <div style={{ padding: '40px 0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>How Briefed works</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>From zero to briefed in 3 steps</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="steps-grid">
        {[
          { n: '1', icon: 'description', title: 'Paste the job description', desc: 'Include the role title, company, responsibilities, and required skills. More detail = better brief.' },
          { n: '2', icon: 'auto_fix_high', title: 'AI builds your brief', desc: 'Claude researches the industry, products, competitors, and career path in real time.' },
          { n: '3', icon: 'verified', title: 'Walk in knowing everything', desc: 'Read online, share with your team, or download a polished Word + PDF.' },
        ].map(step => (
          <div key={step.n} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <span className="mat-icon mat-icon-lg" style={{ color: 'var(--brand)', marginBottom: 8, display: 'block' }}>{step.icon}</span>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--brand)', color: 'white', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>{step.n}</div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 6, color: 'var(--text-primary)' }}>{step.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Social proof strip ────────────────────────────────────────
function SocialProof() {
  return (
    <div style={{ background: 'var(--brand-faint)', border: '1px solid var(--brand-light)', borderRadius: 'var(--r-lg)', padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1,2,3,4,5].map(i => <Icon.Star key={i} size={13} />)}
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-dark)' }}>Made for job seekers, continuous learners, and industry professionals</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="steps-grid">
        {[
          { q: '"I uploaded my resume and it told me exactly how my Salesforce experience translated. Walked into the interview knowing my talking points cold."', name: 'Account Executive' },
          { q: '"Sent this to my entire new hire class on day one. They were asking smarter questions by day three. Nothing else does this."', name: 'Sales Director' },
          { q: '"The competitor table alone changed how I positioned myself. I stopped guessing and started winning deals I should have been losing."', name: 'Territory Manager' },
        ].map((t, i) => (
          <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <span style={{ fontStyle: 'italic' }}>{t.q}</span>
            <div style={{ fontWeight: 600, color: 'var(--text-tertiary)', marginTop: 4, fontSize: '0.72rem' }}>— {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Export button action ──────────────────────────────────────
function ExportCTA({ guide }: { guide: GuideData }) {
  return (
    <div className="card fade-up" style={{ padding: '24px', marginTop: 8, background: 'linear-gradient(135deg, var(--bg) 0%, white 100%)' }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontWeight: 700, fontSize: '0.975rem', marginBottom: 4 }}>
            Want a formatted Word + PDF version?
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Take this brief back to Claude with the message below — it will generate a fully formatted DOCX and PDF with color-coded course banners, tables, and a bound glossary.
          </div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace', lineHeight: 1.6, border: '1px solid var(--border)', maxWidth: 340 }}>
          "Convert my {guide.role} at {guide.company} brief into a formatted Word document and PDF — with course banner headers, color-coded tables, and a complete glossary."
        </div>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [guide, setGuide] = useState<GuideData | null>(null)
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [error, setError] = useState('')
  const [showMilestone, setShowMilestone] = useState(false)
  const [pendingGenerate, setPendingGenerate] = useState<null | { jd: string; depth: string; audience: string; resumeText: string }>(null)
  const guideRef = useRef<HTMLDivElement>(null)
  const msgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const credits = useCredits()

  const generate = useCallback(async (jd: string, depth: string, audience: string, resumeText: string = '') => {
    const isPersonalized = resumeText.trim().length > 100

    // After 3 personalized briefs show the milestone — but don't block
    if (isPersonalized && credits.personalizedUsed > 0 && credits.personalizedUsed % 3 === 0 && !showMilestone) {
      setPendingGenerate({ jd, depth, audience, resumeText })
      setShowMilestone(true)
      return
    }

    setShowMilestone(false)
    setPendingGenerate(null)
    setGuide(null)
    setError('')
    setStatus('loading')

    let msgIdx = 0
    setStatusMsg(STATUS_MESSAGES[0])
    msgIntervalRef.current = setInterval(() => {
      msgIdx = (msgIdx + 1) % STATUS_MESSAGES.length
      setStatusMsg(STATUS_MESSAGES[msgIdx])
    }, 4000)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, depth, audience, resumeText }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      // Read streaming response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value, { stream: true })
        }
      }

      // Strip markdown fences and repair truncated JSON
      let clean = full.replace(/```json|```/g, '').trim()

      // Repair truncated JSON if needed
      const repairJSON = (text: string): string => {
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

      clean = repairJSON(clean)
      const data: GuideData = JSON.parse(clean)
      setGuide(data)
      setStatus('done')

      // Consume a personalized credit if resume was used
      if (data.resumeAnalysis?.hasResume) {
        credits.consume(true)
      } else {
        credits.consume(false)
      }

      setTimeout(() => {
        guideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      if (msgIntervalRef.current) clearInterval(msgIntervalRef.current)
    }
  }, [credits])

  const reset = () => {
    setGuide(null)
    setStatus('idle')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExport = () => {
    alert('To export: copy the guide content and use the prompt at the bottom of the page in Claude to generate a formatted Word + PDF document.')
  }

  const isLoading = status === 'loading'

  return (
    <>
      <Nav />

      {/* Hero — only show when no guide */}
      {!guide && status === 'idle' && <Hero />}

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Input section */}
        {!guide && (
          <div style={{ marginTop: 32 }}>
            {status === 'idle' && <HowItWorks />}

            <div className="card-elevated" style={{ padding: '28px', marginBottom: 16 }}>
              {status === 'idle' && (
                <div style={{ marginBottom: 16 }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Get briefed on any role</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>Paste a job description below — or try one of the examples to see Briefed in action.</p>
                </div>
              )}

              {/* Milestone modal — celebratory, not a wall */}
              {showMilestone && (
                <MilestoneModal
                  count={credits.personalizedUsed}
                  onContinue={() => {
                    setShowMilestone(false)
                    if (pendingGenerate) {
                      generate(pendingGenerate.jd, pendingGenerate.depth, pendingGenerate.audience, pendingGenerate.resumeText)
                    }
                  }}
                />
              )}

              {!showMilestone && (
                isLoading ? (
                  <LoadingState status={statusMsg} />
                ) : (
                  <InputForm onGenerate={generate} loading={isLoading} />
                )
              )}
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', color: '#991B1B', padding: '12px 16px', borderRadius: 'var(--r-md)', fontSize: '0.875rem' }}>
                ⚠️ {error}
              </div>
            )}

            {status === 'idle' && <SocialProof />}
          </div>
        )}

        {/* Guide output */}
        {guide && (
          <div ref={guideRef} style={{ paddingTop: 24 }}>
            <GuideHeader guide={guide} onExport={handleExport} onReset={reset} />

            {/* Your Edge — personalized section (only shows with resume) */}
            {guide.resumeAnalysis?.hasResume && (
              <YourEdge
                analysis={guide.resumeAnalysis}
                role={guide.role}
                company={guide.company}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {guide.courses?.map((course, i) => (
                <CourseCard key={i} course={course} index={i} defaultOpen={i === 0} />
              ))}
              <CompetitorSection guide={guide} />
              <CareerSection tips={guide.careerTips} />
              <GlossarySection entries={guide.glossary} />
            </div>

            <ExportCTA guide={guide} />

            {/* Generate another */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn btn-primary" onClick={reset}>
                <span className="mat-icon mat-icon-sm">add_circle</span>
                Brief me on another role
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 24px', textAlign: 'center', background: 'white' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--brand)', letterSpacing: '-0.04em', marginBottom: 6 }}>
            Briefed
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 10 }}>
            Know your role before day one. Built for sales reps, solutions engineers, and anyone preparing for a new role.
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
            © {new Date().getFullYear()} Brain Blooms LLC · All rights reserved · Briefed is a product of Brain Blooms LLC
            <br />Powered by <strong style={{ color: 'var(--text-secondary)' }}>Claude AI</strong> by Anthropic
          </div>
        </div>
      </footer>
    </>
  )
}
