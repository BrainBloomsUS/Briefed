import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Briefed — Know your role before day one'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D1B2A 0%, #1B4F72 35%, #2471A3 65%, #148F77 100%)',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }} />

        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          {/* B mark */}
          <div style={{
            width: '80px', height: '80px',
            background: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '52px',
            fontWeight: 900,
            color: '#1B4F72',
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
          }}>
            B
          </div>
          {/* Wordmark */}
          <div style={{
            fontSize: '72px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-0.04em',
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
          }}>
            Briefed
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '32px',
          color: 'rgba(255,255,255,0.80)',
          marginBottom: '40px',
          letterSpacing: '0.01em',
          fontFamily: 'sans-serif',
          fontWeight: 400,
        }}>
          Know your role before day one
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px' }}>
          {[
            'Resume match analysis',
            'Interview talking points',
            'Competitor intelligence',
            'Full industry glossary',
            'Career strategy',
          ].map((pill) => (
            <div
              key={pill}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.22)',
                borderRadius: '40px',
                padding: '10px 22px',
                fontSize: '18px',
                color: 'rgba(255,255,255,0.90)',
                fontFamily: 'sans-serif',
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {pill}
            </div>
          ))}
        </div>

        {/* URL bar */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          fontSize: '20px',
          color: 'rgba(255,255,255,0.40)',
          fontFamily: 'sans-serif',
          letterSpacing: '0.05em',
          display: 'flex',
        }}>
          getbriefed.fyi
        </div>

        {/* Teal accent bar at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #148F77, #52D9C1, #148F77)',
          display: 'flex',
        }} />

        {/* Brain Blooms LLC credit */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '40px',
          fontSize: '16px',
          color: 'rgba(255,255,255,0.30)',
          fontFamily: 'sans-serif',
          display: 'flex',
        }}>
          Brain Blooms LLC
        </div>
      </div>
    ),
    { ...size }
  )
}
