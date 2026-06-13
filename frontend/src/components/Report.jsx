import { useState } from 'react'
import Violation from './Violation'
import axios from 'axios'


const getScoreLabel = (score) => {
  if (score >= 90) return { label: 'Excellent', color: '#00ff88' }
  if (score >= 70) return { label: 'Good', color: '#88ff00' }
  if (score >= 50) return { label: 'Needs Work', color: '#ffcc00' }
  if (score >= 30) return { label: 'Poor', color: '#ff8800' }
  return { label: 'Critical', color: '#ff4444' }
}

function Report({ report }) {
  const [violations, setViolations] = useState(report.violations || [])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(report.violations?.length || 0)
  const [hasMore, setHasMore] = useState(
    (report.violations?.length || 0) < (report.totalViolations || 0)
  )
  const [remaining, setRemaining] = useState(
    (report.totalViolations || 0) - (report.violations?.length || 0)
  )

  const scoreInfo = getScoreLabel(report.score || 0)

  const loadMore = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyse/more`,
        { reportId: report._id, offset }
      )

      setViolations(prev => [...prev, ...response.data.violations])
      setOffset(prev => prev + response.data.violations.length)
      setHasMore(response.data.hasMore)
      setRemaining(response.data.remaining)

    } catch (error) {
      console.log('Load more failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-up" style={{ marginTop: '40px' }}>

      {/* Score + Summary Card */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>

        {/* URL and Date */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              marginBottom: '6px'
            }}>
              SCAN COMPLETE
            </p>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '15px',
              color: 'var(--green)'
            }}>
              {report.url}
            </p>
          </div>
          <div style={{
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 14px',
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-dim)',
              fontFamily: 'Space Mono, monospace'
            }}>
              {new Date(report.scanDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
          </div>

        </div>

        {/* Score + Severity Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px'
        }}>

          {/* Score Card */}
          <div style={{
            background: `${scoreInfo.color}11`,
            border: `1px solid ${scoreInfo.color}44`,
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <p style={{
              fontSize: '48px',
              fontWeight: '800',
              fontFamily: 'Space Mono, monospace',
              color: scoreInfo.color,
              lineHeight: '1'
            }}>
              {report.score}
            </p>
            <p style={{
              fontSize: '11px',
              color: scoreInfo.color,
              marginTop: '6px',
              fontFamily: 'Space Mono, monospace',
              opacity: 0.8
            }}>
              OUT OF 100
            </p>
            <p style={{
              fontSize: '14px',
              color: scoreInfo.color,
              marginTop: '8px',
              fontWeight: '600',
              fontFamily: 'Space Mono, monospace'
            }}>
              {scoreInfo.label}
            </p>
            <p style={{
              fontSize: '15px',
              color: 'white',
              marginTop: '8px',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 'bold',

            }}>
              {report.totalViolations} total violations
            </p>
          </div>

          {/* Severity Counts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {[
              {
                label: 'Critical',
                count: report.severityCounts?.critical !== undefined
                  ? report.severityCounts.critical
                  : violations.filter(v => v.impact === 'critical').length,
                color: '#ff4444'
              },
              {
                label: 'Serious',
                count: report.severityCounts?.serious !== undefined
                  ? report.severityCounts.serious
                  : violations.filter(v => v.impact === 'serious').length,
                color: '#ff8800'
              },
              {
                label: 'Moderate',
                count: report.severityCounts?.moderate !== undefined
                  ? report.severityCounts.moderate
                  : violations.filter(v => v.impact === 'moderate').length,
                color: '#ffcc00'
              },
              {
                label: 'Minor',
                count: report.severityCounts?.minor !== undefined
                  ? report.severityCounts.minor
                  : violations.filter(v => v.impact === 'minor').length,
                color: '#4488ff'
              },
            ].map(item => (
              <div key={item.label} style={{
                background: `${item.color}11`,
                border: `1px solid ${item.color}44`,
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  fontFamily: 'Space Mono, monospace',
                  color: item.color,
                  lineHeight: '1'
                }}>
                  {item.count}
                </p>
                <p style={{
                  fontSize: '10px',
                  color: item.color,
                  marginTop: '6px',
                  fontFamily: 'Space Mono, monospace',
                  opacity: 0.8
                }}>
                  {item.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zero Violations */}
      {violations.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'var(--bg2)',
          border: '1px solid var(--green)',
          borderRadius: '16px'
        }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>✅</p>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--green)',
            marginBottom: '8px'
          }}>
            Perfect Score!
          </h3>
          <p style={{ color: 'var(--text-dim)' }}>
            No accessibility violations found on this website.
          </p>
        </div>
      )}

      {/* Violations List */}
      {violations.length > 0 && (
        <div>
          {/* <div style={{
            marginTop: '12px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'inline-block'
          }}>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
              color: 'white',
              fontWeight: '700'
            }}>
              {report.totalViolations}
            </span>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              color: 'white',
              marginLeft: '6px'
            }}>
              total violations
            </span>
          </div> */}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {violations.map((violation, index) => (
              <Violation
                key={violation.id + index}
                violation={violation}
                index={index}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div style={{
              textAlign: 'center',
              marginTop: '24px'
            }}>
              <button
                onClick={loadMore}
                disabled={loading}
                style={{
                  background: loading ? 'var(--bg3)' : 'transparent',
                  border: '1px solid var(--green)',
                  borderRadius: '10px',
                  padding: '14px 32px',
                  color: loading ? 'var(--text-dim)' : 'var(--green)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '13px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'var(--green-dim)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {loading
                  ? 'Loading...'
                  : `Load More`
                }
              </button>
            </div>
          )}

          {/* All loaded message */}
          {!hasMore && violations.length > 10 && (
            <p style={{
              textAlign: 'center',
              marginTop: '24px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: 'var(--text-dim)'
            }}>
              All {report.totalViolations} violations loaded
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Report