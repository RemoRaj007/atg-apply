import { PRICING } from '../data.js'
import Icon from '../components/Icon.jsx'

const fin = 'width:100%;padding:11px 13px;border-radius:9px;border:1px solid var(--border-2);background:var(--surface-2);font-size:14px;color:inherit;font-family:inherit'
const finStyle = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', fontFamily: 'inherit' }

export function Home({ onSignup, onHow, onPricing }) {
  return (
    <div>
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container grid-2" style={{ padding: '64px 24px 56px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 13px', borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
              Human-managed · Research-led
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-6xl)', lineHeight: 1.08, letterSpacing: '-.02em', margin: '20px 0 0' }}>Your personal job application team.</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'var(--muted)', margin: '18px 0 0', maxWidth: '30em' }}>We help students, graduates and busy professionals find suitable jobs, prepare stronger applications, and apply with confidence. Our trained team researches roles, checks your fit, tailors your CV and motivation letter, and submits on your behalf.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
              <button onClick={onSignup} className="tap-target" style={{ padding: '14px 24px', borderRadius: 10, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Start free — 2 applications</button>
              <button onClick={onHow} className="tap-target" style={{ padding: '14px 24px', borderRadius: 10, background: 'var(--surface)', color: 'var(--on-surface)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>See how it works</button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 14 }}>No card required. Pay only when you are satisfied.</p>
          </div>
          <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px 12px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>Your dashboard · this week</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Nandini R.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {[
                { fit: '88%', fitBg: '#E3F3E8', fitColor: '#1F7A4D', title: 'Senior UX Designer · MAS Holdings', sub: 'High fit · Applied · proof saved', statusLabel: 'Applied', statusBg: '#E3F3E8', statusColor: '#1F7A4D' },
                { fit: '82%', fitBg: '#EFE8F8', fitColor: '#6B3FA0', title: 'Product Designer · WSO2', sub: 'Interview scheduled 29 Jun', statusLabel: 'Interview', statusBg: '#EFE8F8', statusColor: '#6B3FA0' },
                { fit: '58%', fitBg: '#FBF0D9', fitColor: '#8A6100', title: 'UX Researcher · Dialog Axiata', sub: 'Awaiting your approval', statusLabel: 'Review', statusBg: 'var(--accent-soft)', statusColor: 'var(--accent)', border: '1px dashed var(--border-2)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: item.border || '1px solid var(--border)', borderRadius: 11, padding: '13px 14px' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: item.fitBg, color: item.fitColor, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{item.fit}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: item.statusColor, background: item.statusBg, padding: '4px 9px', borderRadius: 7, flexShrink: 0 }}>{item.statusLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 24px' }}>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          {[['2 free', 'applications to start'], ['100%', 'human-prepared & checked'], ['3', 'working-day match SLA'], ['Proof', 'of every submission']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600, color: 'var(--primary)' }}>{v}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '56px 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '-.01em', margin: '0 0 6px' }}>How it works</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 32px', fontSize: 16 }}>Four steps. Real people at every one.</p>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              ['01', 'Tell us about you', 'Complete a guided intake — experience, target roles, documents. About 12 minutes.'],
              ['02', 'We research & score', 'Your team finds roles and rates each one with a clear fit score and an honest reason.'],
              ['03', 'You approve', "Nothing is sent without your say-so. Approve the roles you like, skip the rest."],
              ['04', 'We apply & prove it', 'We tailor, QC and submit — then log proof of every application to your dashboard.'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 22 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)', fontWeight: 600 }}>{n}</div>
                <h3 style={{ fontSize: 17, margin: '10px 0 6px' }}>{t}</h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid-2" style={{ padding: '56px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 32, letterSpacing: '-.01em', margin: '0 0 16px' }}>Not a bot. A team.</h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.65, margin: '0 0 18px' }}>We don't mass auto-apply or scrape job boards and fire off generic applications. Trained specialists in Sri Lanka research roles, tailor each application, and run a quality check before anything is submitted in your name.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Every application reviewed by a person before it\'s sent', 'Sensitive documents never sent to external AI tools', 'You approve every role before we apply'].map(item => (
              <li key={item} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', fontSize: 15 }}>
                <span style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}><Icon name="check" size={18} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 16, padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, lineHeight: 1.45, fontWeight: 400 }}>"I had two interviews in three weeks. They handled the applications I never had time to finish — and showed me proof of every single one."</div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.15)', fontWeight: 600, flexShrink: 0 }}>ND</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Nandini R.</div>
              <div style={{ fontSize: 13, opacity: .75 }}>Senior UX Designer · Colombo</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, margin: '0 0 10px' }}>Start with two free applications.</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, margin: '0 0 24px' }}>Prove the quality first. Choose a package only when you're satisfied.</p>
          <button onClick={onSignup} className="tap-target" style={{ padding: '14px 28px', borderRadius: 10, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Create your account</button>
        </div>
      </section>
    </div>
  )
}

export function HowItWorks() {
  const journey = [
    { n: 1, t: 'You visit and start free', d: 'No card needed. Create your account and begin the guided intake.' },
    { n: 2, t: 'Complete your intake', d: 'Profile, work experience, target roles and CV — about 12 minutes, save-as-you-go.' },
    { n: 3, t: 'Submit your profile', d: 'Everything lands securely with your assigned ATG team in Sri Lanka.' },
    { n: 4, t: '2 free applications granted', d: 'Your trial balance is added instantly so you can see the service before paying.' },
    { n: 5, t: 'We review & research', d: 'Your team studies your profile and researches roles that genuinely fit.' },
    { n: 6, t: 'Jobs added with a fit score', d: 'Each role gets a 0–100 fit score and a plain-English reason for the rating.' },
    { n: 7, t: 'You approve the ones you want', d: 'Nothing is submitted without your approval. Skip anything that does not feel right.' },
    { n: 8, t: 'We tailor & quality-check', d: 'CV and motivation letter tailored to the role, then checked by a second person.' },
    { n: 9, t: 'A human submits the application', d: 'Applied manually — no scraping, no auto-apply bots, ever.' },
    { n: 10, t: 'Proof appears on your dashboard', d: 'Confirmation email, application ID or screenshot — logged as proof for each submission.' },
    { n: 11, t: 'Continue with a package', d: 'Happy after your trial? Pick Starter, Professional or Premium and your balance updates.' },
  ]
  return (
    <div className="container" style={{ maxWidth: 920, padding: '56px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-5xl)', letterSpacing: '-.02em', margin: '0 0 12px' }}>How ATG Apply works</h1>
      <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 40px', maxWidth: '38em' }}>A human-managed service from intake to submission. Here is the full 11-step journey your application takes — and exactly where you stay in control.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {journey.map(j => (
          <div key={j.n} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: 18, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', border: '1.5px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{j.n}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>{j.t}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 }}>{j.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 36, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 18 }}>How fit scores are decided</h3>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {[
            { label: 'High · 80–100%', c: '#1F7A4D', dot: '#1F7A4D', desc: 'Strong match. Recommended to apply.' },
            { label: 'Medium · 50–79%', c: '#8A6100', dot: '#B7791F', desc: 'Possible match — some skills, visa or experience gaps.' },
            { label: 'Low · under 50%', c: '#6B6F6B', dot: '#9AA0A0', desc: 'Weak match. Not recommended unless there\'s a special reason.' },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: item.c }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                {item.label}
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 0', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Pricing({ onSignup, onTerms }) {
  return (
    <div className="container" style={{ maxWidth: 1120, padding: '56px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-5xl)', letterSpacing: '-.02em', margin: '0 0 10px' }}>Simple, honest pricing</h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', margin: 0 }}>Start with 2 free applications. Pay only when you're satisfied.</p>
      </div>
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {PRICING.map(p => (
          <div key={p.name} style={{
            position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, padding: '26px 22px',
            borderRadius: 'var(--radius)',
            background: p.hi ? 'var(--primary)' : 'var(--surface)',
            color: p.hi ? 'var(--on-primary)' : 'var(--on-surface)',
            border: `1px solid ${p.hi ? 'transparent' : 'var(--border)'}`,
            boxShadow: p.hi ? 'var(--shadow)' : 'none',
          }}>
            {p.hi && <span style={{ position: 'absolute', top: -11, left: 22, padding: '4px 11px', borderRadius: 7, background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.03em' }}>Most popular</span>}
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: p.hi ? 'rgba(255,255,255,.85)' : 'var(--muted)' }}>{p.blurb}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, lineHeight: 1 }}>{p.price === 0 ? 'Free' : `$${p.price}`}</span>
              <span style={{ fontSize: 13, color: p.hi ? 'rgba(255,255,255,.8)' : 'var(--muted)' }}>{p.price === 0 ? '' : 'USD'}</span>
            </div>
            <div style={{ fontSize: 13, color: p.hi ? 'rgba(255,255,255,.8)' : 'var(--muted)' }}>{p.apps} applications</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {p.feats.map(f => (
                <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, lineHeight: 1.4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.hi ? 'rgba(255,255,255,.85)' : 'var(--primary)', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ color: p.hi ? 'rgba(255,255,255,.92)' : 'var(--on-surface)' }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onSignup}
              className="tap-target"
              style={{
                marginTop: 'auto', padding: 12, borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
                background: p.hi ? 'var(--accent)' : 'var(--surface-3)',
                color: p.hi ? '#fff' : 'var(--on-surface)',
              }}
            >{p.cta}</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', fontSize: 14, color: 'var(--muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <Icon name="shield" size={16} /> Payment by bank transfer or Wise · marked manually
        </span>
        <span>·</span>
        <span>14-day refund window — see <button onClick={onTerms} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 14, padding: 0, textDecoration: 'underline' }}>Terms</button></span>
      </div>
    </div>
  )
}

export function Contact({ onSend }) {
  return (
    <div className="container" style={{ maxWidth: 920, padding: '56px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-5xl)', letterSpacing: '-.02em', margin: '0 0 12px' }}>Contact &amp; support</h1>
      <p style={{ fontSize: 17, color: 'var(--muted)', margin: '0 0 36px', maxWidth: '34em' }}>A real person replies within one working day. Existing customers can also message their team directly from the dashboard.</p>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 28 }}>
        <form onSubmit={e => { e.preventDefault(); onSend?.() }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label htmlFor="contact-name" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your name</label><input id="contact-name" name="name" placeholder="Tharindu W." style={finStyle} /></div>
          <div><label htmlFor="contact-email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label><input id="contact-email" name="email" type="email" placeholder="you@email.com" style={finStyle} /></div>
          <div><label htmlFor="contact-message" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message</label><textarea id="contact-message" name="message" rows={5} placeholder="How can we help?" style={{ ...finStyle, resize: 'vertical' }} /></div>
          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 22px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Send message</button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['Email', 'hello@atgconcordia.com'], ['WhatsApp', '+94 76 000 0000'], ['Operating hours', 'Mon–Sat · 9:00–18:00 (Sri Lanka time, GMT+5:30)']].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 18 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Privacy() {
  const sections = [
    { title: 'Who we are', body: 'ATG Concordia (Pvt) Ltd operates ATG Apply, a human-managed job-application service. We are based in Colombo, Sri Lanka. This policy explains what data we collect, why, and your rights over it.' },
    { title: 'What we collect', body: 'To prepare and submit applications on your behalf we collect: your contact details, work authorization and visa status, education and employment history, target roles, skills and languages, and the documents you upload (CV, cover letter, certificates).' },
    { title: 'Data retention period', highlight: { k: '24 months', v: 'We keep your profile and application records for 24 months after your last activity, so your history and proofs remain available. After that, records are deleted or anonymised.' } },
    { title: 'Deletion requests', highlight: { k: '30 days', v: 'You may request deletion of your data at any time by emailing privacy@atgconcordia.com. We complete verified deletion requests within 30 days and confirm in writing.' } },
    { title: 'Sensitive data & external tools', body: 'Sensitive identifiers — passport numbers, national ID, full home addresses — are stored only where strictly necessary and are never sent to external or third-party AI tools. Fit analysis and drafting tools only ever receive de-identified role and skills information.' },
    { title: 'No automated scraping', body: 'We do not run automated scraping or bot-applications. Every application is prepared and submitted by a trained member of our team.' },
    { title: 'Refunds', body: 'Our refund terms are set out in the Terms of Service. Refund-related data (transaction reference, amount, status) is retained for accounting purposes for the period required by law.' },
    { title: 'Service-level commitment', highlight: { k: '3 working days', v: 'We aim to add your first recommended jobs within 3 working days of a completed intake. This is a service target, not a guarantee of placement.' } },
    { title: 'Your rights', body: 'You can access, correct, export or delete your data, and withdraw consent at any time. Contact privacy@atgconcordia.com.' },
  ]
  return (
    <div className="container" style={{ maxWidth: 820, padding: '56px 24px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, letterSpacing: '-.02em', margin: '0 0 8px' }}>Privacy policy</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 32px' }}>Last updated 26 June 2026 · ATG Concordia (Pvt) Ltd</p>
      {sections.map(s => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, margin: '0 0 10px' }}>{s.title}</h2>
          {s.body && <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 10px' }}>{s.body}</p>}
          {s.highlight && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: '14px 16px', margin: '4px 0 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{s.highlight.k}</span>
              <span style={{ fontSize: 14, lineHeight: 1.6 }}>{s.highlight.v}</span>
            </div>
          )}
        </section>
      ))}
    </div>
  )
}

export function Terms() {
  const sections = [
    { title: '1. The service', body: 'ATG Apply is a human-managed service that researches roles, prepares tailored applications, and submits them on your behalf after your approval. We provide a professional service; we do not employ you or guarantee any outcome.' },
    { title: '2. No guarantee of placement', highlight: { k: 'Important', v: 'We do not guarantee interviews, offers or employment. Our obligation is to prepare and submit applications to a professional standard and to provide proof of each submission.' } },
    { title: '3. Packages & balances', body: 'Trial includes 2 free applications. Paid packages — Starter (50/$60), Professional (100/$100), Premium (150/$150) — add applications to your balance. One application equals one submitted application to one role, with proof logged.' },
    { title: '4. Payment', body: 'Payment in V1 is manual (bank transfer or Wise). Your balance is activated once payment is marked received. Status can be Pending, Paid, Partially Paid or Refunded.' },
    { title: '5. Refund conditions', highlight: { k: '14 days', v: 'You may request a refund within 14 days of payment for any unused applications, provided fewer than 20% of the package has been used. Used applications and any work already completed are non-refundable.' } },
    { title: '6. Dispute process', body: 'If you are unhappy, contact support@atgconcordia.com. We aim to resolve disputes within 7 working days. Unresolved disputes are handled under the laws of Sri Lanka. Refunds approved through this process are issued via the original payment method within 14 days.' },
    { title: '7. Your responsibilities', body: 'You confirm the information and documents you provide are accurate and yours to share, and you grant permission to apply on your behalf. You approve each role before submission.' },
    { title: '8. Acceptable use', body: 'You may not use the service for fraudulent applications or misrepresentation. We may pause or end service for misuse, with a pro-rata refund of unused applications where appropriate.' },
  ]
  return (
    <div className="container" style={{ maxWidth: 820, padding: '56px 24px 72px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 40, letterSpacing: '-.02em', margin: '0 0 8px' }}>Terms of service</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 32px' }}>Last updated 26 June 2026 · ATG Concordia (Pvt) Ltd</p>
      {sections.map(s => (
        <section key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, margin: '0 0 10px' }}>{s.title}</h2>
          {s.body && <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 10px' }}>{s.body}</p>}
          {s.highlight && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 11, padding: '14px 16px', margin: '4px 0 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>{s.highlight.k}</span>
              <span style={{ fontSize: 14, lineHeight: 1.6 }}>{s.highlight.v}</span>
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
