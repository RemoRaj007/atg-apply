import Icon from '../components/Icon.jsx'
import { ROWS, NOTIF, PAYMENTS, PRICING, ST, PAY_META, PROOF_LABELS, fitMeta, fmtDate, initials } from '../data.js'

const MY_UID = 'u4'
const fin = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }

function decRow(r, approvals) {
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

const NOTIF_ICON = { interview: 'star', applied: 'send', job: 'briefcase', drafting: 'file', reply: 'chat', paid: 'card' }
const NOTIF_ACCENT = { interview: '#6B3FA0', applied: '#1F7A4D', job: 'var(--accent)', drafting: '#1E4E8C', reply: 'var(--muted)', paid: '#1F7A4D' }

export function CustomerDashboard({ approvals, onApprove, onDecline, onGoJobs, onGoApps, onGoUpgrade, onGoProfile, onGoNotify }) {
  const myRows = ROWS.filter(r => r.uid === MY_UID).map(r => decRow(r, approvals))
  const myPending = myRows.filter(r => r.apPending)
  const myApplied = myRows.filter(r => r.ap === 'approved' && r.status)

  const tracker = [
    { label: 'Applied', count: myApplied.filter(r => ['applied', 'interview', 'rejected', 'follow_up_needed'].includes(r.status)).length, icon: 'send', c: '#1F7A4D' },
    { label: 'Interview', count: myApplied.filter(r => r.status === 'interview').length, icon: 'star', c: '#6B3FA0' },
    { label: 'In progress', count: myApplied.filter(r => ['drafting', 'qc', 'approved'].includes(r.status)).length, icon: 'clock', c: '#8A6100' },
    { label: 'Pending your review', count: myPending.length, icon: 'briefcase', c: 'var(--accent)' },
  ]

  const showPending = myPending.slice(0, 3)
  const notifTop = NOTIF.slice(0, 3)

  return (
    <div style={{ padding: '26px 30px', maxWidth: 1180 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 30, margin: 0 }}>Welcome back, Nandini</h1>
          <p style={{ color: 'var(--muted)', margin: '5px 0 0', fontSize: 14 }}>Here's where your applications stand this week.</p>
        </div>
        <button onClick={onGoJobs} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 17px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Review {myPending.length} new jobs
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>Application tracker</h2>
              <button onClick={onGoApps} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>View all</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {tracker.map((t, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: t.c }}>
                    <Icon name={t.icon} size={16} />
                    <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--on-surface)' }}>{t.count}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 16, margin: 0 }}>Jobs awaiting your approval</h2>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '3px 9px', borderRadius: 7 }}>{myPending.length} pending</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 14px' }}>Nothing is submitted until you approve it.</p>
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
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>Deadline {r.deadlineFmt}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: '6px 0 0' }}>{r.reason}</p>
                    <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
                      {r.apPending && <>
                        <button onClick={() => onApprove(r.id)} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Approve</button>
                        <button onClick={() => onDecline(r.id)} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Skip</button>
                      </>}
                      {r.apApproved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1F7A4D', fontWeight: 600, fontSize: 13 }}><Icon name="check" size={15} />Approved — sent to your team</span>}
                      {r.apDeclined && <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>Skipped</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 13, opacity: .8 }}>Professional package</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '4px 0 12px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 600 }}>77</span>
              <span style={{ opacity: .8, fontSize: 14 }}>of 100 left</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,.18)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '23%', background: 'var(--accent)', borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 12, opacity: .75, marginTop: 8 }}>23 applications used</div>
            <button onClick={onGoUpgrade} style={{ width: '100%', marginTop: 14, padding: 10, borderRadius: 9, background: 'rgba(255,255,255,.14)', color: '#fff', border: '1px solid rgba(255,255,255,.2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Top up or upgrade</button>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <h2 style={{ fontSize: 15, margin: '0 0 12px' }}>Your profile</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700 }}>ND</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Nandini</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Senior UX Designer · Colombo</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Target roles</span><span style={{ fontWeight: 500 }}>UX / Product Design</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Locations</span><span style={{ fontWeight: 500 }}>Colombo · Remote</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Your team</span><span style={{ fontWeight: 500 }}>ATG specialist</span></div>
            </div>
            <button onClick={onGoProfile} style={{ width: '100%', marginTop: 14, padding: 9, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--on-surface)' }}>Edit profile</button>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: 15, margin: 0 }}>Recent updates</h2>
              <button onClick={onGoNotify} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>All</button>
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

export function CustomerJobs({ approvals, onApprove, onDecline }) {
  const myRows = ROWS.filter(r => r.uid === MY_UID).map(r => decRow(r, approvals))
  return (
    <div style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Recommended jobs</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Roles your ATG team researched for you. Approve the ones you want — skip the rest.</p>
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
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>Deadline {r.deadlineFmt} · via {r.source}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: '4px 0 0' }}>{r.reason}</p>
              <div style={{ display: 'flex', gap: 9, marginTop: 12, alignItems: 'center' }}>
                {r.apPending && <>
                  <button onClick={() => onApprove(r.id)} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Approve</button>
                  <button onClick={() => onDecline(r.id)} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Skip</button>
                </>}
                {r.apApproved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1F7A4D', fontWeight: 600, fontSize: 13 }}><Icon name="check" size={15} />Approved</span>}
                {r.apDeclined && <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13 }}>Skipped</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CustomerApplications({ approvals }) {
  const myRows = ROWS.filter(r => r.uid === MY_UID && r.status).map(r => decRow(r, approvals))
  return (
    <div style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Application tracker</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Every application we've submitted or are preparing, with proof of submission.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.2fr', gap: 12, padding: '12px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <span>Role</span><span>Status</span><span>Applied</span><span>Proof</span>
        </div>
        {myRows.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.2fr', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.company} · {r.loc}</div>
            </div>
            <span style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: r.statusC, background: r.statusB, padding: '4px 9px', borderRadius: 7 }}>{r.statusLabel}</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{r.appliedFmt}</span>
            {r.proofType && (
              <span style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                <Icon name="shield" size={14} />{r.proofType}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CustomerDocuments() {
  const docs = [
    { name: 'CV — MAS Holdings', meta: 'Tailored CV v3 · Jun 18 · PDF' },
    { name: 'Cover letter — MAS Holdings', meta: 'Sustainability-focused · Jun 18 · PDF' },
    { name: 'CV — WSO2', meta: 'Tailored CV v2 · Jun 15 · PDF' },
    { name: 'Cover letter — 99x Design Lead', meta: 'Leadership framing · Jun 14 · PDF' },
  ]
  return (
    <div style={{ padding: '26px 30px', maxWidth: 920 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Your documents</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Tailored CVs and motivation letters your team prepared for each role.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {docs.map((d, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: 16, display: 'flex', gap: 13, alignItems: 'center' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-2)', color: 'var(--primary)' }}>
              <Icon name="file" size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{d.meta}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>Download</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CustomerPayments() {
  const p = PAYMENTS.find(p => p.uid === MY_UID)
  return (
    <div style={{ padding: '26px 30px', maxWidth: 880 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 18px' }}>Payments</h1>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Professional package</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600 }}>USD 100.00</div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#1F7A4D', background: '#E3F3E8', padding: '5px 11px', borderRadius: 8 }}>Paid</span>
        </div>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, padding: '12px 18px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)' }}>
          <span>Invoice</span><span>Method</span><span>Date</span><span style={{ textAlign: 'right' }}>Status</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, padding: '14px 18px', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{p?.ref}</span>
          <span style={{ fontSize: 13 }}>{p?.method}</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{fmtDate(p?.date)}</span>
          <span style={{ textAlign: 'right' }}><span style={{ fontSize: 11, fontWeight: 700, color: '#1F7A4D', background: '#E3F3E8', padding: '4px 9px', borderRadius: 7 }}>Paid · ${p?.paid}</span></span>
        </div>
      </div>
    </div>
  )
}

export function CustomerUpgrade({ onUpgrade }) {
  const paid = PRICING.filter(p => p.price > 0)
  return (
    <div style={{ padding: '26px 30px', maxWidth: 1080 }}>
      <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', padding: '20px 22px', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 11, background: 'var(--accent)', color: '#fff', flexShrink: 0 }}>
          <Icon name="spark" size={22} />
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent-2)' }}>Keep the momentum going</div>
          <div style={{ fontSize: 14, color: 'var(--accent-2)', opacity: .9 }}>You've used 23 of 100 applications. Top up or move to a bigger package any time — your profile and history stay exactly as they are.</div>
        </div>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 18px' }}>Choose a package</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
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
              {hi && <span style={{ position: 'absolute', top: -11, left: 22, padding: '4px 11px', borderRadius: 7, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700 }}>Most popular</span>}
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 13, opacity: hi ? .8 : 1, color: hi ? 'inherit' : 'var(--muted)', marginTop: 4 }}>{p.blurb}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600 }}>${p.price}</span>
                <span style={{ opacity: hi ? .8 : 1, color: hi ? 'inherit' : 'var(--muted)', fontSize: 14 }}>· {p.apps} apps</span>
              </div>
              <button onClick={onUpgrade} style={{ width: '100%', padding: '11px', borderRadius: 9, background: hi ? 'var(--accent)' : 'var(--surface-2)', color: hi ? '#fff' : 'var(--on-surface)', border: hi ? 'none' : '1px solid var(--border)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                {p.cta}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CustomerNotifications() {
  return (
    <div style={{ padding: '26px 30px', maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Notifications</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Updates from your ATG team, newest first.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {NOTIF.map(n => {
          const accent = NOTIF_ACCENT[n.type] || 'var(--muted)'
          return (
            <div key={n.id} style={{
              background: n.unread ? 'var(--surface)' : 'var(--surface)',
              border: '1px solid var(--border)',
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

export function CustomerSupport({ onSend }) {
  return (
    <div style={{ padding: '26px 30px', maxWidth: 720 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 4px' }}>Support</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 20px', fontSize: 14 }}>Message your team. A real person replies within one working day.</p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 11 }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--surface-3)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>RP</span>
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 11, borderTopLeftRadius: 3, padding: '12px 14px' }}>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>Hi Nandini — your IFS application is queued and will be prepared this week. Anything else you'd like us to prioritise?</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>Roshan · ATG team · 4 days ago</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input placeholder="Type a message…" style={{ flex: 1, padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface)', fontSize: 14, color: 'inherit', fontFamily: 'inherit' }} />
        <button onClick={onSend} style={{ padding: '12px 20px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  )
}

export function CustomerProfile({ onSave }) {
  return (
    <div style={{ padding: '26px 30px', maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 28, margin: '0 0 18px' }}>Your profile</h1>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={flbl}>Full name</label><input defaultValue="Nandini" style={fin} /></div>
          <div><label style={flbl}>Email</label><input defaultValue="nandini@gmail.com" style={fin} /></div>
          <div><label style={flbl}>Target roles</label><input defaultValue="Senior UX Designer, Product Designer" style={fin} /></div>
          <div><label style={flbl}>Locations</label><input defaultValue="Colombo, Remote" style={fin} /></div>
        </div>
        <button onClick={onSave} style={{ alignSelf: 'flex-start', padding: '11px 20px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save changes</button>
      </div>
    </div>
  )
}
