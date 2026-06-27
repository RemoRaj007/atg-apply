import { useState, useEffect } from 'react'
import Icon from '../components/Icon.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'
import { ROWS, USERS, STAFF, PAYMENTS, TEMPLATES, ST, PAY_META, fitMeta, fmtDate, initials, staffName, userById } from '../data.js'
import {
  getAllClients, getClientById, getAllJobs, getJobsByClient, getQCJobs,
  getAllPayments, getAllStaff, getEmailTemplates, addJob, updateJob, updatePayment, addPaymentTrail,
} from '../lib/db.js'

function decRow(r) {
  const ap = r.approval
  const sm = r.status ? ST[r.status] : null
  const fm = fitMeta(r.fit)
  return {
    ...r, ap,
    statusLabel: sm ? sm.l : '—', statusC: sm ? sm.c : '#5F6B68', statusB: sm ? sm.b : '#ECEAE3',
    fitTier: fm.tier, fitC: fm.c, fitB: fm.b,
    deadlineFmt: fmtDate(r.deadline),
    uname: r.uname || (userById(r.uid)?.name || ''),
    staffN: r.staffN || staffName(r.staff),
  }
}

const PKG_BADGE = { Trial: '#ECEAE3', Starter: '#E4ECF7', Professional: '#E1EFE9', Premium: '#FBF0D9' }

// ── Dashboard ────────────────────────────────────────────────────────────────

export function AdminDashboard({ onGoQC, onGoPay }) {
  const { t } = useLang()
  const [clients, setClients] = useState(USERS)
  const [jobs, setJobs] = useState(ROWS)
  const [payments, setPayments] = useState(PAYMENTS)

  useEffect(() => {
    getAllClients().then(setClients).catch(() => {})
    getAllJobs().then(setJobs).catch(() => {})
    getAllPayments().then(setPayments).catch(() => {})
  }, [])

  const allRows = jobs.map(r => decRow(r))
  const qcRows = allRows.filter(r => r.status === 'qc')
  const payNeedsCount = payments.filter(p => p.status === 'pending' || p.status === 'partial').length

  const statusCounts = {}
  allRows.forEach(r => { if (r.status) statusCounts[r.status] = (statusCounts[r.status] || 0) + 1 })
  const maxCount = Math.max(...Object.values(statusCounts), 1)
  const statusList = Object.entries(ST).map(([k, v]) => ({
    key: k, label: v.l, c: v.c, count: statusCounts[k] || 0, barW: `${Math.round(((statusCounts[k] || 0) / maxCount) * 100)}%`
  })).filter(s => s.count > 0)

  const adminStats = [
    { label: t('admin.dash.activeUsers'), value: clients.filter(u => u.state === 'active').length, sub: `${clients.length} ${t('admin.dash.totalSuffix')}`, icon: 'users' },
    { label: t('admin.dash.applications'), value: jobs.length, sub: `${jobs.filter(r => r.status === 'applied').length} ${t('admin.dash.appliedSuffix')}`, icon: 'list' },
    { label: t('admin.dash.inQC'), value: qcRows.length, sub: t('admin.dash.needSignoff'), icon: 'shield' },
    { label: t('admin.dash.revenue'), value: `$${payments.reduce((s, p) => s + (Number(p.paid) || 0), 0)}`, sub: t('admin.dash.allTime'), icon: 'card' },
  ]

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: 0 }}>{t('admin.nav.label')}</h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {t('admin.dash.subtitle')}</p>
        </div>
      </div>

      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {adminStats.map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</span>
              <span style={{ color: 'var(--muted)' }}><Icon name={s.icon} size={16} /></span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, margin: '6px 0 2px' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h2 style={{ fontSize: 16, margin: '0 0 14px' }}>{t('admin.dash.byStatus')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {statusList.map(s => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 120, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>{s.label}</span>
                <div style={{ flex: 1, height: 10, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: s.barW, background: s.c, borderRadius: 99 }} />
                </div>
                <span style={{ width: 24, textAlign: 'right', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h2 style={{ fontSize: 16, margin: '0 0 14px' }}>{t('admin.dash.needsAttention')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={onGoQC} className="tap-target" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 13, cursor: 'pointer' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: '#FBF0D9', color: '#8A6100', flexShrink: 0 }}><Icon name="shield" size={18} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t('admin.dash.qcQueueLabel')}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t('admin.dash.qcQueueSub')}</div>
              </div>
              <span style={{ fontWeight: 700, color: '#8A6100' }}>{qcRows.length}</span>
            </button>
            <button onClick={onGoPay} className="tap-target" style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 13, cursor: 'pointer' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: '#E4ECF7', color: '#1E4E8C', flexShrink: 0 }}><Icon name="card" size={18} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t('admin.dash.paymentsReconcile')}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t('admin.dash.pendingOrPartial')}</div>
              </div>
              <span style={{ fontWeight: 700, color: '#1E4E8C' }}>{payNeedsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Users list ────────────────────────────────────────────────────────────────

export function AdminUsers({ onOpenUser, onGoExport }) {
  const { t } = useLang()
  const [clients, setClients] = useState(USERS)

  useEffect(() => {
    getAllClients().then(setClients).catch(() => {})
  }, [])

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: 0 }}>{t('admin.nav.users')}</h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>{clients.length} {t('admin.users.filterDesc')}</p>
        </div>
        <button onClick={onGoExport} className="tap-target" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--on-surface)' }}>
          <Icon name="download" size={15} />{t('admin.users.exportCsv')}
        </button>
      </div>
      <div className="data-table" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div className="data-table-head" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.4fr 1fr 0.6fr', gap: 12, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          <span>{t('admin.users.colUser')}</span><span>{t('admin.users.colPackage')}</span><span>{t('admin.users.colBalance')}</span><span>{t('admin.users.colStaff')}</span><span>{t('admin.users.colPayment')}</span><span />
        </div>
        {clients.map(u => {
          const pm = PAY_META[u.pay]
          return (
            <button key={u.id} onClick={() => onOpenUser(u.id)} className="data-table-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.4fr 1fr 0.6fr', gap: 12, padding: '13px 18px', border: 'none', borderBottom: '1px solid var(--border)', background: 'none', cursor: 'pointer', textAlign: 'left', alignItems: 'center', width: '100%', color: 'inherit', fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials(u.name)}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{u.city}, {u.country}</div>
                </div>
              </div>
              <span data-label={t('admin.users.colPackage')} style={{ fontSize: 12, fontWeight: 600, width: 'fit-content', background: PKG_BADGE[u.pkg] || 'var(--surface-3)', padding: '4px 10px', borderRadius: 7 }}>{u.pkg}</span>
              <span data-label={t('admin.users.colBalance')} style={{ fontSize: 13, color: 'var(--muted)' }}>{u.remaining}/{u.total}</span>
              <span data-label={t('admin.users.colStaff')} style={{ fontSize: 13 }}>{staffName(u.staff)}</span>
              <span data-label={t('admin.users.colPayment')} style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: pm?.c, background: pm?.b, padding: '4px 9px', borderRadius: 7 }}>{pm?.l}</span>
              <span style={{ color: 'var(--muted)', textAlign: 'right' }}><Icon name="chevronRight" size={16} /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── User detail ───────────────────────────────────────────────────────────────

export function AdminUserDetail({ userId, onBack, onGoAddJob, onToast }) {
  const { t } = useLang()
  const [u, setU] = useState(() => userId ? userById(userId) : null)
  const [userRows, setUserRows] = useState([])
  const [staffList, setStaffList] = useState(STAFF)

  useEffect(() => {
    if (!userId) return
    getClientById(userId).then(data => { if (data) setU(data) }).catch(() => {})
    getJobsByClient(userId).then(rows => setUserRows(rows.map(r => decRow(r)))).catch(() => {
      setUserRows(ROWS.filter(r => r.uid === userId).map(r => decRow(r)))
    })
    getAllStaff().then(setStaffList).catch(() => {})
  }, [userId])

  if (!u) return null
  const balPct = u.total > 0 ? `${Math.round((u.used / u.total) * 100)}%` : '0%'
  const selStaff = staffList.find(s => s.id === u.staff)

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 1180 }}>
      <button onClick={onBack} className="tap-target" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
        <Icon name="chevronLeft" size={15} />{t('admin.detail.allUsers')}
      </button>
      <div className="user-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 54, height: 54, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{initials(u.name)}</span>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, margin: 0 }}>{u.name}</h1>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{u.role} · {u.city}, {u.country}</div>
              </div>
            </div>
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[[t('admin.detail.emailLabel'), u.email], [t('admin.detail.phoneLabel'), u.phone], [t('admin.detail.joinedLabel'), fmtDate(u.created)]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, wordBreak: 'break-word' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h2 style={{ fontSize: 16, margin: '0 0 14px' }}>{t('admin.detail.appsAndJobs')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {userRows.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{t('admin.detail.noJobs')}</p>}
              {userRows.map(r => (
                <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 13, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 9, fontWeight: 700, fontSize: 13, background: r.fitB, color: r.fitC, flexShrink: 0 }}>{r.fit}%</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title} · {r.company}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.loc} · {t('cust.jobs.via')} {r.source}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '4px 9px', borderRadius: 7, flexShrink: 0 }}>{r.statusLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{t('admin.detail.packageBalance')}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{u.pkg}</div>
            <div style={{ height: 8, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: balPct, background: 'var(--primary)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{u.used} {t('admin.detail.usedRemaining', { r: u.remaining })}</div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>{t('admin.detail.assignedStaff')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials(selStaff?.name || '')}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{selStaff?.name || t('admin.detail.unassigned')}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t('admin.detail.reassignBelow')}</div>
              </div>
            </div>
            <label htmlFor="reassign-staff" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{t('admin.detail.reassignBelow')}</label>
            <select id="reassign-staff" style={{ width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', fontFamily: 'inherit' }}>
              {staffList.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{t('admin.detail.quickActions')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={onGoAddJob} className="tap-target" style={{ padding: 9, borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('admin.detail.addJobRec')}</button>
              <button onClick={() => onToast(t('toast.docUploaded'))} className="tap-target" style={{ padding: 9, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--on-surface)' }}>{t('admin.detail.uploadDoc')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Add job ───────────────────────────────────────────────────────────────────

export function AdminAddJob({ userId, onSave }) {
  const { t } = useLang()
  const [u, setU] = useState(() => userId ? userById(userId) : null)
  const [rubric, setRubric] = useState({ skills: 72, location: 60, experience: 66, relevance: 80 })
  const [saving, setSaving] = useState(false)
  const computed = Math.round(rubric.skills * 0.4 + rubric.location * 0.2 + rubric.experience * 0.2 + rubric.relevance * 0.2)
  const fm = fitMeta(computed)

  useEffect(() => {
    if (!userId) return
    getClientById(userId).then(data => { if (data) setU(data) }).catch(() => {})
  }, [userId])

  const fin = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
  const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  async function handleSave(e) {
    const form = e.currentTarget.closest('[data-form]') || e.currentTarget.parentElement
    setSaving(true)
    try {
      const inputs = form ? form.querySelectorAll('[name]') : []
      const vals = {}
      inputs.forEach(el => { vals[el.name] = el.value })
      await addJob({
        id: 'j' + Date.now(),
        client_id: userId,
        company: vals.company || '',
        title: vals.jobTitle || '',
        location: vals.location || '',
        source: vals.source || 'LinkedIn',
        fit_score: computed,
        fit_reason: vals.fitReason || '',
        deadline: vals.deadline || null,
        approval: 'pending',
        status: null,
      })
    } catch (_) { /* non-blocking */ }
    setSaving(false)
    onSave?.()
  }

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 980 }} data-form>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.addjob.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>For {u?.name || 'user'} · the fit score is computed from the rubric below, not typed by hand.</p>
      <div className="addjob-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label htmlFor="aj-company" style={flbl}>{t('admin.addjob.company')}</label><input id="aj-company" name="company" placeholder="e.g. MAS Holdings" style={fin} /></div>
            <div><label htmlFor="aj-title" style={flbl}>{t('admin.addjob.jobTitle')}</label><input id="aj-title" name="jobTitle" placeholder="e.g. Senior UX Designer" style={fin} /></div>
            <div><label htmlFor="aj-location" style={flbl}>{t('admin.addjob.location')}</label><input id="aj-location" name="location" placeholder="Colombo, LK" style={fin} /></div>
            <div>
              <label htmlFor="aj-source" style={flbl}>{t('admin.addjob.source')}</label>
              <select id="aj-source" name="source" style={fin}><option>LinkedIn</option><option>Indeed</option><option>Company site</option><option>Niche board</option><option>Referral</option><option>Other</option></select>
            </div>
            <div><label htmlFor="aj-url" style={flbl}>{t('admin.addjob.jobUrl')}</label><input id="aj-url" name="jobUrl" placeholder="https://…" style={fin} /></div>
            <div><label htmlFor="aj-deadline" style={flbl}>{t('admin.addjob.deadline')}</label><input id="aj-deadline" name="deadline" type="date" defaultValue="2026-07-10" style={fin} /></div>
          </div>
          <div><label htmlFor="aj-reason" style={flbl}>{t('admin.addjob.fitReason')}</label><textarea id="aj-reason" name="fitReason" rows={2} placeholder="Why this is a good match…" style={fin} /></div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
          <h2 style={{ fontSize: 15, margin: '0 0 4px' }}>{t('admin.addjob.fitRubric')}</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px' }}>{t('admin.addjob.weights')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['skills', t('admin.addjob.skillsMatch'), 0.4],
              ['location', t('admin.addjob.locationFit'), 0.2],
              ['experience', t('admin.addjob.expMatch'), 0.2],
              ['relevance', t('admin.addjob.roleRelevance'), 0.2],
            ].map(([key, label]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                  <label htmlFor={`rubric-${key}`}>{label}</label><span>{rubric[key]}%</span>
                </div>
                <input
                  id={`rubric-${key}`}
                  type="range" min="0" max="100" value={rubric[key]}
                  onChange={e => setRubric(r => ({ ...r, [key]: +e.target.value }))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, padding: 16, borderRadius: 11, background: fm.b, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: fm.c }}>{t('admin.addjob.computedScore')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 600, color: fm.c, lineHeight: 1.1 }}>{computed}%</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: fm.c }}>{fm.tier} fit</div>
          </div>
          <button onClick={handleSave} disabled={saving} className="tap-target" style={{ width: '100%', marginTop: 14, padding: 11, borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: saving ? .7 : 1 }}>{saving ? 'Saving…' : t('admin.addjob.recommend')}</button>
        </div>
      </div>
    </div>
  )
}

// ── All applications ──────────────────────────────────────────────────────────

export function AdminApplications() {
  const { t } = useLang()
  const [jobs, setJobs] = useState(ROWS)

  useEffect(() => {
    getAllJobs().then(setJobs).catch(() => {})
  }, [])

  const allRows = jobs.map(r => decRow(r))
  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 1280 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.apps.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 18px', fontSize: 14 }}>{t('admin.apps.subtitle')}</p>
      <div className="data-table" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div className="data-table-head" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1fr 1fr 1.2fr', gap: 12, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          <span>{t('admin.apps.colUser')}</span><span>{t('admin.apps.colRole')}</span><span>{t('admin.apps.colFit')}</span><span>{t('admin.apps.colStaff')}</span><span>{t('admin.apps.colStatus')}</span>
        </div>
        {allRows.map(r => (
          <div key={r.id} className="data-table-row" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1fr 1fr 1.2fr', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <span data-label={t('admin.apps.colUser')} style={{ fontWeight: 600, fontSize: 13 }}>{r.uname}</span>
            <div data-label={t('admin.apps.colRole')} style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.company}</div>
            </div>
            <span data-label={t('admin.apps.colFit')} style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.fitC, background: r.fitB, padding: '3px 8px', borderRadius: 6 }}>{r.fit}% {r.fitTier}</span>
            <span data-label={t('admin.apps.colStaff')} style={{ fontSize: 12, color: 'var(--muted)' }}>{r.staffN}</span>
            <span data-label={t('admin.apps.colStatus')} style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '4px 9px', borderRadius: 7 }}>{r.statusLabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── QC Queue ──────────────────────────────────────────────────────────────────

export function AdminQCQueue({ onToast }) {
  const { t } = useLang()
  const [signed, setSigned] = useState({})
  const [qcRows, setQcRows] = useState(
    ROWS.filter(r => r.status === 'qc' || r.status === 'drafting').map(r => decRow(r))
  )

  useEffect(() => {
    getQCJobs().then(rows => setQcRows(rows.map(r => decRow(r)))).catch(() => {})
  }, [])

  async function handleApprove(id) {
    setSigned(s => ({ ...s, [id]: 'applied' }))
    onToast(t('toast.appApprovedMarked'))
    try { await updateJob(id, { status: 'applied', applied_date: new Date().toISOString().slice(0, 10) }) } catch (_) {}
  }

  async function handleReturn(id) {
    setSigned(s => ({ ...s, [id]: 'returned' }))
    onToast(t('toast.returnedDrafting'))
    try { await updateJob(id, { status: 'drafting' }) } catch (_) {}
  }

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 980 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.qc.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('admin.qc.subtitle')}</p>
      {qcRows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', background: 'var(--surface)', border: '1px dashed var(--border-2)', borderRadius: 'var(--radius)' }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--on-surface)' }}>{t('admin.qc.empty')}</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>{t('admin.qc.emptyDesc')}</div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {qcRows.map(r => (
          <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', opacity: signed[r.id] ? .6 : 1, flexWrap: 'wrap' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: 10, fontWeight: 700, fontSize: 14, background: r.statusB, color: r.statusC, flexShrink: 0 }}>{r.fit}%</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{r.title} · {r.company}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '3px 8px', borderRadius: 6 }}>{r.statusLabel}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0' }}>{r.uname} · prepared by {r.staffN} · deadline {r.deadlineFmt}</div>
              {r.notesInt && (
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', marginTop: 6 }}>{r.notesInt}</div>
              )}
              <div style={{ display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
                {signed[r.id] === 'applied'
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1F7A4D', fontWeight: 600, fontSize: 13 }}><Icon name="check" size={15} />{t('admin.qc.approvedApplied')}</span>
                  : signed[r.id] === 'returned'
                  ? <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>{t('admin.qc.returnedDrafting')}</span>
                  : <>
                    <button onClick={() => handleApprove(r.id)} className="tap-target" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('admin.qc.approveApplied')}</button>
                    <button onClick={() => handleReturn(r.id)} className="tap-target" style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t('admin.qc.returnDrafting')}</button>
                  </>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Payments ──────────────────────────────────────────────────────────────────

export function AdminPayments({ onToast }) {
  const { t } = useLang()
  const [payments, setPayments] = useState(PAYMENTS)
  const [statuses, setStatuses] = useState({})

  useEffect(() => {
    getAllPayments().then(setPayments).catch(() => {})
  }, [])

  async function markStatus(p, newStatus, toastKey) {
    setStatuses(s => ({ ...s, [p.id]: newStatus }))
    onToast(t(toastKey))
    try {
      await updatePayment(p.id, { status: newStatus, paid_usd: newStatus === 'paid' ? p.amount : p.paid })
      await addPaymentTrail(p.id, 'Dilani Jayasuriya', `Marked ${newStatus}`)
    } catch (_) {}
  }

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 1180 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.pay.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('admin.pay.subtitle')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {payments.map(p => {
          const status = statuses[p.id] || p.status
          const pm = PAY_META[status]
          const uname = p.uname || (userById(p.uid)?.name || '')
          return (
            <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials(uname)}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{uname}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.pkg} · {p.method} · {fmtDate(p.date)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>${p.paid} <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>/ ${p.amount}</span></div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{p.ref}</div>
                  </div>
                  {pm && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: pm.c, background: pm.b, padding: '6px 11px', borderRadius: 8 }}>{pm.l}</span>}
                </div>
              </div>
              {p.trail && p.trail.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)', marginBottom: 9 }}>{t('admin.pay.auditTrail')}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {p.trail.map((tr, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, flexWrap: 'wrap' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 600 }}>{tr.a || tr.actor}</span>
                        <span style={{ color: 'var(--muted)' }}>{tr.act || tr.action}</span>
                        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{tr.t || tr.created_at?.slice(0, 16)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button onClick={() => markStatus(p, 'paid', 'toast.markedPaid')} className="tap-target" style={{ padding: '7px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>{t('admin.pay.markPaid')}</button>
                <button onClick={() => markStatus(p, 'partial', 'toast.markedPartial')} className="tap-target" style={{ padding: '7px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>{t('admin.pay.partial')}</button>
                <button onClick={() => markStatus(p, 'refunded', 'toast.markedRefunded')} className="tap-target" style={{ padding: '7px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--destructive)' }}>{t('admin.pay.refund')}</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Staff ─────────────────────────────────────────────────────────────────────

export function AdminStaff() {
  const { t } = useLang()
  const [staff, setStaff] = useState(STAFF)

  useEffect(() => {
    getAllStaff().then(setStaff).catch(() => {})
  }, [])

  const totalLoad = staff.reduce((s, st) => s + (st.load || 0), 0)
  const totalCap = staff.reduce((s, st) => s + (st.max || 0), 0)
  const openCap = totalCap - totalLoad

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.staff.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 18px', fontSize: 14 }}>{t('admin.staff.subtitle')}</p>
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          [t('admin.staff.headcount'), staff.length, ''],
          [t('admin.staff.activeLoad'), `${totalLoad} / ${totalCap}`, ''],
          [t('admin.staff.openCapacity'), `${openCap} ${t('admin.staff.usersUnit')}`, 'var(--primary)'],
        ].map(([label, value, c], i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, color: c || 'inherit' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {staff.map(s => {
          const utilPct = s.max > 0 ? Math.round((s.load / s.max) * 100) : 0
          const barColor = utilPct >= 90 ? '#B23A2E' : utilPct >= 75 ? '#A85A1E' : 'var(--primary)'
          const statusLabel = utilPct >= 90 ? t('admin.staff.atCapacity') : utilPct >= 75 ? t('admin.staff.highLoad') : t('admin.staff.available')
          return (
            <div key={s.id} className="staff-row" style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1.4fr 2fr 1fr', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials(s.name)}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.role}</div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'var(--muted)' }}>{t('admin.staff.ofUsers', { max: s.max })}</span>
                  <span style={{ fontWeight: 600 }}>{utilPct}%</span>
                </div>
                <div style={{ height: 9, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${utilPct}%`, background: barColor, borderRadius: 99 }} />
                </div>
              </div>
              <span className="staff-status" style={{ justifySelf: 'end', fontSize: 12, fontWeight: 700, color: barColor }}>{statusLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Email templates ───────────────────────────────────────────────────────────

export function AdminNotifications() {
  const { t } = useLang()
  const [templates, setTemplates] = useState(TEMPLATES)

  useEffect(() => {
    getEmailTemplates().then(data => { if (data.length > 0) setTemplates(data) }).catch(() => {})
  }, [])

  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 920 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.notif.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('admin.notif.subtitle')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {templates.map(tpl => (
          <div key={tpl.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{tpl.key}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', background: 'var(--surface-3)', padding: '4px 10px', borderRadius: 7 }}>{tpl.trigger}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Subject: <span style={{ fontWeight: 500, color: 'var(--muted)' }}>{tpl.subject}</span></div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 9, padding: '13px', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{tpl.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────

export function AdminExport({ onToast }) {
  const { t } = useLang()
  const [counts, setCounts] = useState({ clients: USERS.length, jobs: ROWS.length, payments: PAYMENTS.length, staff: STAFF.length })

  useEffect(() => {
    Promise.allSettled([getAllClients(), getAllJobs(), getAllPayments(), getAllStaff()])
      .then(([c, j, p, s]) => setCounts({
        clients: c.value?.length ?? USERS.length,
        jobs: j.value?.length ?? ROWS.length,
        payments: p.value?.length ?? PAYMENTS.length,
        staff: s.value?.length ?? STAFF.length,
      }))
  }, [])

  const exports = [
    { name: 'Users export', rows: counts.clients, cols: 'name, email, phone, country, city, package, balance, payment status, staff' },
    { name: 'Applications export', rows: counts.jobs, cols: 'user, company, title, location, fit score, status, applied date, proof type' },
    { name: 'Payments export', rows: counts.payments, cols: 'user, package, amount, paid, method, status, reference, date' },
    { name: 'Staff capacity export', rows: counts.staff, cols: 'name, role, email, max capacity, current load' },
  ]
  return (
    <div className="container" style={{ padding: '24px 28px', maxWidth: 780 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>{t('admin.export.title')}</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>{t('admin.export.subtitle')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {exports.map((e, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', alignItems: 'center', gap: 13, flexWrap: 'wrap' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--primary)', flexShrink: 0 }}>
              <Icon name="file" size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{e.rows} rows · {e.cols}</div>
            </div>
            <button onClick={() => onToast(t('toast.downloaded', { name: e.name }))} className="tap-target" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              <Icon name="download" size={15} />{t('admin.export.download')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
