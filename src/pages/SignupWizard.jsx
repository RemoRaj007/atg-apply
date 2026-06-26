import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { WSTEPS } from '../data.js'

const HINTS = [
  'Your contact details and online presence.',
  'Where you can legally work and when you can start.',
  'Your most recent or highest qualification.',
  'Your work history — add as many roles as needed.',
  'What kinds of roles and locations you want us to target.',
  'Tools, technologies and languages you bring.',
  'Upload your CV. Our team tailors it for each application.',
  'Review and confirm before we start.',
]

const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }
const fin = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
const fopt = { fontWeight: 400, color: 'var(--muted)', fontSize: 12 }
const fchipOn = { display: 'inline-flex', padding: '6px 13px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }
const fchip = { display: 'inline-flex', padding: '6px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--muted)' }

function Step0() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div><label style={flbl}>Full name</label><input defaultValue="Tharindu Wickramasinghe" style={fin} /></div>
      <div><label style={flbl}>Email</label><input defaultValue="tharindu.w@gmail.com" style={fin} /></div>
      <div><label style={flbl}>Phone / WhatsApp</label><input defaultValue="+94 71 555 0142" style={fin} /></div>
      <div><label style={flbl}>Country of residence</label><input defaultValue="Sri Lanka" style={fin} /></div>
      <div><label style={flbl}>Nationality</label><input defaultValue="Sri Lankan" style={fin} /></div>
      <div><label style={flbl}>LinkedIn URL</label><input defaultValue="linkedin.com/in/tharindu-w" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label style={flbl}>Portfolio URL <span style={fopt}>optional</span></label><input placeholder="dribbble.com/…" style={fin} /></div>
    </div>
  )
}

function Step1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={flbl}>Target countries</label><input defaultValue="Sri Lanka, UAE, Singapore" style={fin} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={flbl}>Visa / work authorization</label>
          <select style={fin}><option>Citizen / no sponsorship needed</option><option>Have permit for target country</option><option>Need sponsorship</option></select>
        </div>
        <div>
          <label style={flbl}>Availability</label>
          <select style={fin}><option>Immediately</option><option>2 weeks notice</option><option>1 month notice</option></select>
        </div>
      </div>
      <div>
        <label style={flbl}>Relocation preference</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
          <span style={fchipOn}>Open to relocate</span>
          <span style={fchip}>Hybrid only</span>
          <span style={fchip}>Stay in current city</span>
        </div>
      </div>
    </div>
  )
}

function Step2() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div><label style={flbl}>Highest degree</label><input defaultValue="BSc (Hons) Information Technology" style={fin} /></div>
      <div><label style={flbl}>University</label><input defaultValue="University of Moratuwa" style={fin} /></div>
      <div><label style={flbl}>Country</label><input defaultValue="Sri Lanka" style={fin} /></div>
      <div><label style={flbl}>Graduation date</label><input defaultValue="2019-08" type="month" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label style={flbl}>Key modules</label><input defaultValue="HCI, Interaction Design, Software Engineering" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label style={flbl}>Certifications <span style={fopt}>optional</span></label><input defaultValue="Google UX Design Certificate" style={fin} /></div>
    </div>
  )
}

function Step3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><label style={flbl}>Job title</label><input defaultValue="UX / Product Designer" style={fin} /></div>
        <div><label style={flbl}>Employer</label><input defaultValue="Creative Hub (Pvt) Ltd" style={fin} /></div>
        <div><label style={flbl}>From</label><input defaultValue="2021-03" type="month" style={fin} /></div>
        <div><label style={flbl}>To</label><input defaultValue="Present" style={fin} /></div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={flbl}>Key achievements &amp; tools</label>
          <textarea rows={2} style={fin} defaultValue="Led redesign of 3 fintech apps; Figma, design systems, user research." />
        </div>
      </div>
      <button style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--surface)', border: '1px dashed var(--border-2)', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        <Icon name="plus" size={15} /> Add another role
      </button>
    </div>
  )
}

function Step4() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={flbl}>Target job titles</label><input defaultValue="Senior UX Designer, Product Designer" style={fin} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label style={flbl}>Sectors</label><input defaultValue="Software, Fintech, Telecom" style={fin} /></div>
        <div><label style={flbl}>Cities / countries</label><input defaultValue="Colombo, Dubai, Remote" style={fin} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={flbl}>Work mode</label>
          <select style={fin}><option>Hybrid preferred</option><option>Remote</option><option>On-site</option></select>
        </div>
        <div><label style={flbl}>Expected salary <span style={fopt}>optional</span></label><input defaultValue="LKR 350,000+/mo" style={fin} /></div>
      </div>
    </div>
  )
}

function Step5() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label style={flbl}>Technical skills</label><input defaultValue="Figma, Design systems, Prototyping, User research, HTML/CSS" style={fin} /></div>
      <div><label style={flbl}>Soft skills</label><input defaultValue="Stakeholder communication, Facilitation, Mentoring" style={fin} /></div>
      <div>
        <label style={flbl}>Languages &amp; proficiency</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
          <span style={fchipOn}>English · Fluent</span>
          <span style={fchipOn}>Sinhala · Native</span>
          <span style={fchipOn}>Tamil · Conversational</span>
        </div>
      </div>
    </div>
  )
}

function Step6() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)', borderRadius: 11, padding: 16, background: 'var(--surface-2)' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: '#E3F3E8', color: '#1F7A4D' }}>
          <Icon name="check" size={20} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>CV — Tharindu_W_CV.pdf</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Uploaded · 214 KB</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>Replace</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed var(--border-2)', borderRadius: 11, padding: 16, background: 'var(--surface)', cursor: 'pointer' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--muted)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Cover letter <span style={fopt}>optional</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>PDF or DOCX, up to 5 MB</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed var(--border-2)', borderRadius: 11, padding: 16, background: 'var(--surface)', cursor: 'pointer' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--muted)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Certificates <span style={fopt}>if useful</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Degree, professional certifications</div>
        </div>
      </div>
    </div>
  )
}

function Step7({ consent1, consent2, onC1, onC2, onPrivacy, onTerms }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={flbl}>Job links you'd like reviewed <span style={fopt}>optional</span></label>
        <textarea rows={2} placeholder="Paste any specific job postings here…" style={fin} />
      </div>
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 15, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--surface-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={consent1} onChange={onC1} style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--primary)' }} />
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>
          I consent to ATG Concordia processing my personal data to provide this service, in line with the{' '}
          <button onClick={onPrivacy} type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 14, textDecoration: 'underline' }}>Privacy Policy</button>.
        </span>
      </label>
      <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 15, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--surface-2)', cursor: 'pointer' }}>
        <input type="checkbox" checked={consent2} onChange={onC2} style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--primary)' }} />
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>
          I give the ATG team permission to prepare and submit job applications on my behalf. I understand I approve each role before it is submitted, and that placement is not guaranteed.
        </span>
      </label>
    </div>
  )
}

const STEPS = [Step0, Step1, Step2, Step3, Step4, Step5, Step6]

export default function SignupWizard({ step, consent1, consent2, draftSaved, onNext, onPrev, onSaveDraft, onFinish, onToggleC1, onToggleC2, onPrivacy }) {
  const total = WSTEPS.length
  const pct = `${Math.round(((step + 1) / total) * 100)}%`
  const isLast = step === total - 1
  const StepComp = STEPS[step]

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '-.01em', margin: 0 }}>Create your profile</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 15 }}>Step {step + 1} of {total} · {WSTEPS[step]} · about 12 minutes total</p>
        </div>
        <button onClick={onSaveDraft} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--muted)' }}>
          <Icon name="save" size={16} /> Save draft
        </button>
      </div>

      <div style={{ height: 6, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden', margin: '14px 0 24px' }}>
        <div style={{ height: '100%', width: pct, background: 'var(--accent)', borderRadius: 99, transition: 'width .3s ease-out' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 28, alignItems: 'start' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 80 }}>
          {WSTEPS.map((label, i) => {
            const done = i < step
            const active = i === step
            return (
              <button
                key={i}
                onClick={() => {}}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: active ? 600 : 500, textAlign: 'left',
                  background: active ? 'var(--surface-3)' : 'transparent',
                  color: active ? 'var(--on-surface)' : done ? 'var(--on-surface)' : 'var(--muted)',
                }}
              >
                <span style={{
                  display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%',
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                  background: done ? 'var(--primary)' : active ? 'var(--accent)' : 'transparent',
                  color: done || active ? '#fff' : 'var(--muted)',
                  border: done || active ? 'none' : '1.5px solid var(--border-2)',
                }}>
                  {done ? '✓' : i + 1}
                </span>
                {label}
              </button>
            )
          })}
        </nav>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, minHeight: 380 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, margin: '0 0 4px' }}>{WSTEPS[step]}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 22px' }}>{HINTS[step]}</p>

          {step < 7
            ? <StepComp />
            : <Step7 consent1={consent1} consent2={consent2} onC1={onToggleC1} onC2={onToggleC2} onPrivacy={onPrivacy} />
          }

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <button
              onClick={onPrev}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 9, border: '1px solid var(--border)',
                background: 'var(--surface)', fontWeight: 600, fontSize: 13, cursor: step === 0 ? 'not-allowed' : 'pointer',
                color: step === 0 ? 'var(--border)' : 'var(--muted)',
              }}
              disabled={step === 0}
            >
              <Icon name="chevronLeft" size={15} /> Back
            </button>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {draftSaved && <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Draft saved</span>}
              {isLast
                ? <button onClick={onFinish} style={{ padding: '12px 24px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Submit profile &amp; get 2 free</button>
                : <button onClick={onNext} style={{ padding: '12px 24px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Continue</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
