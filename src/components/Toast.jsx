import Icon from './Icon.jsx'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div
      role="status"
      style={{
        position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 18px', borderRadius: 11,
        background: 'var(--primary)', color: 'var(--on-primary)',
        boxShadow: 'var(--shadow)', fontSize: 14, fontWeight: 500,
        animation: 'fadeUp .25s ease-out',
      }}
    >
      <Icon name="check" size={18} />
      {message}
    </div>
  )
}
