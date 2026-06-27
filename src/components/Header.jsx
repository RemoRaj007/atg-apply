import Icon from './Icon.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import LanguageSwitcher from '../i18n/LanguageSwitcher.jsx'

export default function Header({ role, view, onViewPublic, onViewUser, onViewAdmin, onToggleTheme, onGoHome, onGoArch, onToggleMenu, showMenuToggle, theme }) {
  const { t } = useLang()
  const segStyle = (active) => ({
    padding: '6px 13px', borderRadius: 7, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 600,
    background: active ? 'var(--surface)' : 'transparent',
    color: active ? 'var(--on-surface)' : 'var(--muted)',
    boxShadow: active ? 'var(--shadow-sm)' : 'none',
    minHeight: 32,
  })
  const iconBtn = {
    display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 9,
    background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--muted)',
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '0 16px', height: 'var(--header-h)',
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
        {showMenuToggle && (
          <button
            className="menu-toggle tap-target"
            onClick={onToggleMenu}
            aria-label="Open navigation menu"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface)', marginRight: 2 }}
          >
            <Icon name="menu" size={22} />
          </button>
        )}
        <button
          onClick={onGoHome}
          style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 4px', color: 'inherit', minWidth: 0 }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect width="36" height="36" rx="10" fill="var(--primary)" />
            <path d="M18 8.5L9 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M18 8.5L27 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M12.5 21.5H23.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <circle cx="18" cy="8.5" r="3" fill="var(--accent)" />
          </svg>
          <span className="hide-mobile" style={{ display: 'flex', alignItems: 'baseline', gap: 0, lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '-.02em', color: 'var(--on-surface)' }}>ATG</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 17, letterSpacing: '-.01em', color: 'var(--muted)', paddingLeft: 4 }}>Apply</span>
          </span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          role="tablist"
          aria-label={t('nav.previewLabel')}
          title={t('nav.previewLabel')}
          className="hide-mobile"
          style={{ display: 'flex', background: 'var(--surface-3)', border: '1px dashed var(--border-2)', borderRadius: 9, padding: 3, gap: 2 }}
        >
          <button role="tab" aria-selected={role === 'public'} onClick={onViewPublic} style={segStyle(role === 'public')}>{t('nav.visitor')}</button>
          <button role="tab" aria-selected={role === 'user'} onClick={onViewUser} style={segStyle(role === 'user')}>{t('nav.customer')}</button>
          <button role="tab" aria-selected={role === 'admin'} onClick={onViewAdmin} style={segStyle(role === 'admin')}>{t('nav.operator')}</button>
        </div>
        <button
          onClick={onGoArch}
          title={t('nav.architecture')}
          aria-label={t('nav.architecture')}
          className="hide-mobile"
          style={iconBtn}
        >
          <Icon name="grid" size={18} />
        </button>
        <LanguageSwitcher compact />
        <button
          onClick={onToggleTheme}
          title={t('nav.toggleTheme')}
          aria-label={t('nav.toggleTheme')}
          aria-pressed={theme === 'dark'}
          style={iconBtn}
        >
          <Icon name="moon" size={18} />
        </button>
      </div>
    </header>
  )
}
