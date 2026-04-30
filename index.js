import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

function Particle({ style }) {
  return <div className="particle" style={style} />
}

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [timeLeft, setTimeLeft] = useState(null)
  const [particles, setParticles] = useState([])
  const inputRef = useRef(null)

  // Countdown: from 1 PM today (Apr 30 2026) to two weeks later (May 14 2026 1PM)
  useEffect(() => {
    const endDate = new Date('2026-05-14T13:00:00')

    const tick = () => {
      const now = new Date()
      const diff = endDate - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  // Generate floating bean particles
  useEffect(() => {
    const ps = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 120 + '%',
      size: Math.random() * 18 + 8 + 'px',
      delay: Math.random() * 8 + 's',
      duration: Math.random() * 10 + 8 + 's',
      opacity: Math.random() * 0.25 + 0.05,
      rotate: Math.random() * 360 + 'deg',
    }))
    setParticles(ps)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setErrorMsg('Enter a valid email.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Try again.')
    }
  }

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <>
      <Head>
        <title>Stop The Beans</title>
        <meta name="description" content="Something is coming. Sign up to stop the beans." />
        <meta property="og:title" content="Stop The Beans" />
        <meta property="og:description" content="You saw what happened. Don't let it happen again." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div className="wrapper">
        {/* Animated bean particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="bean-float"
            style={{
              left: p.left,
              top: p.top,
              fontSize: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
              transform: `rotate(${p.rotate})`,
            }}
          >
            🫘
          </div>
        ))}

        {/* Noise overlay */}
        <div className="noise" />

        {/* Grid lines */}
        <div className="grid-lines" />

        <main>
          {/* ALERT BANNER */}
          <div className="alert-bar">
            <span className="alert-dot" />
            INCIDENT DETECTED &nbsp;·&nbsp; ORIGIN: UNKNOWN &nbsp;·&nbsp; STATUS: ACTIVE
          </div>

          {/* HERO */}
          <section className="hero">
            <div className="hero-inner">
              <p className="eyebrow">⚠ CLASSIFIED OPERATION</p>
              <h1 className="headline">
                STOP<br />
                <span className="accent">THE</span><br />
                BEANS.
              </h1>
              <p className="subhead">
                You've seen the video.<br />
                You know what's at stake.<br />
                The next incident drops in&nbsp;—
              </p>

              {/* COUNTDOWN */}
              {timeLeft && (
                <div className="countdown">
                  {[
                    { label: 'DAYS', val: timeLeft.days },
                    { label: 'HRS', val: timeLeft.hours },
                    { label: 'MIN', val: timeLeft.minutes },
                    { label: 'SEC', val: timeLeft.seconds },
                  ].map(({ label, val }) => (
                    <div className="cd-unit" key={label}>
                      <div className="cd-num">{pad(val)}</div>
                      <div className="cd-label">{label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="cta-section">
                <p className="cta-label">
                  Register your email to receive an <strong>emergency alert</strong> when beta drops.
                </p>

                {status === 'success' ? (
                  <div className="success-msg">
                    ✓ &nbsp;You're registered. Stay vigilant.
                  </div>
                ) : (
                  <form className="email-form" onSubmit={handleSubmit}>
                    <input
                      ref={inputRef}
                      type="email"
                      className="email-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      required
                    />
                    <button
                      type="submit"
                      className={`submit-btn ${status === 'loading' ? 'loading' : ''}`}
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? '...' : 'ENLIST'}
                    </button>
                  </form>
                )}

                {errorMsg && <p className="error-msg">{errorMsg}</p>}
                <p className="fine-print">No spam. Just beans — or the prevention thereof.</p>
              </div>
            </div>
          </section>

          {/* BOTTOM STRIP */}
          <div className="bottom-strip">
            <span>OPERATION: BETA LAUNCH</span>
            <span>CLEARANCE: PENDING</span>
            <span>THREAT LEVEL: LEGUME</span>
          </div>
        </main>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #050508;
          --surface: #0d0d15;
          --border: rgba(255,255,255,0.08);
          --accent: #e8ff47;
          --accent2: #ff4747;
          --text: #f0f0f0;
          --muted: rgba(240,240,240,0.45);
          --font-display: 'Bebas Neue', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        html, body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* floating beans */
        .bean-float {
          position: fixed;
          pointer-events: none;
          animation: floatUp linear infinite;
          z-index: 0;
          user-select: none;
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }

        /* noise */
        .noise {
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
        }

        /* grid lines */
        .grid-lines {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,255,71,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,255,71,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 1;
        }

        main {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          min-height: 100vh;
        }

        /* alert bar */
        .alert-bar {
          display: flex; align-items: center; gap: 8px;
          background: var(--accent2);
          color: #fff;
          font-size: 10px;
          font-family: var(--font-body);
          font-weight: 500;
          letter-spacing: 0.15em;
          padding: 8px 24px;
          animation: pulse-bar 2s ease-in-out infinite;
        }
        @keyframes pulse-bar {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .alert-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #fff;
          animation: blink 1s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* hero */
        .hero {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: 60px 24px 40px;
        }
        .hero-inner {
          max-width: 680px; width: 100%;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 28px;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.25em;
          color: var(--accent);
          font-weight: 500;
          border: 1px solid rgba(232,255,71,0.3);
          padding: 6px 14px;
          border-radius: 2px;
        }

        .headline {
          font-family: var(--font-display);
          font-size: clamp(80px, 18vw, 160px);
          line-height: 0.88;
          letter-spacing: 0.02em;
          color: var(--text);
        }
        .headline .accent {
          color: var(--accent);
          -webkit-text-stroke: 0px;
        }

        .subhead {
          font-size: clamp(15px, 2.2vw, 19px);
          color: var(--muted);
          line-height: 1.6;
          font-weight: 300;
        }

        /* countdown */
        .countdown {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
        }
        .cd-unit {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 2px solid var(--accent);
          padding: 16px 20px 12px;
          min-width: 80px;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          position: relative;
          overflow: hidden;
        }
        .cd-unit::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 40px;
          background: linear-gradient(rgba(232,255,71,0.05), transparent);
        }
        .cd-num {
          font-family: var(--font-display);
          font-size: 52px;
          line-height: 1;
          color: var(--accent);
          letter-spacing: 0.04em;
        }
        .cd-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: var(--muted);
          font-weight: 500;
        }

        /* CTA */
        .cta-section {
          width: 100%;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 2px solid var(--accent2);
          padding: 32px 28px;
        }
        .cta-label {
          font-size: 14px;
          color: var(--muted);
          letter-spacing: 0.02em;
          line-height: 1.6;
        }
        .cta-label strong { color: var(--text); font-weight: 500; }

        .email-form {
          display: flex; gap: 0; width: 100%; max-width: 440px;
        }
        .email-input {
          flex: 1;
          background: #0a0a12;
          border: 1px solid rgba(255,255,255,0.12);
          border-right: none;
          color: var(--text);
          padding: 14px 18px;
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .email-input::placeholder { color: rgba(240,240,240,0.25); }
        .email-input:focus { border-color: var(--accent); }

        .submit-btn {
          background: var(--accent);
          color: #050508;
          border: none;
          padding: 14px 28px;
          font-family: var(--font-display);
          font-size: 20px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .submit-btn:hover { background: #f5ff6e; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn.loading { opacity: 0.6; cursor: not-allowed; }

        .success-msg {
          font-size: 15px;
          color: var(--accent);
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 14px 0;
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        .error-msg {
          font-size: 12px; color: var(--accent2);
          letter-spacing: 0.05em;
        }
        .fine-print {
          font-size: 11px; color: rgba(240,240,240,0.2);
          letter-spacing: 0.05em;
        }

        /* bottom strip */
        .bottom-strip {
          display: flex; justify-content: space-between; flex-wrap: wrap;
          gap: 8px;
          padding: 12px 28px;
          border-top: 1px solid var(--border);
          font-size: 9px;
          letter-spacing: 0.18em;
          color: rgba(240,240,240,0.2);
        }

        @media (max-width: 480px) {
          .headline { font-size: 22vw; }
          .cd-num { font-size: 38px; }
          .cd-unit { min-width: 64px; padding: 12px 14px 10px; }
          .email-form { flex-direction: column; }
          .email-input { border-right: 1px solid rgba(255,255,255,0.12); border-bottom: none; }
          .submit-btn { width: 100%; padding: 14px; }
          .bottom-strip { font-size: 8px; gap: 4px; }
        }
      `}</style>
    </>
  )
}
