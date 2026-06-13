import { useState } from 'react'
import axios from 'axios'

function URLInput({ setReport, setLoading, setError, setProgress, setProgressLabel, loading }) {
  const [url, setUrl] = useState('')
  // const [progress, setProgress] = useState(0)
  // const [progressLabel, setProgressLabel] = useState('')

  const handleScan = async () => {
    // Frontend validation
    setError(null)  // always clear previous error first

    if (!url.trim()) {
      setError('Please enter a URL to scan')
      return
    }

    try {
      setError(null)
      setReport(null)
      setLoading(true)
      setProgressLabel('Connecting to website...')
      setProgress(0)
      setProgressLabel('Connecting to website...')

      // Simulate progress
      const steps = [
        { percent: 15, label: 'Connecting to website...', delay: 1000 },
        { percent: 30, label: 'Opening headless browser...', delay: 2000 },
        { percent: 50, label: 'Scanning accessibility...', delay: 4000 },
        { percent: 65, label: 'Analysing violations...', delay: 3000 },
        { percent: 80, label: 'Generating AI fixes...', delay: 3000 },
        { percent: 92, label: 'Almost done...', delay: 2000 },
      ]

      let cancelled = false
      const runSteps = async () => {
        for (const step of steps) {
          if (cancelled) break
          await new Promise(r => setTimeout(r, step.delay))
          if (cancelled) break
          setProgress(step.percent)
          setProgressLabel(step.label)
        }
      }
      runSteps()

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/analyse`,
        { url }
      )

      const queuePosition = response.headers['x-queue-position']
      if (queuePosition > 0) {
        setProgressLabel(`You are #${queuePosition} in queue. Please wait...`)
      }

      cancelled = true
      setProgress(100)
      setProgressLabel('Complete!')
      await new Promise(r => setTimeout(r, 400))
      setReport(response.data)

    } catch (err) {
      const status = err.response?.status
      const message = err.response?.data?.error

      if (message) {
        setError(message)
        return
      }

      if (status === 404) {
        setError('Website not found. Please check the URL.')
        return
      }
      if (status === 403) {
        setError('This website blocks automated scanners. Try a different URL.')
        return
      }
      if (status === 408) {
        setError('Website took too long to respond. Please try again.')
        return
      }
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network.')
        return
      }

      // setError('Something went wrong. Please try again.')
      setError(
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
      setProgress(0)
      setProgressLabel('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleScan()
  }

  return (
    <div className="fade-up" style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
    }}>

      {/* Label */}
      <p style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: '11px',
        color: 'var(--text-dim)',
        letterSpacing: '2px',
        marginBottom: '12px'
      }}>
        ENTER WEBSITE URL
      </p>

      {/* Input Row */}
      <div style={{ display: 'flex', gap: '12px' }}>

        {/* Input Box */}
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '13px'
          }}>
            https://
          </span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="amazon.com"
            disabled={loading}
            style={{
              width: '100%',
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '14px 16px 14px 80px',
              color: 'white',
              fontSize: '15px',
              fontFamily: 'Space Mono, monospace',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--green)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)'
            }}
          />
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={loading}
          style={{
            background: loading ? 'var(--bg3)' : 'var(--green)',
            color: loading ? 'var(--text-dim)' : '#000',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 28px',
            fontSize: '14px',
            fontWeight: '700',
            fontFamily: 'Syne, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.transform = 'scale(1.03)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
          }}
        >
          {loading ? 'Scanning...' : '⚡ Scan Now'}
        </button>
      </div>

      {/* Example URLs */}
      {/* Example URLs */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{
          fontSize: '12px',
          color: 'var(--text-dim)',
          marginRight: '4px',
          fontFamily: 'Space Mono, monospace'
        }}>
          TRY THESE →
        </span>
        {[
          'apple.com',
          'google.com',
          'wikipedia.org',
          'chess.com',
          'zomato.com',
          'amazon.in',
          'flipkart.com',
          'My Site',
        ].map(site => (
          <button
            key={site}
            onClick={() => setUrl(site === 'My Site' ? 'ai-accessibility-analyser.vercel.app' : site)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '3px 10px',
              color: 'var(--text-dim)',
              fontSize: '12px',
              fontFamily: 'Space Mono, monospace',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--green)'
              e.target.style.color = 'var(--green)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)'
              e.target.style.color = 'var(--text-dim)'
            }}
          >
            {site}
          </button>
        ))}
      </div>
    </div>
  )
}

export default URLInput