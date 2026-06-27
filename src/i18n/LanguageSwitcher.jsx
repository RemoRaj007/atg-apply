import { useState, useRef, useEffect } from 'react'
import { useLang } from './LanguageContext.jsx'
import Icon from '../components/Icon.jsx'

export default function LanguageSwitcher({ compact }) {
  const { lang, setLang, languages } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = languages.find(l => l.code === lang) || languages[0]

  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className="tap-target"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 38, padding: compact ? '0 9px' : '0 12px', borderRadius: 9,
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--on-surface)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}
      >
        <Icon name="globe" size={16} />
        {!compact && <span style={{ maxWidth: 64, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current.native}</span>}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 'var(--z-dropdown)',
            minWidth: 200, maxHeight: 320, overflowY: 'auto',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11,
            boxShadow: 'var(--shadow-lg)', padding: 6,
          }}
        >
          {languages.map(l => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => { setLang(l.code); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                width: '100%', padding: '9px 11px', borderRadius: 8, border: 'none',
                background: l.code === lang ? 'var(--surface-3)' : 'transparent',
                color: 'var(--on-surface)', cursor: 'pointer', fontSize: 14, fontWeight: l.code === lang ? 600 : 500,
                textAlign: 'left', fontFamily: 'inherit',
              }}
            >
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span>{l.native}</span>
                {l.native !== l.label && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{l.label}</span>}
              </span>
              {l.code === lang && <Icon name="check" size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
