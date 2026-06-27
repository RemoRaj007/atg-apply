import Icon from './Icon.jsx'

export default function Toast({ message, onClose }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)',
        zIndex: 'var(--z-toast)', display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 14px 13px 18px', borderRadius: 11,
        background: 'var(--primary)', color: 'var(--on-primary)',
        boxShadow: 'var(--shadow)', fontSize: 14, fontWeight: 500,
        animation: 'fadeUp .25s ease-out',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      <Icon name="check" size={18} style={{ flexShrink: 0 }} />
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          style={{
            display: 'grid', placeItems: 'center', width: 28, height: 28, marginLeft: 2,
            background: 'rgba(255,255,255,.14)', border: 'none', borderRadius: 7,
            color: 'inherit', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  )
}
