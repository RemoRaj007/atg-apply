import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { ROWS, USERS, STAFF, PAYMENTS, TEMPLATES, ST, PAY_META, fitMeta, fmtDate, initials, staffName, userById } from '../data.js'

function decRow(r, approvals = {}) {
  const ap = approvals[r.id] || r.approval
  const sm = r.status ? ST[r.status] : null
  const fm = fitMeta(r.fit)
  const u = userById(r.uid)
  return {
    ...r, ap,
    statusLabel: sm ? sm.l : '—', statusC: sm ? sm.c : '#5F6B68', statusB: sm ? sm.b : '#ECEAE3',
    fitTier: fm.tier, fitC: fm.c, fitB: fm.b,
    deadlineFmt: fmtDate(r.deadline),
    uname: u ? u.name : '',
    staffN: staffName(r.staff),
  }
}

const PKG_BADGE = { Trial: '#ECEAE3', Starter: '#E4ECF7', Professional: '#E1EFE9', Premium: '#FBF0D9' }

export function AdminDashboard({ onGoQC, onGoPay }) {
  const allRows = ROWS.map(r => decRow(r))
  const qcRows = allRows.filter(r => r.status === 'qc')
  const payNeedsCount = PAYMENTS.filter(p => p.status === 'pending' || p.status === 'partial').length

  const statusCounts = {}
  allRows.forEach(r => { if (r.status) statusCounts[r.status] = (statusCounts[r.status] || 0) + 1 })
  const maxCount = Math.max(...Object.values(statusCounts), 1)
  const statusList = Object.entries(ST).map(([k, v]) => ({
    key: k, label: v.l, c: v.c, count: statusCounts[k] || 0, barW: `${Math.round(((statusCounts[k] || 0) / maxCount) * 100)}%`
  })).filter(s => s.count > 0)

  const adminStats = [
    { label: 'Active users', value: USERS.filter(u => u.state === 'active').length, sub: `${USERS.length} total`, icon: 'users' },
    { label: 'Applications', value: ROWS.length, sub: `${ROWS.filter(r => r.status === 'applied').length} applied`, icon: 'list' },
    { label: 'In QC', value: qcRows.length, sub: 'Need sign-off', icon: 'shield' },
    { label: 'Revenue', value: `$${PAYMENTS.reduce((s, p) => s + p.paid, 0)}`, sub: 'USD · all time', icon: 'card' },
  ]

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: 0 }}>Operator console</h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>Thursday, 26 June 2026 · ATG Concordia operations</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h2 style={{ fontSize: 16, margin: '0 0 14px' }}>Applications by status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {statusList.map(s => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 120, fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                <div style={{ flex: 1, height: 10, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: s.barW, background: s.c, borderRadius: 99 }} />
                </div>
                <span style={{ width: 24, textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <h2 style={{ fontSize: 16, margin: '0 0 14px' }}>Needs attention</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={onGoQC} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 13, cursor: 'pointer' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: '#FBF0D9', color: '#8A6100' }}>
                <Icon name="shield" size={18} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>QC queue</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Applications awaiting sign-off</div>
              </div>
              <span style={{ fontWeight: 700, color: '#8A6100' }}>{qcRows.length}</span>
            </button>
            <button onClick={onGoPay} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 13, cursor: 'pointer' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 9, background: '#E4ECF7', color: '#1E4E8C' }}>
                <Icon name="card" size={18} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Payments to reconcile</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Pending or partial</div>
              </div>
              <span style={{ fontWeight: 700, color: '#1E4E8C' }}>{payNeedsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminUsers({ onOpenUser, onGoExport }) {
  return (
    <div style={{ padding: '24px 28px', maxWidth: 1280 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: 0 }}>Users</h1>
          <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: 14 }}>{USERS.length} users · filter by package or payment status</p>
        </div>
        <button onClick={onGoExport} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--on-surface)' }}>
          <Icon name="download" size={15} />Export CSV
        </button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.4fr 1fr 0.6fr', gap: 12, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          <span>User</span><span>Package</span><span>Balance</span><span>Staff</span><span>Payment</span><span />
        </div>
        {USERS.map(u => {
          const pm = PAY_META[u.pay]
          return (
            <button key={u.id} onClick={() => onOpenUser(u.id)} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1.4fr 1fr 0.6fr', gap: 12, padding: '13px 18px', border: 'none', borderBottom: '1px solid var(--border)', background: 'none', cursor: 'pointer', textAlign: 'left', alignItems: 'center', width: '100%', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials(u.name)}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{u.city}, {u.country}</div>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, width: 'fit-content', background: PKG_BADGE[u.pkg] || 'var(--surface-3)', padding: '4px 10px', borderRadius: 7 }}>{u.pkg}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{u.remaining}/{u.total}</span>
              <span style={{ fontSize: 13 }}>{staffName(u.staff)}</span>
              <span style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: pm?.c, background: pm?.b, padding: '4px 9px', borderRadius: 7 }}>{pm?.l}</span>
              <span style={{ color: 'var(--muted)', textAlign: 'right' }}><Icon name="chevronRight" size={16} /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function AdminUserDetail({ userId, onBack, onGoAddJob, onToast }) {
  const u = userById(userId)
  if (!u) return null
  const userRows = ROWS.filter(r => r.uid === userId).map(r => decRow(r))
  const selStaff = STAFF.find(s => s.id === u.staff)
  const balPct = `${Math.round((u.used / u.total) * 100)}%`

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1180 }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
        <Icon name="chevronLeft" size={15} />All users
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 54, height: 54, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 18 }}>{initials(u.name)}</span>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, margin: 0 }}>{u.name}</h1>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{u.role} · {u.city}, {u.country}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[['Email', u.email], ['Phone', u.phone], ['Joined', fmtDate(u.created)]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h2 style={{ fontSize: 16, margin: '0 0 14px' }}>Applications &amp; jobs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {userRows.length === 0 && <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>No jobs added yet.</p>}
              {userRows.map(r => (
                <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 13, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 9, fontWeight: 700, fontSize: 13, background: r.fitB, color: r.fitC, flexShrink: 0 }}>{r.fit}%</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title} · {r.company}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.loc} · via {r.source}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '4px 9px', borderRadius: 7 }}>{r.statusLabel}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icon name="shield" size={16} />
              <h2 style={{ fontSize: 15, margin: 0 }}>Internal notes</h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--destructive)', background: '#F7E5E2', padding: '3px 8px', borderRadius: 6 }}>Staff only · never shown to user</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 9, padding: 13 }}>
              {userId === 'u6'
                ? 'First 3 applications require founder QC sign-off. User responsive on WhatsApp. Strong CAD portfolio — lead with John Keells and Hayleys roles.'
                : 'No internal notes yet.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Package &amp; balance</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{u.pkg}</div>
            <div style={{ height: 8, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: balPct, background: 'var(--primary)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{u.used} used · {u.remaining} remaining</div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Assigned staff</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>{initials(selStaff?.name || '')}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{selStaff?.name || 'Unassigned'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Reassign below</div>
              </div>
            </div>
            <select style={{ width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', fontFamily: 'inherit' }}>
              {STAFF.map(s => <option key={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Quick actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={onGoAddJob} style={{ padding: 9, borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Add a job recommendation</button>
              <button onClick={() => onToast('Document uploaded')} style={{ padding: 9, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--on-surface)' }}>Upload document</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminAddJob({ userId, onSave }) {
  const u = userById(userId)
  const [rubric, setRubric] = useState({ skills: 72, location: 60, experience: 66, relevance: 80 })
  const computed = Math.round(rubric.skills * 0.4 + rubric.location * 0.2 + rubric.experience * 0.2 + rubric.relevance * 0.2)
  const fm = fitMeta(computed)

  const fin = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
  const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 980 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Add job recommendation</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>For {u?.name || 'user'} · the fit score is computed from the rubric below, not typed by hand.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={flbl}>Company</label><input placeholder="e.g. MAS Holdings" style={fin} /></div>
            <div><label style={flbl}>Job title</label><input placeholder="e.g. Senior UX Designer" style={fin} /></div>
            <div><label style={flbl}>Location</label><input placeholder="Colombo, LK" style={fin} /></div>
            <div>
              <label style={flbl}>Source</label>
              <select style={fin}><option>LinkedIn</option><option>Indeed</option><option>Company site</option><option>Niche board</option><option>Referral</option><option>Other</option></select>
            </div>
            <div><label style={flbl}>Job URL</label><input placeholder="https://…" style={fin} /></div>
            <div><label style={flbl}>Deadline</label><input type="date" defaultValue="2026-07-10" style={fin} /></div>
          </div>
          <div><label style={flbl}>Fit reason (shown to user)</label><textarea rows={2} placeholder="Why this is a good match…" style={fin} /></div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
          <h2 style={{ fontSize: 15, margin: '0 0 4px' }}>Fit rubric</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 16px' }}>Weights: skills 40% · location/visa 20% · experience 20% · relevance 20%.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['skills', 'Skills match', 0.4],
              ['location', 'Location / visa fit', 0.2],
              ['experience', 'Experience match', 0.2],
              ['relevance', 'Role relevance', 0.2],
            ].map(([key, label]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 5 }}>
                  <span>{label}</span><span>{rubric[key]}%</span>
                </div>
                <input
                  type="range" min="0" max="100" value={rubric[key]}
                  onChange={e => setRubric(r => ({ ...r, [key]: +e.target.value }))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, padding: 16, borderRadius: 11, background: fm.b, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: fm.c }}>Computed fit score</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 600, color: fm.c, lineHeight: 1.1 }}>{computed}%</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: fm.c }}>{fm.tier} fit</div>
          </div>
          <button onClick={onSave} style={{ width: '100%', marginTop: 14, padding: 11, borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Recommend to user</button>
        </div>
      </div>
    </div>
  )
}

export function AdminApplications() {
  const allRows = ROWS.map(r => decRow(r))
  return (
    <div style={{ padding: '24px 28px', maxWidth: 1280 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Applications</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 18px', fontSize: 14 }}>All applications across users · the full operations workflow.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1fr 1fr 1.2fr', gap: 12, padding: '11px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          <span>User</span><span>Role</span><span>Fit</span><span>Staff</span><span>Status</span>
        </div>
        {allRows.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr 1fr 1fr 1.2fr', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{r.uname}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.company}</div>
            </div>
            <span style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.fitC, background: r.fitB, padding: '3px 8px', borderRadius: 6 }}>{r.fit}% {r.fitTier}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{r.staffN}</span>
            <span style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '4px 9px', borderRadius: 7 }}>{r.statusLabel}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminQCQueue({ onToast }) {
  const [signed, setSigned] = useState({})
  const qcRows = ROWS.filter(r => r.status === 'qc' || r.status === 'drafting').map(r => decRow(r))
  return (
    <div style={{ padding: '24px 28px', maxWidth: 980 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>QC queue</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Applications in drafting or QC. Nothing moves to Applied without a QC Lead's sign-off.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {qcRows.map(r => (
          <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', opacity: signed[r.id] ? .6 : 1 }}>
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
              <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
                {signed[r.id] === 'applied'
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1F7A4D', fontWeight: 600, fontSize: 13 }}><Icon name="check" size={15} />Approved &amp; marked applied</span>
                  : signed[r.id] === 'returned'
                  ? <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>Returned to drafting</span>
                  : <>
                    <button onClick={() => { setSigned(s => ({ ...s, [r.id]: 'applied' })); onToast('Application approved — marked as Applied') }} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Approve &amp; mark applied</button>
                    <button onClick={() => { setSigned(s => ({ ...s, [r.id]: 'returned' })); onToast('Returned to drafting') }} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Return to drafting</button>
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

export function AdminPayments({ onToast }) {
  const [statuses, setStatuses] = useState({})
  return (
    <div style={{ padding: '24px 28px', maxWidth: 1180 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Payments</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Manual reconciliation · each status change is logged with who and when.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PAYMENTS.map(p => {
          const u = userById(p.uid)
          const status = statuses[p.id] || p.status
          const pm = PAY_META[status]
          return (
            <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>{initials(u?.name || '')}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{u?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.pkg} · {p.method} · {fmtDate(p.date)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>${p.paid} <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>/ ${p.amount}</span></div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{p.ref}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: pm?.c, background: pm?.b, padding: '6px 11px', borderRadius: 8 }}>{pm?.l}</span>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)', marginBottom: 9 }}>Audit trail</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {p.trail.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{t.a}</span>
                      <span style={{ color: 'var(--muted)' }}>{t.act}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{t.t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => { setStatuses(s => ({ ...s, [p.id]: 'paid' })); onToast('Marked as Paid') }} style={{ padding: '7px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>Mark Paid</button>
                  <button onClick={() => { setStatuses(s => ({ ...s, [p.id]: 'partial' })); onToast('Marked as Partial') }} style={{ padding: '7px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--on-surface)' }}>Partial</button>
                  <button onClick={() => { setStatuses(s => ({ ...s, [p.id]: 'refunded' })); onToast('Marked as Refunded') }} style={{ padding: '7px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: 'var(--destructive)' }}>Refund</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AdminStaff() {
  const totalLoad = STAFF.reduce((s, st) => s + st.load, 0)
  const totalCap = STAFF.reduce((s, st) => s + st.max, 0)
  const openCap = totalCap - totalLoad
  return (
    <div style={{ padding: '24px 28px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Team capacity</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 18px', fontSize: 14 }}>Capacity model: ~12 active users per specialist at ~35 min/user/week. Reassign before anyone hits capacity.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          ['Team headcount', STAFF.length, ''],
          ['Active load', `${totalLoad} / ${totalCap}`, ''],
          ['Open capacity', `${openCap} users`, 'var(--primary)'],
        ].map(([label, value, c], i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, color: c || 'inherit' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {STAFF.map(s => {
          const utilPct = Math.round((s.load / s.max) * 100)
          const barColor = utilPct >= 90 ? '#B23A2E' : utilPct >= 75 ? '#A85A1E' : 'var(--primary)'
          const statusLabel = utilPct >= 90 ? 'At capacity' : utilPct >= 75 ? 'High load' : 'Available'
          return (
            <div key={s.id} style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1.4fr 2fr 1fr', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13 }}>{initials(s.name)}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.role}</div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'var(--muted)' }}>{s.load} of {s.max} users</span>
                  <span style={{ fontWeight: 600 }}>{utilPct}%</span>
                </div>
                <div style={{ height: 9, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${utilPct}%`, background: barColor, borderRadius: 99 }} />
                </div>
              </div>
              <span style={{ justifySelf: 'end', fontSize: 12, fontWeight: 700, color: barColor }}>{statusLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AdminNotifications() {
  return (
    <div style={{ padding: '24px 28px', maxWidth: 920 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Notification templates</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>The exact copy sent to users on each event. Variables in {'{curly braces}'} are filled at send time.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TEMPLATES.map(t => (
          <div key={t.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{t.key}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', background: 'var(--surface-3)', padding: '4px 10px', borderRadius: 7 }}>{t.trigger}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Subject: <span style={{ fontWeight: 500, color: 'var(--muted)' }}>{t.subject}</span></div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 9, padding: '13px', marginTop: 8, fontFamily: 'var(--font-mono)' }}>{t.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminExport({ onToast }) {
  const exports = [
    { name: 'Users export', rows: USERS.length, cols: 'name, email, phone, country, city, package, balance, payment status, staff' },
    { name: 'Applications export', rows: ROWS.length, cols: 'user, company, title, location, fit score, status, applied date, proof type' },
    { name: 'Payments export', rows: PAYMENTS.length, cols: 'user, package, amount, paid, method, status, reference, date' },
    { name: 'Staff capacity export', rows: STAFF.length, cols: 'name, role, email, max capacity, current load' },
  ]
  return (
    <div style={{ padding: '24px 28px', maxWidth: 780 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Export data</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Download operational data as CSV for reporting and reconciliation.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {exports.map((e, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--primary)' }}>
              <Icon name="file" size={20} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{e.rows} rows · {e.cols}</div>
            </div>
            <button onClick={() => onToast(`${e.name} downloaded`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              <Icon name="download" size={15} />Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
