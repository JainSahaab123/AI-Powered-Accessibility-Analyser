import { useState } from 'react'
import CodeFix from './CodeFix'
import axios from 'axios'

const impactColors = {
  critical: { bg: '#ff444411', border: '#ff444444', text: '#ff4444' },
  serious: { bg: '#ff880011', border: '#ff880044', text: '#ff8800' },
  moderate: { bg: '#ffcc0011', border: '#ffcc0044', text: '#ffcc00' },
  minor: { bg: '#4488ff11', border: '#4488ff44', text: '#4488ff' },
}

const impactIcons = {
  critical: '🔴',
  serious: '🟠',
  moderate: '🟡',
  minor: '🔵',
}

function Violation({ violation, index }) {
  const [expanded, setExpanded] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const colors = impactColors[violation.impact] || impactColors.minor

  const startChat = async () => {
    if (chatOpen) {
      setChatOpen(false)
      return
    }
    setChatOpen(true)
    if (messages.length > 0) return

    setChatLoading(true)
    try {
      // Fix - use env variable
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/analyse/explain`,
        { violation, messages: [] }
      )
      setMessages([{ role: 'ai', content: response.data.message }])
    } catch {
      setMessages([{
        role: 'ai',
        content: 'Could not load explanation. Please try again.'
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setChatLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}api/analyse/explain`,
        { violation, messages: updatedMessages }
      )
      setMessages([
        ...updatedMessages,
        { role: 'ai', content: response.data.message }
      ])
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'ai', content: 'Something went wrong. Please try again.' }
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div
      className="fade-up"
      style={{
        background: 'var(--bg2)',
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        animationFillMode: 'forwards'
      }}
    >
      {/* Violation Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${colors.bg}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <span style={{ fontSize: '20px', marginTop: '2px' }}>
          {impactIcons[violation.impact]}
        </span>

        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '6px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              borderRadius: '6px',
              padding: '2px 10px',
              fontSize: '10px',
              fontFamily: 'Space Mono, monospace',
              letterSpacing: '1px'
            }}>
              {violation.impact?.toUpperCase()}
            </span>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              color: 'var(--text-dim)'
            }}>
              {violation.id}
            </span>
          </div>

          <p style={{
            fontSize: '15px',
            color: 'white',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            {violation.description}
          </p>

          {violation.explanation && (
            <p style={{
              fontSize: '13px',
              color: 'var(--text-dim)',
              marginTop: '6px',
              lineHeight: '1.5'
            }}>
              {violation.explanation}
            </p>
          )}
        </div>

        <span style={{
          color: 'var(--text-dim)',
          fontSize: '18px',
          transition: 'transform 0.2s',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          marginTop: '2px'
        }}>
          ▾
        </span>
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '20px',
          background: 'var(--bg3)'
        }}>
          <CodeFix violation={violation} colors={colors} />

          {/* Understand with AI Button */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={startChat}
              style={{
                background: chatOpen ? 'var(--green-dim)' : 'transparent',
                border: `1px solid ${chatOpen ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '8px 16px',
                color: chatOpen ? 'var(--green)' : 'var(--text-dim)',
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🤖 {chatOpen ? 'Close AI Chat' : 'Understand with AI'}
            </button>
          </div>

          {/* Chat Window */}
          {chatOpen && (
            <div style={{
              marginTop: '16px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  background: 'var(--green)',
                  animation: 'pulse-green 2s infinite'
                }} />
                <span style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  letterSpacing: '1px'
                }}>
                  AI ACCESSIBILITY EXPERT
                </span>
              </div>

              {/* Messages */}
              <div style={{
                padding: '16px',
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {chatLoading && messages.length === 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '28px', height: '28px',
                      borderRadius: '50%',
                      background: 'var(--green-dim)',
                      border: '1px solid var(--green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      flexShrink: 0
                    }}>
                      🤖
                    </div>
                    <div style={{
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}>
                      <span style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '12px',
                        color: 'var(--green)'
                      }}>
                        thinking
                        <span style={{ animation: 'blink 1s infinite' }}>...</span>
                      </span>
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    {msg.role === 'ai' && (
                      <div style={{
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        background: 'var(--green-dim)',
                        border: '1px solid var(--green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        🤖
                      </div>
                    )}
                    <div style={{
                      background: msg.role === 'user'
                        ? 'var(--green-dim)'
                        : 'var(--bg2)',
                      border: `1px solid ${msg.role === 'user'
                        ? 'var(--green)'
                        : 'var(--border)'}`,
                      borderRadius: msg.role === 'user'
                        ? '12px 12px 0 12px'
                        : '12px 12px 12px 0',
                      padding: '10px 14px',
                      maxWidth: '80%',
                      fontSize: '13px',
                      color: msg.role === 'user' ? 'var(--green)' : 'var(--text)',
                      lineHeight: '1.5'
                    }}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div style={{
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        👤
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator for follow up */}
                {chatLoading && messages.length > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '28px', height: '28px',
                      borderRadius: '50%',
                      background: 'var(--green-dim)',
                      border: '1px solid var(--green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      flexShrink: 0
                    }}>
                      🤖
                    </div>
                    <div style={{
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}>
                      <span style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '12px',
                        color: 'var(--green)'
                      }}>
                        thinking
                        <span style={{ animation: 'blink 1s infinite' }}>...</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '8px'
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything about this violation..."
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading || !input.trim()}
                  style={{
                    background: 'var(--green)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#000',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: chatLoading || !input.trim()
                      ? 'not-allowed' : 'pointer',
                    opacity: chatLoading || !input.trim() ? 0.5 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Violation