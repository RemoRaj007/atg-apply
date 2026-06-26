import Icon from '../components/Icon.jsx'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, margin: '0 0 16px', letterSpacing: '-.01em' }}>{title}</h2>
    {children}
  </div>
)

const Card = ({ children, style = {} }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, ...style }}>
    {children}
  </div>
)

const Tag = ({ children, color = 'var(--primary)', bg = 'var(--surface-3)' }) => (
  <span style={{ display: 'inline-flex', fontSize: 11, fontWeight: 700, color, background: bg, padding: '3px 9px', borderRadius: 6, letterSpacing: '.02em' }}>{children}</span>
)

function SitemapNode({ label, children, accent }) {
  return (
    <div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: accent || 'var(--surface-3)', fontWeight: 600, fontSize: 13, border: '1px solid var(--border)' }}>{label}</div>
      {children && (
        <div style={{ marginLeft: 24, marginTop: 6, paddingLeft: 16, borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function RouteItem({ label, view }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--border-2)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      {view && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{view}</span>}
    </div>
  )
}

const ROLES = [
  { role: 'Visitor (Public)', color: '#1E4E8C', bg: '#E4ECF7' },
  { role: 'Customer (User)', color: '#1F7A4D', bg: '#E3F3E8' },
  { role: 'Operator (Admin)', color: '#8A6100', bg: '#FBF0D9' },
]

const PERMS = [
  { action: 'Browse public pages', visitor: true, customer: true, operator: true },
  { action: 'Complete signup wizard', visitor: true, customer: false, operator: false },
  { action: 'View own dashboard', visitor: false, customer: true, operator: false },
  { action: 'Approve / skip jobs', visitor: false, customer: true, operator: false },
  { action: 'View application tracker', visitor: false, customer: true, operator: false },
  { action: 'Download documents', visitor: false, customer: true, operator: false },
  { action: 'View own payments', visitor: false, customer: true, operator: false },
  { action: 'Send support messages', visitor: false, customer: true, operator: false },
  { action: 'View all users', visitor: false, customer: false, operator: true },
  { action: 'Add job recommendations', visitor: false, customer: false, operator: true },
  { action: 'QC sign-off', visitor: false, customer: false, operator: true },
  { action: 'Manage payments', visitor: false, customer: false, operator: true },
  { action: 'Export data (CSV)', visitor: false, customer: false, operator: true },
  { action: 'View notification templates', visitor: false, customer: false, operator: true },
]

const STATUS_FLOW = [
  { from: null, to: 'approved', label: 'User approves job' },
  { from: 'approved', to: 'drafting', label: 'Staff begins tailoring' },
  { from: 'drafting', to: 'qc', label: 'Ready for QC review' },
  { from: 'qc', to: 'applied', label: 'QC Lead signs off' },
  { from: 'qc', to: 'drafting', label: 'Returned for revision' },
  { from: 'applied', to: 'interview', label: 'Employer invites to interview' },
  { from: 'applied', to: 'rejected', label: 'Employer declines' },
  { from: 'applied', to: 'follow_up_needed', label: '14 days no response' },
]

const ENTITIES = [
  { name: 'User', fields: ['id', 'name', 'email', 'phone', 'country', 'city', 'pkg', 'total', 'used', 'remaining', 'pay', 'staff (→ Staff)', 'state', 'created', 'role'] },
  { name: 'Job / Application', fields: ['id', 'uid (→ User)', 'company', 'title', 'loc', 'source', 'fit (0–100)', 'reason', 'deadline', 'approval', 'status', 'staff (→ Staff)', 'proof', 'proofRef', 'applied', 'notesInt'] },
  { name: 'Payment', fields: ['id', 'uid (→ User)', 'pkg', 'amount', 'paid', 'cur', 'method', 'status', 'ref', 'date', 'trail (audit)'] },
  { name: 'Staff', fields: ['id', 'name', 'role', 'email', 'max (capacity)', 'load (current)'] },
  { name: 'Notification', fields: ['id', 'type', 'title', 'body', 't (timestamp)', 'unread'] },
  { name: 'Template', fields: ['id', 'key', 'trigger', 'subject', 'body'] },
]

export default function ArchitecturePage() {
  return (
    <div style={{ maxWidth: 1020, margin: '0 auto', padding: '52px 24px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <Tag color="var(--primary)" bg="var(--surface-3)">System architecture</Tag>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, letterSpacing: '-.02em', margin: '14px 0 10px' }}>ATG Apply — design blueprint</h1>
        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.65, margin: 0 }}>A human-managed job application service with three distinct roles: Visitor, Customer, and Operator. This page documents the full sitemap, data model, application lifecycle, and role-permission matrix.</p>
      </div>

      <Section title="Sitemap &amp; route inventory">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#1E4E8C', marginBottom: 12 }}>Visitor (Public)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[['Home', 'home'], ['How it works', 'how'], ['Pricing', 'pricing'], ['Contact', 'contact'], ['Privacy policy', 'privacy'], ['Terms of service', 'terms'], ['Signup wizard (8 steps)', 'signup'], ['System architecture', 'arch']].map(([l, v]) => (
                <RouteItem key={v} label={l} view={v} />
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#1F7A4D', marginBottom: 12 }}>Customer (User)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[['Dashboard', 'u-dash'], ['Recommended jobs', 'u-jobs'], ['Application tracker', 'u-apps'], ['Documents', 'u-docs'], ['Payments', 'u-pay'], ['Upgrade / top up', 'u-upgrade'], ['Notifications', 'u-notify'], ['Support', 'u-support'], ['Profile', 'u-profile']].map(([l, v]) => (
                <RouteItem key={v} label={l} view={v} />
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#8A6100', marginBottom: 12 }}>Operator (Admin)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[['Overview dashboard', 'a-dash'], ['Users list', 'a-users'], ['User detail', 'a-user'], ['Add job recommendation', 'a-jobnew'], ['All applications', 'a-apps'], ['QC queue', 'a-qc'], ['Payments', 'a-pay'], ['Team capacity', 'a-staff'], ['Notification templates', 'a-notify'], ['Export CSV', 'a-export']].map(([l, v]) => (
                <RouteItem key={v} label={l} view={v} />
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section title="Application status lifecycle">
        <Card>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.6 }}>Every job goes through a linear pipeline. The customer controls entry (approve/skip). Staff control progress through drafting and QC. No application is submitted without both customer approval and QC Lead sign-off.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { status: 'pending', label: 'Pending approval', desc: 'Job added by staff, awaiting customer approve/skip', c: '#5F6B68', b: '#ECEAE3' },
              { status: 'approved', label: 'Approved', desc: 'Customer approved — staff can begin work', c: '#0F5C4E', b: '#E1EFE9' },
              { status: 'drafting', label: 'Drafting', desc: 'Staff tailoring CV and motivation letter', c: '#1E4E8C', b: '#E4ECF7' },
              { status: 'qc', label: 'In QC', desc: 'Ready — awaiting QC Lead sign-off before submission', c: '#8A6100', b: '#FBF0D9' },
              { status: 'applied', label: 'Applied', desc: 'Submitted by staff with proof logged', c: '#1F7A4D', b: '#E3F3E8' },
              { status: 'interview', label: 'Interview', desc: 'Employer invited candidate to interview', c: '#6B3FA0', b: '#EFE8F8' },
              { status: 'rejected', label: 'Rejected', desc: 'Employer declined after review', c: '#B23A2E', b: '#F7E5E2' },
              { status: 'follow_up_needed', label: 'Follow-up needed', desc: 'No response in 14 days — staff to follow up', c: '#A85A1E', b: '#FAEBDD' },
            ].map(s => (
              <div key={s.status} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ display: 'inline-flex', minWidth: 140, fontSize: 11, fontWeight: 700, color: s.c, background: s.b, padding: '4px 10px', borderRadius: 7, flexShrink: 0 }}>{s.label}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, paddingTop: 2 }}>{s.desc}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--on-surface)' }}>QC gate:</strong> The first few applications for each new user require QC Lead (Founder) sign-off before submission. After the initial batch, the standard workflow applies.
          </div>
        </Card>
      </Section>

      <Section title="Data model (entity relationship overview)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {ENTITIES.map(e => (
            <Card key={e.name}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--primary)' }}>{e.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {e.fields.map(f => (
                  <div key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--border-2)' }}>·</span>
                    <span style={{ color: f.includes('→') ? 'var(--primary)' : 'inherit' }}>{f}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Role permission matrix">
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>Action</th>
                  {ROLES.map(r => (
                    <th key={r.role} style={{ padding: '10px 14px', fontWeight: 700 }}>
                      <span style={{ display: 'inline-flex', fontSize: 11, fontWeight: 700, color: r.color, background: r.bg, padding: '3px 9px', borderRadius: 6 }}>{r.role}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMS.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--surface-2)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 500 }}>{p.action}</td>
                    {[p.visitor, p.customer, p.operator].map((allowed, j) => (
                      <td key={j} style={{ padding: '10px 14px', textAlign: 'center' }}>
                        {allowed
                          ? <span style={{ color: '#1F7A4D', fontWeight: 700 }}>✓</span>
                          : <span style={{ color: 'var(--border-2)' }}>—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Section title="Demo data plan">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Logged-in customer', desc: 'Nandini (u4) · Professional package · 100 apps · 23 used · Colombo, Sri Lanka' },
            { label: 'Total users', desc: '10 users across Sri Lanka, Bangladesh, Maldives · Trial through Premium packages' },
            { label: 'Job rows', desc: '20 applications across 10 users · statuses: pending, drafting, qc, applied, interview, rejected, follow_up_needed' },
            { label: 'Payments', desc: '8 payment records · paid, partial, refunded, pending · full audit trail per record' },
            { label: 'Staff', desc: '4 team members · Nadia, Roshan, Imran, Dilani (QC Lead/Founder) · varying load/capacity' },
            { label: 'Notifications', desc: '6 notifications for Nandini · interview invite, applied, job recs, drafting, support reply, payment confirmed' },
            { label: 'Notification templates', desc: '5 templates · Trial granted, Job recommended, Application submitted, Upgrade prompt, Support reply' },
            { label: 'Routing', desc: 'State-based: role (public/user/admin) × view (26 named views). No URL routing — prototype-safe.' },
          ].map((item, i) => (
            <Card key={i} style={{ padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Gap-audit coverage">
        <Card>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.6 }}>All 11 items from the design review are implemented as first-class features in this build:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Fit score rubric (4 sliders, weighted formula) on Add Job page',
              'Proof-of-submission field on every application row (email / app ID / screenshot / note)',
              'QC sign-off gate — separate QC queue, approve-&-mark-applied or return-to-drafting',
              'Staff capacity dashboard with load bars, utilisation %, at-capacity warnings',
              'Refund flow — Refund button on every payment card, status updates with audit trail',
              'Notification template library — 5 templates with trigger labels and {variable} markers',
              'CSV export for users, applications, payments and staff',
              'Consent checkboxes in signup wizard step 8 (data processing + apply-on-behalf)',
              'Internal notes field on User Detail (staff-only, clearly labelled)',
              'Upgrade/top-up page with 3 paid tiers, upsell banner for low-balance users',
              '"Not a bot" section on Home page with team values and testimonial',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13 }}>
                <span style={{ color: '#1F7A4D', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ color: 'var(--muted)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Technology stack">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { label: 'Framework', value: 'React 18 (Vite)', note: 'Component tree, state, no URL routing' },
            { label: 'Styling', value: 'Inline styles + CSS custom properties', note: 'Token-driven, dark mode via data-theme attribute' },
            { label: 'Fonts', value: 'Newsreader, Public Sans, IBM Plex Mono', note: 'Google Fonts — display, UI, mono roles' },
            { label: 'State', value: 'useState (App.jsx)', note: 'role, view, theme, approvals, step, toast, selUser, rubric' },
            { label: 'Data', value: 'Static demo data (src/data.js)', note: '6 exported datasets + helper functions' },
            { label: 'Build', value: 'Vite 5', note: 'Dev server + production build' },
          ].map((item, i) => (
            <Card key={i} style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{item.note}</div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}
