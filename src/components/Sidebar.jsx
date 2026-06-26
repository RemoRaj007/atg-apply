import Icon from './Icon.jsx'

function NavBtn({ label, iconName, active, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%',
        padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
        fontSize: 14, fontWeight: active ? 600 : 500, textAlign: 'left',
        background: active ? 'var(--surface-3)' : 'transparent',
        color: active ? 'var(--on-surface)' : 'var(--muted)',
      }}
    >
      <span style={{ display: 'grid', placeItems: 'center', width: 20, height: 20 }}>
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

export default function Sidebar({ role, view, onNav, userNav, adminNav, whoName, whoRole, whoInitials }) {
  const navItems = role === 'user' ? userNav : adminNav
  const navLabel = role === 'user' ? 'My account' : 'Operator console'

  return (
    <aside style={{
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      padding: '18px 12px', display: 'flex', flexDirection: 'column', gap: 4,
      width: 248, minHeight: 'calc(100vh - 60px)',
    }}>
      <div style={{ padding: '6px 12px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {navLabel}
      </div>
      {navItems.map(item => (
        <NavBtn
          key={item.view}
          label={item.label}
          iconName={item.icon}
          active={view === item.view}
          badge={item.badge}
          onClick={() => onNav(item.view)}
        />
      ))}
      <span style={{ flex: 1 }} />
      <div style={{ marginTop: 12, padding: 13, borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: 'var(--on-primary)', fontWeight: 600, fontSize: 14 }}>
            {whoInitials}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{whoName}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{whoRole}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
