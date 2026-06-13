import { useState } from 'react'

// function highlightDiff(broken, fixed) {
//   if (!broken || !fixed) return {}
//   if (broken === fixed) return {}

//   let diffStart = 0
//   while (
//     diffStart < broken.length &&
//     diffStart < fixed.length &&
//     broken[diffStart] === fixed[diffStart]
//   ) { diffStart++ }

//   let brokenEnd = broken.length
//   let fixedEnd = fixed.length
//   while (
//     brokenEnd > diffStart &&
//     fixedEnd > diffStart &&
//     broken[brokenEnd - 1] === fixed[fixedEnd - 1]
//   ) { brokenEnd--; fixedEnd-- }

//   return {
//     brokenDiff: broken.slice(diffStart, brokenEnd),
//     fixedDiff: fixed.slice(diffStart, fixedEnd)
//   }
// }

function CodeFix({ violation }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(violation.fix || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const broken = violation.element || ''
  const fixed = violation.fix || ''
  const isSame = broken === fixed
  //const diff = highlightDiff(broken, fixed)
  // const showDiff = !isSame &&
  //   diff.brokenDiff &&
  //   diff.fixedDiff &&
  //   diff.brokenDiff.length < 100 &&
  //   diff.fixedDiff.length < 100 &&
  //   broken.length < 300 &&
  //   fixed.length < 300

  return (
    <div>

      {/* Same code warning */}
      {isSame && (
        <div style={{
          background: '#ffcc0011',
          border: '1px solid #ffcc0033',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#ffcc00'
        }}>
          The fix for this violation requires structural or CSS changes
          rather than modifying this specific element directly.
        </div>
      )}

      {/* Before and After */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: '#ff4444',
            letterSpacing: '2px',
            marginBottom: '8px'
          }}>BROKEN</p>
          <div style={{
            background: '#ff444408',
            border: '1px solid #ff444433',
            borderRadius: '8px',
            padding: '14px',
            minHeight: '80px'
          }}>
            <code style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: '#ff8888',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {broken || 'Element not available'}
            </code>
          </div>
        </div>

        <div>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: 'var(--green)',
            letterSpacing: '2px',
            marginBottom: '8px'
          }}>FIXED</p>
          <div style={{
            background: '#00ff8808',
            border: '1px solid #00ff8833',
            borderRadius: '8px',
            padding: '14px',
            minHeight: '80px'
          }}>
            <code style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: '#00ff88',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {fixed || 'Fix not available'}
            </code>
          </div>
        </div>
      </div>

      {/* What Changed
      {showDiff && (
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '16px'
        }}>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: 'var(--text-dim)',
            letterSpacing: '2px',
            marginBottom: '12px'
          }}>WHAT CHANGED</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{
                background: '#ff444422',
                border: '1px solid #ff444444',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                color: '#ff4444',
                fontFamily: 'Space Mono, monospace',
                whiteSpace: 'nowrap'
              }}>removed</span>
              <code style={{
                fontSize: '12px',
                color: '#ff8888',
                fontFamily: 'Space Mono, monospace',
                wordBreak: 'break-all',
                lineHeight: '1.6'
              }}>{diff.brokenDiff}</code>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{
                background: '#00ff8822',
                border: '1px solid #00ff8844',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
                color: 'var(--green)',
                fontFamily: 'Space Mono, monospace',
                whiteSpace: 'nowrap'
              }}>added</span>
              <code style={{
                fontSize: '12px',
                color: '#00ff88',
                fontFamily: 'Space Mono, monospace',
                wordBreak: 'break-all',
                lineHeight: '1.6'
              }}>{diff.fixedDiff}</code>
            </div>
          </div>
        </div>
      )} */}

      {/* Where to Find It */}
      {violation.location && (
        <div style={{
          background: 'var(--bg)',
          border: '1px solid #4488ff33',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '18px' }}>📍</span>
          <div>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              color: '#4488ff',
              letterSpacing: '2px',
              marginBottom: '6px'
            }}>WHERE TO FIND IT</p>
            <p style={{
              fontSize: '13px',
              color: 'white',
              lineHeight: '1.5'
            }}>
              {violation.location}
            </p>
          </div>
        </div>
      )}

      {/* Copy Button */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? 'var(--green-dim)' : 'var(--bg)',
            border: `1px solid ${copied ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: '8px',
            padding: '8px 16px',
            color: copied ? 'var(--green)' : 'var(--text-dim)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {copied ? 'Copied!' : 'Copy Fix'}
        </button>

        {violation.helpUrl && (
          <a
            href={violation.helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: 'var(--text-dim)',
              textDecoration: 'none'
            }}
          >
            Learn more
          </a>
        )}
      </div>
    </div>
  )
}

export default CodeFix