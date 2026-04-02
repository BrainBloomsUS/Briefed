'use client'
import { useState, useRef, useCallback } from 'react'
import type { GuideData, GuideCourse, GuideSection, GenerationStatus } from '@/lib/types'
import { EXAMPLE_JDS } from '@/lib/constants'

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
  return (
    <div className="loading-card fade-in" style={{ padding: '48px 32px' }}>
      <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' }} />
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
  onGenerate: (jd: string, depth: string, audience: string) => void
  loading: boolean
}) {
  const [jd, setJd] = useState('')
  const [depth, setDepth] = useState('standard')
  const [audience, setAudience] = useState('some')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (jd.trim().length < 60) {
      setError('Please paste a more complete job description — aim for at least a few sentences covering the role, company, and requirements.')
      return
    }
    setError('')
    onGenerate(jd, depth, audience)
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
            <button
              key={ex.label}
              onClick={() => setJd(ex.jd)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          Job description <span style={{ color: 'var(--brand)' }}>*</span>
        </label>
        <textarea
          className="input"
          value={jd}
          onChange={e => { setJd(e.target.value); if (error) setError('') }}
          placeholder="Paste the full job description here — include the role title, company, responsibilities, required skills, and any tech stack mentions. The more detail, the more tailored your guide will be."
          rows={7}
          style={{ minHeight: 160 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: '0.72rem', color: error ? 'var(--brand)' : 'var(--text-tertiary)' }}>
            {error || `${jd.length} characters`}
          </span>
          {jd.length > 60 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--green)' }}>✓ Ready to generate</span>
          )}
        </div>
      </div>

      {/* Options grid */}
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
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 5 }}>Audience level</label>
          <select className="select" value={audience} onChange={e => setAudience(e.target.value)}>
            <option value="beginner">Complete beginner</option>
            <option value="some">Some background knowledge</option>
            <option value="technical">Technical / experienced</option>
          </select>
        </div>
      </div>

      {/* Generate button */}
      <button
        className="btn btn-primary btn-lg"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: '100%', fontSize: '1rem' }}
      >
        {loading ? (
          <>
            <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Briefing you...
          </>
        ) : (
          <>
            <Icon.Sparkle size={18} />
            Brief Me
          </>
        )}
      </button>
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
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--brand-dark)' }}>Used by sales reps, solutions engineers, and job seekers</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="steps-grid">
        {[
          { q: '"Got fully briefed on DriveCentric before my interview. Landed the role."', name: 'Solutions Consultant, STL' },
          { q: '"I send this to every new sales hire. Replaced 2 weeks of onboarding."', name: 'Sales Director, Chicago' },
          { q: '"The competitor table alone was worth it. Walked in knowing exactly how to position."', name: 'Territory Manager, Austin' },
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
  const guideRef = useRef<HTMLDivElement>(null)
  const msgIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generate = useCallback(async (jd: string, depth: string, audience: string) => {
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
        body: JSON.stringify({ jobDescription: jd, depth, audience }),
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

      const clean = full.replace(/```json|```/g, '').trim()
      const data: GuideData = JSON.parse(clean)
      setGuide(data)
      setStatus('done')

      setTimeout(() => {
        guideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      if (msgIntervalRef.current) clearInterval(msgIntervalRef.current)
    }
  }, [])

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
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>Get briefed on any role</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Paste a job description below — or try one of the examples to see Briefed in action.</p>
                </div>
              )}
              {isLoading ? (
                <LoadingState status={statusMsg} />
              ) : (
                <InputForm onGenerate={generate} loading={isLoading} />
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
                <Icon.Sparkle size={16} />
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
