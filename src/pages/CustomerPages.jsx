import { useState, useEffect } from 'react'
import Icon from '../components/Icon.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { ST, PAY_META, PROOF_LABELS, PRICING, NOTIF, ROWS, PAYMENTS, fitMeta, fmtDate, initials } from '../data.js'
import {
  getMyJobs, getMyPayments, getMyNotifications, markNotificationsRead,
  getSupportMessages, sendSupportMessage, getMyProfile, upsertMyProfile,
  getMyClient, getPackages, getScholarships,
} from '../lib/db.js'
import { listDocuments } from '../lib/storage.js'

// Mock client ID for demo preview (used when no real auth)
const DEMO_UID = 'u4'

const fin = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

function useClientData(clientId, fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) { setLoading(false); return }
    let cancelled = false
    setLoading(true)
    fetcher(clientId).then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, ...deps])

  return { data, loading, setData }
}

function decRow(r, approvals = {}) {
  const ap = approvals[r.id] || r.approval
  const sm = r.status ? ST[r.status] : null
  const fm = fitMeta(r.fit)
  return {
    ...r, ap,
    statusLabel: sm ? sm.l : '—', statusC: sm ? sm.c : '#5F6B68', statusB: sm ? sm.b : '#ECEAE3',
    fitTier: fm.tier, fitC: fm.c, fitB: fm.b,
    deadlineFmt: fmtDate(r.deadline), appliedFmt: r.applied ? fmtDate(r.applied) : '—',
    apApproved: ap === 'approved', apDeclined: ap === 'declined', apPending: ap === 'pending',
    proofType: r.proof ? PROOF_LABELS[r.proof] : null,
  }
}

// When clientId is null (demo preview), fall back to mock data for that client
function getMockJobs(clientId) {
  return Promise.resolve(ROWS.filter(r => r.uid === (clientId || DEMO_UID)))
}

function getMockPayments(clientId) {
  return Promise.resolve(PAYMENTS.filter(p => p.uid === (clientId || DEMO_UID)))
}

function getMockNotifs() {
  return Promise.resolve(NOTIF)
}

const NOTIF_ICON = { interview: 'star', applied: 'send', job: 'briefcase', drafting: 'file', reply: 'chat', paid: 'card' }
const NOTIF_ACCENT = { interview: '#6B3FA0', applied: '#1F7A4D', job: 'var(--accent)', drafting: '#1E4E8C', reply: 'var(--muted)', paid: '#1F7A4D' }

// ── Dashboard ────────────────────────────────────────────────────────────────

export function CustomerDashboard({ clientId, approvals, onApprove, onDecline, onGoJobs, onGoApps, onGoUpgrade, onGoProfile, onGoNotify }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID

  const { data: jobs } = useClientData(clientId, isReal ? getMyJobs : getMockJobs)
  const { data: notifs } = useClientData(clientId, isReal ? getMyNotifications : getMockNotifs)
  const { data: client } = useClientData(clientId, isReal ? getMyClient : () => Promise.resolve(null))

  const rawJobs = jobs || ROWS.filter(r => r.uid === DEMO_UID)
  const myRows = rawJobs.map(r => decRow(r, approvals))
  const myPending = myRows.filter(r => r.apPending)
  const myApplied = myRows.filter(r => r.ap === 'approved' && r.status)

  const tracker = [
    { label: t('cust.dash.tApplied'), count: myApplied.filter(r => ['applied', 'interview', 'rejected', 'follow_up_needed'].includes(r.status)).length, icon: 'send', c: '#1F7A4D' },
    { label: t('cust.dash.tInterview'), count: myApplied.filter(r => r.status === 'interview').length, icon: 'star', c: '#6B3FA0' },
    { label: t('cust.dash.tInProgress'), count: myApplied.filter(r => ['drafting', 'qc', 'approved'].includes(r.status)).length, icon: 'clock', c: '#8A6100' },
    { label: t('cust.dash.tPending'), count: myPending.length, icon: 'briefcase', c: 'var(--accent)' },
  ]

  const showPending = myPending.slice(0, 3)
  const notifTop = (notifs || NOTIF).slice(0, 3)

  const displayName = client?.name || 'Nandini'
  const appsRemaining = client?.remaining ?? 77
  const appsTotal = client?.total ?? 100
  const appsUsed = client?.used ?? 23
  const packageName = client?.pkg || 'Professional'
  const pct = appsTotal > 0 ? `${Math.round((appsUsed / appsTotal) * 100)}%` : '0%'

  return (
    <div style={{ padding: '26px 30px', maxWidth: 1180 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, margin: 0 }}>{t('cust.dash.welcome')}, {displayName}</h1>
          <p style={{ color: 'var(--muted)', margin: '5px 0 0', fontSize: 14 }}>{t('cust.dash.thisWeek')}</p>
        </div>
        <button onClick={onGoJobs} className="tap-target" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 17px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          {t('cust.dash.reviewJobs', { n: myPending.length })}
        </button>
      </div>

      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>{t('cust.dash.tracker')}</h2>
              <button onClick={onGoApps} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.viewAll')}</button>
            </div>
            <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {tracker.map((tr, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: tr.c }}>
                    <Icon name={tr.icon} size={16} />
                    <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)' }}>{tr.count}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{tr.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>{t('cust.dash.awaiting')}</h2>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '3px 9px', borderRadius: 7 }}>{t('cust.dash.pendingBadge', { n: myPending.length })}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 14px' }}>{t('cust.dash.nothingSubmitted')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {showPending.map(r => (
                <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 11, padding: 14, display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: 10, fontWeight: 700, fontSize: 14, background: r.fitB, color: r.fitC, flexShrink: 0 }}>{r.fit}%</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</span>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {r.company} · {r.loc}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.fitC, background: r.fitB, padding: '3px 8px', borderRadius: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.fitC }} />{r.fitTier} fit
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t('cust.dash.deadline', { d: r.deadlineFmt })}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: '6px 0 0' }}>{r.reason}</p>
                    <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
                      {r.apPending && <>
                        <button onClick={() => onApprove(r.id)} className="tap-target" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.approve')}</button>
                        <button onClick={() => onDecline(r.id)} className="tap-target" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.skip')}</button>
                      </>}
                      {r.apApproved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1F7A4D', fontWeight: 600, fontSize: 13 }}><Icon name="check" size={15} />{t('cust.dash.approvedSent')}</span>}
                      {r.apDeclined && <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>{t('cust.dash.skipped')}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 13, opacity: .8 }}>{packageName} package</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '4px 0 12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 600 }}>{appsRemaining}</span>
              <span style={{ opacity: .8, fontSize: 14 }}>{t('cust.dash.ofLeft', { total: appsTotal })}</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,.18)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct, background: 'var(--accent)', borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 12, opacity: .75, marginTop: 8 }}>{t('cust.dash.appsUsedCount', { n: appsUsed })}</div>
            <button onClick={onGoUpgrade} style={{ width: '100%', marginTop: 14, padding: 10, borderRadius: 9, background: 'rgba(255,255,255,.14)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.topUpOrUpgrade')}</button>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h2 style={{ fontSize: 15, margin: '0 0 12px' }}>{t('cust.dash.profileCard')}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700 }}>{initials(displayName)}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{displayName}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{client?.role || 'Senior UX Designer'}</div>
              </div>
            </div>
            <button onClick={onGoProfile} style={{ width: '100%', marginTop: 6, padding: 9, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--on-surface)' }}>{t('cust.dash.editProfile')}</button>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 15, margin: 0 }}>{t('cust.dash.recentUpdates')}</h2>
              <button onClick={onGoNotify} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.all')}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notifTop.map(n => (
                <div key={n.id} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--primary)', flexShrink: 0 }}>
                    <Icon name={NOTIF_ICON[n.type] || 'bell'} size={15} />
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{n.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Jobs ─────────────────────────────────────────────────────────────────────

export function CustomerJobs({ clientId, approvals, onApprove, onDecline }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID
  const { data: jobs } = useClientData(clientId, isReal ? getMyJobs : getMockJobs)
  const myRows = (jobs || ROWS.filter(r => r.uid === DEMO_UID)).map(r => decRow(r, approvals))

  return (
    <div style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('cust.jobs.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('cust.jobs.subtitle')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {myRows.map(r => (
          <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 52, height: 52, borderRadius: 11, fontWeight: 700, fontSize: 15, background: r.fitB, color: r.fitC, flexShrink: 0 }}>{r.fit}%</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{r.title}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {r.company} · {r.loc}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.fitC, background: r.fitB, padding: '3px 8px', borderRadius: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.fitC }} />{r.fitTier} fit
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: r.statusC, background: r.statusB, padding: '3px 8px', borderRadius: 6 }}>{r.statusLabel}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t('cust.dash.deadline', { d: r.deadlineFmt })} · {t('cust.jobs.via')} {r.source}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: '4px 0 0' }}>{r.reason}</p>
              <div style={{ display: 'flex', gap: 9, marginTop: 12, alignItems: 'center' }}>
                {r.apPending && <>
                  <button onClick={() => onApprove(r.id)} className="tap-target" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.approve')}</button>
                  <button onClick={() => onDecline(r.id)} className="tap-target" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('cust.dash.skip')}</button>
                </>}
                {r.apApproved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1F7A4D', fontWeight: 600, fontSize: 13 }}><Icon name="check" size={15} />{t('cust.jobs.approved')}</span>}
                {r.apDeclined && <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>{t('cust.dash.skipped')}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Applications ──────────────────────────────────────────────────────────────

export function CustomerApplications({ clientId, approvals }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID
  const { data: jobs } = useClientData(clientId, isReal ? getMyJobs : getMockJobs)
  const myRows = (jobs || ROWS.filter(r => r.uid === DEMO_UID))
    .filter(r => r.status)
    .map(r => decRow(r, approvals))

  return (
    <div className="container" style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('cust.apps.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('cust.apps.subtitle')}</p>
      <div className="data-table" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div className="data-table-head" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.2fr', gap: 12, padding: '12px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <span>{t('cust.apps.colRole')}</span><span>{t('cust.apps.colStatus')}</span><span>{t('cust.apps.colApplied')}</span><span>{t('cust.apps.colProof')}</span>
        </div>
        {myRows.map(r => (
          <div key={r.id} className="data-table-row" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.2fr', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.company} · {r.loc}</div>
            </div>
            <span data-label={t('cust.apps.colStatus')} style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '4px 9px', borderRadius: 7 }}>{r.statusLabel}</span>
            <span data-label={t('cust.apps.colApplied')} style={{ fontSize: 13, color: 'var(--muted)' }}>{r.appliedFmt}</span>
            {r.proofType && (
              <span data-label={t('cust.apps.colProof')} style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                <Icon name="shield" size={14} />{r.proofType}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Documents ─────────────────────────────────────────────────────────────────

export function CustomerDocuments({ clientId }) {
  const { t } = useLang()
  const [docs, setDocs] = useState(null)

  useEffect(() => {
    if (!clientId || clientId === DEMO_UID) {
      setDocs([
        { name: 'CV — MAS Holdings', meta: 'Tailored CV v3 · Jun 18 · PDF' },
        { name: 'Cover letter — MAS Holdings', meta: 'Sustainability-focused · Jun 18 · PDF' },
        { name: 'CV — WSO2', meta: 'Tailored CV v2 · Jun 15 · PDF' },
        { name: 'Cover letter — 99x Design Lead', meta: 'Leadership framing · Jun 14 · PDF' },
      ])
      return
    }
    listDocuments(clientId)
      .then(files => setDocs(files.map(f => ({
        name: f.name,
        meta: `${Math.round((f.size || 0) / 1024)} KB`,
        url: f.url,
      }))))
      .catch(() => setDocs([]))
  }, [clientId])

  return (
    <div className="container" style={{ padding: '26px 30px', maxWidth: 920 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('cust.docs.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('cust.docs.subtitle')}</p>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {(docs || []).map((d, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', gap: 13, alignItems: 'center' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--primary)', flexShrink: 0 }}>
              <Icon name="file" size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{d.meta}</div>
            </div>
            {d.url
              ? <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', flexShrink: 0 }}>{t('cust.docs.download')}</a>
              : <button type="button" className="tap-target" style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}>{t('cust.docs.download')}</button>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Payments ─────────────────────────────────────────────────────────────────

export function CustomerPayments({ clientId }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID
  const { data: payments } = useClientData(clientId, isReal ? getMyPayments : getMockPayments)
  const list = payments || PAYMENTS.filter(p => p.uid === DEMO_UID)
  const p = list[0]

  const pm = p ? PAY_META[p.status] : null

  return (
    <div className="container" style={{ padding: '26px 30px', maxWidth: 880 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 18px' }}>{t('cust.pay.title')}</h1>
      {p && (
        <>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{p.pkg || 'Package'}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600 }}>USD {Number(p.amount || 0).toFixed(2)}</div>
              </div>
              {pm && <span style={{ fontSize: 12, fontWeight: 700, color: pm.c, background: pm.b, padding: '5px 11px', borderRadius: 8 }}>{pm.l}</span>}
            </div>
          </div>
          <div className="data-table" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div className="data-table-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, padding: '12px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
              <span>{t('cust.pay.colInvoice')}</span><span>{t('cust.pay.colMethod')}</span><span>{t('cust.pay.colDate')}</span><span style={{ textAlign: 'right' }}>{t('cust.pay.colStatus')}</span>
            </div>
            {list.map(pay => {
              const m = PAY_META[pay.status]
              return (
                <div key={pay.id} className="data-table-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, padding: '14px 18px', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                  <span data-label={t('cust.pay.colInvoice')} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{pay.ref}</span>
                  <span data-label={t('cust.pay.colMethod')} style={{ fontSize: 13 }}>{pay.method}</span>
                  <span data-label={t('cust.pay.colDate')} style={{ fontSize: 13, color: 'var(--muted)' }}>{fmtDate(pay.date)}</span>
                  <span data-label={t('cust.pay.colStatus')} style={{ textAlign: 'right' }}>
                    {m && <span style={{ fontSize: 11, fontWeight: 700, color: m.c, background: m.b, padding: '4px 9px', borderRadius: 7 }}>{m.l} · ${pay.paid}</span>}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
      {!p && <p style={{ color: 'var(--muted)', fontSize: 14 }}>No payment records yet.</p>}
    </div>
  )
}

// ── Upgrade ───────────────────────────────────────────────────────────────────

export function CustomerUpgrade({ onUpgrade }) {
  const { t } = useLang()
  const [packages, setPackages] = useState(null)

  useEffect(() => {
    getPackages().then(setPackages).catch(() => setPackages(null))
  }, [])

  const paid = (packages || PRICING).filter(p => p.price > 0)

  return (
    <div style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', padding: '20px 22px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 11, background: 'var(--accent)', color: '#fff', flexShrink: 0 }}>
          <Icon name="spark" size={22} />
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent-2)' }}>{t('cust.up.kicker')}</div>
          <div style={{ fontSize: 14, color: 'var(--accent-2)', opacity: .9 }}>{t('cust.up.kickerBody')}</div>
        </div>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 18px' }}>{t('cust.up.choosePackage')}</h1>
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {paid.map(p => {
          const hi = p.hi
          return (
            <div key={p.name} style={{
              position: 'relative', display: 'flex', flexDirection: 'column', gap: 18,
              background: hi ? 'var(--primary)' : 'var(--surface)',
              color: hi ? 'var(--on-primary)' : 'var(--on-surface)',
              border: hi ? 'none' : '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '28px 22px',
            }}>
              {hi && <span style={{ position: 'absolute', top: -11, left: 22, padding: '4px 11px', borderRadius: 7, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700 }}>{t('pricing.mostPopular')}</span>}
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 13, opacity: hi ? .8 : 1, color: hi ? 'inherit' : 'var(--muted)', marginTop: 4 }}>{p.blurb}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600 }}>${p.price}</span>
                <span style={{ opacity: hi ? .8 : 1, color: hi ? 'inherit' : 'var(--muted)', fontSize: 14 }}>· {p.apps} {t('pricing.applications')}</span>
              </div>
              <button onClick={onUpgrade} className="tap-target" style={{ width: '100%', padding: '11px', borderRadius: 9, background: hi ? 'var(--accent)' : 'var(--surface-2)', color: hi ? '#fff' : 'var(--on-surface)', border: hi ? 'none' : '1px solid var(--border)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                {p.cta}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Notifications ─────────────────────────────────────────────────────────────

export function CustomerNotifications({ clientId }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID
  const { data: notifs } = useClientData(clientId, isReal ? getMyNotifications : getMockNotifs)
  const list = notifs || NOTIF

  useEffect(() => {
    if (isReal) markNotificationsRead(clientId).catch(() => {})
  }, [clientId, isReal])

  return (
    <div style={{ padding: '26px 30px', maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('cust.notif.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('cust.notif.subtitle')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(n => {
          const accent = NOTIF_ACCENT[n.type] || 'var(--muted)'
          return (
            <div key={n.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: `3px solid ${accent}`,
              borderRadius: 10, padding: '15px 16px',
              display: 'flex', gap: 13, alignItems: 'flex-start',
              opacity: n.unread ? 1 : .85,
            }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: 'var(--surface-2)', color: 'var(--primary)', flexShrink: 0 }}>
                <Icon name={NOTIF_ICON[n.type] || 'bell'} size={16} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{n.title}{n.unread && <span style={{ marginLeft: 8, display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', verticalAlign: 'middle' }} />}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{n.t}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: '4px 0 0' }}>{n.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Support ───────────────────────────────────────────────────────────────────

export function CustomerSupport({ clientId, onSend }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID
  const [messages, setMessages] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!isReal) return
    getSupportMessages(clientId).then(setMessages).catch(() => {})
  }, [clientId, isReal])

  async function handleSend() {
    if (!input.trim()) return
    setSending(true)
    try {
      if (isReal) {
        await sendSupportMessage(clientId, input.trim())
        const msgs = await getSupportMessages(clientId)
        setMessages(msgs)
      }
      setInput('')
      onSend?.()
    } catch (_) {
      onSend?.()
    }
    setSending(false)
  }

  const displayMessages = isReal ? (messages || []) : null

  return (
    <div style={{ padding: '26px 30px', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('cust.sup.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('cust.sup.subtitle')}</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        {displayMessages !== null ? displayMessages.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: 11, flexDirection: m.sender === 'client' ? 'row-reverse' : 'row' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {m.sender === 'client' ? 'Me' : initials(m.staff?.name || 'ATG')}
            </span>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 11, padding: '12px 14px', maxWidth: '80%' }}>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.body}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>
                {m.sender === 'staff' ? `${m.staff?.name || 'ATG'} · ATG team` : 'You'}
              </div>
            </div>
          </div>
        )) : (
          <div style={{ display: 'flex', gap: 11 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>RP</span>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 11, borderTopLeftRadius: 3, padding: '12px 14px' }}>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>Hi — your IFS application is queued and will be prepared this week. Anything else you'd like us to prioritise?</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>Roshan · ATG team · 4 days ago</div>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <label htmlFor="support-msg" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t('contact.formMessage')}</label>
        <input
          id="support-msg"
          name="message"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={t('cust.sup.placeholder')}
          style={{ flex: 1, padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface)', fontSize: 14, color: 'inherit', fontFamily: 'inherit' }}
        />
        <button onClick={handleSend} disabled={sending} className="tap-target" style={{ padding: '12px 20px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: sending ? .7 : 1 }}>{t('cust.sup.send')}</button>
      </div>
    </div>
  )
}

// ── Profile ───────────────────────────────────────────────────────────────────

export function CustomerProfile({ clientId, onSave }) {
  const { t } = useLang()
  const isReal = clientId && clientId !== DEMO_UID
  const { data: client } = useClientData(clientId, isReal ? getMyClient : () => Promise.resolve(null))
  const { data: profile } = useClientData(clientId, isReal ? getMyProfile : () => Promise.resolve(null))

  const [name, setName] = useState('')
  const [targetRoles, setTargetRoles] = useState('')
  const [locations, setLocations] = useState('')

  useEffect(() => {
    if (client) setName(client.name || '')
    if (profile) {
      setTargetRoles((profile.target_roles || []).join(', '))
      setLocations((profile.target_locations || []).join(', '))
    }
  }, [client, profile])

  async function handleSave() {
    if (isReal) {
      try {
        await upsertMyProfile(clientId, {
          target_roles: targetRoles.split(',').map(s => s.trim()).filter(Boolean),
          target_locations: locations.split(',').map(s => s.trim()).filter(Boolean),
        })
      } catch (_) { /* non-blocking */ }
    }
    onSave?.()
  }

  const displayName = client?.name || 'Nandini'
  const displayEmail = client?.email || 'nandini@gmail.com'

  return (
    <div className="container" style={{ padding: '26px 30px', maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 18px' }}>{t('cust.prof.title')}</h1>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label htmlFor="prof-name" style={flbl}>{t('signup.fullName')}</label>
            <input id="prof-name" name="fullName" value={name} onChange={e => setName(e.target.value)} style={fin} />
          </div>
          <div>
            <label htmlFor="prof-email" style={flbl}>{t('signup.email')}</label>
            <input id="prof-email" name="email" type="email" value={displayEmail} readOnly style={{ ...fin, opacity: .7, cursor: 'not-allowed' }} />
          </div>
          <div>
            <label htmlFor="prof-roles" style={flbl}>{t('cust.dash.targetRolesLabel')}</label>
            <input id="prof-roles" name="targetRoles" value={targetRoles} onChange={e => setTargetRoles(e.target.value)} placeholder="e.g. Senior UX Designer, Product Designer" style={fin} />
          </div>
          <div>
            <label htmlFor="prof-locations" style={flbl}>{t('cust.dash.locationsLabel')}</label>
            <input id="prof-locations" name="locations" value={locations} onChange={e => setLocations(e.target.value)} placeholder="e.g. Colombo, Remote" style={fin} />
          </div>
        </div>
        <button onClick={handleSave} className="tap-target" style={{ alignSelf: 'flex-start', padding: '11px 20px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{t('cust.prof.saveChanges')}</button>
      </div>
    </div>
  )
}

// ── Scholarships ──────────────────────────────────────────────────────────────

const DEGREE_COLORS = {
  phd: { b: '#EDE9F8', c: '#6B3FA0' },
  postdoc: { b: '#E8F4FD', c: '#1E4E8C' },
  masters: { b: '#E6F4EC', c: '#1F7A4D' },
  undergraduate: { b: '#FFF4E0', c: '#8A6100' },
}

const MOCK_SCHOLARSHIPS = [
  { id: 's1', title: 'Commonwealth Scholarships — Masters & PhD', source_name: 'Commonwealth Scholarship Commission', source_url: 'https://cscuk.fcdo.gov.uk/apply/', country: 'UK', degree_level: 'masters', deadline: '2026-10-15', fully_funded: true, description: 'Full scholarships for citizens of Commonwealth countries to study at UK universities. Covers tuition, living allowance, and return flights.' },
  { id: 's2', title: 'Chevening Scholarships 2026–27', source_name: 'UK Foreign Commonwealth & Development Office', source_url: 'https://www.chevening.org/apply/', country: 'UK', degree_level: 'masters', deadline: '2026-11-04', fully_funded: true, description: 'UK government global scholarship programme for one-year master\'s degrees. Open to professionals with leadership potential.' },
  { id: 's3', title: 'DAAD Research Grants — Doctoral Programmes', source_name: 'DAAD Germany', source_url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/', country: 'Germany', degree_level: 'phd', deadline: '2026-10-01', fully_funded: true, description: 'Monthly stipend, travel allowance, and health insurance for doctoral researchers at German universities.' },
  { id: 's4', title: 'Australia Awards Scholarships', source_name: 'Australia Awards', source_url: 'https://www.australiaawards.gov.au/', country: 'Australia', degree_level: 'masters', deadline: '2026-04-30', fully_funded: true, description: 'Long-term development scholarships funded by the Australian Government for citizens of eligible countries in the Indo-Pacific region.' },
  { id: 's5', title: 'Banting Postdoctoral Fellowships', source_name: 'Global Affairs Canada', source_url: 'https://banting.fellowships-bourses.gc.ca/', country: 'Canada', degree_level: 'postdoc', deadline: '2026-09-17', fully_funded: true, description: 'CAD $70,000/year for two years at a Canadian university. Open to international researchers.' },
  { id: 's6', title: 'Gilman International Scholarship', source_name: 'Gilman International Scholarship', source_url: 'https://www.gilmanscholarship.org/apply/', country: 'USA', degree_level: 'undergraduate', deadline: '2026-03-05', fully_funded: false, description: 'Grant of up to $5,000 for US undergraduates with financial need to study or intern abroad.' },
]

export function CustomerScholarships() {
  const { t } = useLang()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [liveData, setLiveData] = useState(null)
  const [loadingLive, setLoadingLive] = useState(true)

  useEffect(() => {
    getScholarships({ limit: 100 })
      .then(data => { setLiveData(data.length > 0 ? data : null); setLoadingLive(false) })
      .catch(() => { setLiveData(null); setLoadingLive(false) })
  }, [])

  const source = liveData || MOCK_SCHOLARSHIPS

  const filtered = source.filter(s => {
    const matchLevel = filter === 'all' || s.degree_level === filter
    const q = search.toLowerCase()
    const matchSearch = !q || s.title.toLowerCase().includes(q) || (s.country || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
    return matchLevel && matchSearch
  })

  const levelTabs = [
    { key: 'all', label: t('cust.sch.filterAll') },
    { key: 'undergraduate', label: t('cust.sch.filterUG') },
    { key: 'masters', label: t('cust.sch.filterMasters') },
    { key: 'phd', label: t('cust.sch.filterPhD') },
    { key: 'postdoc', label: t('cust.sch.filterPostdoc') },
  ]

  return (
    <div style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('cust.sch.title')}</h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>{t('cust.sch.subtitle')}</p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 7, background: liveData ? '#E6F4EC' : 'var(--surface-2)', border: `1px solid ${liveData ? '#A3D9B8' : 'var(--border)'}`, fontSize: 12, color: liveData ? '#1F7A4D' : 'var(--muted)' }}>
          <Icon name="globe" size={13} />{loadingLive ? 'Loading…' : liveData ? `${source.length} live scholarships` : t('cust.sch.poweredBy')}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
        <input
          type="search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t('cust.sch.searchPlaceholder')}
          style={{ ...fin, maxWidth: 280, flexShrink: 0 }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {levelTabs.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} className="tap-target" style={{
              padding: '7px 13px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontWeight: filter === tab.key ? 600 : 400,
              background: filter === tab.key ? 'var(--primary)' : 'var(--surface)', color: filter === tab.key ? 'var(--on-primary)' : 'var(--on-surface)', cursor: 'pointer',
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', fontSize: 14 }}>{t('cust.sch.noResults')}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(s => {
            const dc = DEGREE_COLORS[s.degree_level] || { b: 'var(--surface-2)', c: 'var(--muted)' }
            const overdue = s.deadline && new Date(s.deadline) < new Date()
            return (
              <div key={s.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 18, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 10, background: dc.b, color: dc.c, flexShrink: 0 }}>
                  <Icon name="globe" size={20} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{s.title}</span>
                    {s.fully_funded && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, background: '#E6F4EC', color: '#1F7A4D', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        <Icon name="check" size={11} />{t('cust.sch.fullyFunded')}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)', marginBottom: 7 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="globe" size={12} />{s.country || '—'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '1px 7px', borderRadius: 5, background: dc.b, color: dc.c, fontWeight: 600 }}>{t(`cust.sch.level.${s.degree_level}`)}</span>
                    {s.deadline && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: overdue ? '#C0392B' : 'var(--muted)' }}>
                        <Icon name="clock" size={12} />{t('cust.sch.deadline')}: {s.deadline}
                      </span>
                    )}
                    <span>{t('cust.sch.source')}: {s.source_name}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 10px', lineHeight: 1.5 }}>{s.description}</p>
                  <a href={s.source_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    {t('cust.sch.apply')} <Icon name="send" size={13} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
