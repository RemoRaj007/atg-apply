import { useState } from 'react'
import { useAuth } from '../lib/AuthContext.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

const fin = { width: '100%', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

export default function LoginPage({ onSuccess, onSignup }) {
  const { signIn } = useAuth()
  const { t } = useLang()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login') // 'login' | 'reset'
  const [resetSent, setResetSent] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      onSuccess?.()
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    if (!email) { setError('Enter your email first'); return }
    setLoading(true)
    const { error } = await import('../lib/supabase.js').then(m =>
      m.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
    )
    setLoading(false)
    if (error) setError(error.message)
    else setResetSent(true)
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="44" height="44" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
            <rect width="36" height="36" rx="10" fill="var(--primary)" />
            <path d="M18 8.5L9 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M18 8.5L27 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M12.5 21.5H23.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <circle cx="18" cy="8.5" r="3" fill="var(--accent)" />
          </svg>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 6px' }}>
            {mode === 'login' ? 'Sign in to ATG Apply' : 'Reset your password'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            {mode === 'login' ? 'Your job search, managed by your personal ATG team.' : 'We\'ll email you a link to reset your password.'}
          </p>
        </div>

        {resetSent ? (
          <div style={{ background: '#E6F4EC', border: '1px solid #A3D9B8', borderRadius: 11, padding: 20, textAlign: 'center' }}>
            <div style={{ fontWeight: 600, color: '#1F7A4D', marginBottom: 6 }}>Check your inbox</div>
            <div style={{ fontSize: 14, color: '#1F7A4D' }}>We sent a reset link to <strong>{email}</strong></div>
            <button onClick={() => { setMode('login'); setResetSent(false) }} style={{ marginTop: 14, background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={mode === 'login' ? handleLogin : handleReset} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="login-email" style={flbl}>Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={fin}
              />
            </div>

            {mode === 'login' && (
              <div>
                <label htmlFor="login-password" style={flbl}>Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  style={fin}
                />
              </div>
            )}

            {error && (
              <div style={{ background: '#F7E5E2', border: '1px solid #F1B0A8', borderRadius: 9, padding: '11px 14px', fontSize: 13, color: '#B23A2E' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 15, cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1 }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Send reset link'}
            </button>

            {mode === 'login' && (
              <div style={{ textAlign: 'center' }}>
                <button type="button" onClick={() => { setMode('reset'); setError(null) }} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <button type="button" onClick={() => { setMode('login'); setError(null) }} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', textAlign: 'center' }}>
                Back to sign in
              </button>
            )}
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          New to ATG Apply?{' '}
          <button onClick={onSignup} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            Get started free →
          </button>
        </div>
      </div>
    </div>
  )
}
