import Icon from './Icon.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

function NavBtn({ label, iconName, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="tap-target"
      aria-current={active ? 'page' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%',
        padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
        fontSize: 'var(--text-base)', fontWeight: active ? 600 : 500, textAlign: 'left',
        background: active ? 'var(--surface-3)' : 'transparent',
        color: active ? 'var(--on-surface)' : 'var(--muted)',
      }}
    >
      <span style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, flexShrink: 0 }}>
        <Icon name={iconName} size={18} />
      </span>
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      {badge != null && badge > 0 && (
        <span style={{
          minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
          background: 'var(--accent)', color: '#fff',
          fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center',
        }}>{badge}</span>
      )}
    </button>
  )
}

export default function Sidebar({ role, view, onNav, userNav, adminNav, whoName, whoRole, whoInitials, isOpen, onClose, onSignOut, isLoggedIn }) {
  const { t } = useLang()
  const navItems = role === 'user' ? userNav : adminNav
  const navLabel = role === 'user' ? t('cust.nav.label') : t('admin.nav.label')

  return (
    <>
      <div
        className={`sidebar-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`sidebar${isOpen ? ' is-open' : ''}`}
        aria-label={navLabel}
        style={{
          background: 'var(--surface)', borderRight: '1px solid var(--border)',
          padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 4,
          width: 'var(--sidebar-w)', minHeight: 'calc(100vh - var(--header-h))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px 14px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            {navLabel}
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="hide-desktop tap-target"
            style={{ display: 'none', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        {navItems.map(item => (
          <NavBtn
            key={item.view}
            label={item.label}
            iconName={item.icon}
            active={view === item.view}
            badge={item.badge}
            onClick={() => { onNav(item.view); onClose?.() }}
          />
        ))}
        <span style={{ flex: 1 }} />
        <div style={{ marginTop: 12, padding: 13, borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: 'var(--on-primary)', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
              {whoInitials}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{whoName}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{whoRole}</div>
            </div>
            {isLoggedIn && onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign out"
                aria-label="Sign out"
                style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 7, background: 'none', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--muted)', flexShrink: 0 }}
              >
                <Icon name="logout" size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
