import { useState } from 'react'
import URLInput from './components/URLInput'
import Report from './components/Report'

function App() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(10,10,18,0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'var(--green-dim)',
              border: '1px solid var(--green)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px'
            }}>♿</div>
            <div>
              <h1 style={{
                fontSize: '20px', fontWeight: '800',
                color: 'white', letterSpacing: '-0.5px'
              }}>
                Accessibility <span style={{ color: 'var(--green)' }}>Analyser</span>
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '1px' }}>
                AI-powered WCAG compliance checker
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Hero */}
        {!report && !loading && (
          <div style={{ textAlign: 'center', marginBottom: '48px' }}
            className="fade-up">
            <div style={{
              display: 'inline-block',
              background: 'var(--green-dim)',
              border: '1px solid var(--green)',
              borderRadius: '100px',
              padding: '4px 16px',
              fontSize: '12px',
              color: 'var(--green)',
              marginBottom: '20px',
              fontFamily: 'Space Mono, monospace'
            }}>
              WCAG 2.1 Compliance Scanner
            </div>
            <h2 style={{
              fontSize: '48px', fontWeight: '800',
              lineHeight: '1.1', color: 'white',
              letterSpacing: '-2px', marginBottom: '16px'
            }}>
              Make your website<br />
              <span style={{ color: 'var(--green)' }}>accessible to everyone</span>
            </h2>
            <p style={{
              fontSize: '18px', color: 'var(--text-dim)',
              maxWidth: '500px', margin: '0 auto', lineHeight: '1.6'
            }}>
              Paste any URL and get instant AI-generated code fixes
              for every accessibility violation found.
            </p>
          </div>
        )}

        <URLInput
          setReport={setReport}
          setLoading={setLoading}
          setError={setError}
          setProgress={setProgress}
          setProgressLabel={setProgressLabel}
          loading={loading}
        />

        {/* Error */}
        {error && (
          <div className="fade-up" style={{
            marginTop: '20px',
            background: '#ff444422',
            border: '1px solid var(--red)',
            borderRadius: '12px',
            padding: '16px 20px',
            color: '#ff8888',
            fontFamily: 'Space Mono, monospace',
            fontSize: '14px'
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {/* Loading State */}
        {loading && (
          <div style={{ marginTop: '60px', textAlign: 'center' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* Circle with percentage */}
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 24px' }}>

              {/* Spinning ring */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100px', height: '100px',
                border: '3px solid var(--border)',
                borderTop: `3px solid var(--green)`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />

              {/* Progress ring */}
              <svg
                style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
                width="100" height="100"
              >
                <circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease', opacity: 0.4 }}
                />
              </svg>

              {/* Percentage text */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--green)',
                  lineHeight: '1'
                }}>
                  {progress}%
                </p>
              </div>
            </div>

            {/* Status label */}
            <p style={{
              color: 'var(--green)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
              marginBottom: '8px'
            }}>
              {progressLabel}
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
              {progress > 50
                ? 'Still working — server may be handling multiple requests...'
                : 'Scans take 30-60 seconds on free hosting'}
            </p>
          </div>
        )}

        {/* Report */}
        {report && !loading && (
          <Report report={report} />
        )}

      </div>
    </div>
  )
}

export default App