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
const fchipOn = { display: 'inline-flex', padding: '6px 13px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }
const fchip = { display: 'inline-flex', padding: '6px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--muted)', fontFamily: 'inherit' }

function Step0() {
  return (
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div><label htmlFor="s0-name" style={flbl}>Full name</label><input id="s0-name" name="fullName" defaultValue="Tharindu Wickramasinghe" style={fin} /></div>
      <div><label htmlFor="s0-email" style={flbl}>Email</label><input id="s0-email" name="email" type="email" defaultValue="tharindu.w@gmail.com" style={fin} /></div>
      <div><label htmlFor="s0-phone" style={flbl}>Phone / WhatsApp</label><input id="s0-phone" name="phone" defaultValue="+94 71 555 0142" style={fin} /></div>
      <div><label htmlFor="s0-country" style={flbl}>Country of residence</label><input id="s0-country" name="country" defaultValue="Sri Lanka" style={fin} /></div>
      <div><label htmlFor="s0-nationality" style={flbl}>Nationality</label><input id="s0-nationality" name="nationality" defaultValue="Sri Lankan" style={fin} /></div>
      <div><label htmlFor="s0-linkedin" style={flbl}>LinkedIn URL</label><input id="s0-linkedin" name="linkedin" defaultValue="linkedin.com/in/tharindu-w" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label htmlFor="s0-portfolio" style={flbl}>Portfolio URL <span style={fopt}>optional</span></label><input id="s0-portfolio" name="portfolio" placeholder="dribbble.com/…" style={fin} /></div>
    </div>
  )
}

function Step1() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label htmlFor="s1-countries" style={flbl}>Target countries</label><input id="s1-countries" name="targetCountries" defaultValue="Sri Lanka, UAE, Singapore" style={fin} /></div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label htmlFor="s1-visa" style={flbl}>Visa / work authorization</label>
          <select id="s1-visa" name="visa" style={fin}><option>Citizen / no sponsorship needed</option><option>Have permit for target country</option><option>Need sponsorship</option></select>
        </div>
        <div>
          <label htmlFor="s1-availability" style={flbl}>Availability</label>
          <select id="s1-availability" name="availability" style={fin}><option>Immediately</option><option>2 weeks notice</option><option>1 month notice</option></select>
        </div>
      </div>
      <div>
        <span id="s1-reloc-label" style={flbl}>Relocation preference</span>
        <div role="radiogroup" aria-labelledby="s1-reloc-label" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
          <button type="button" aria-pressed="true" style={fchipOn}>Open to relocate</button>
          <button type="button" aria-pressed="false" style={fchip}>Hybrid only</button>
          <button type="button" aria-pressed="false" style={fchip}>Stay in current city</button>
        </div>
      </div>
    </div>
  )
}

function Step2() {
  return (
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div><label htmlFor="s2-degree" style={flbl}>Highest degree</label><input id="s2-degree" name="degree" defaultValue="BSc (Hons) Information Technology" style={fin} /></div>
      <div><label htmlFor="s2-university" style={flbl}>University</label><input id="s2-university" name="university" defaultValue="University of Moratuwa" style={fin} /></div>
      <div><label htmlFor="s2-country" style={flbl}>Country</label><input id="s2-country" name="eduCountry" defaultValue="Sri Lanka" style={fin} /></div>
      <div><label htmlFor="s2-grad" style={flbl}>Graduation date</label><input id="s2-grad" name="gradDate" defaultValue="2019-08" type="month" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label htmlFor="s2-modules" style={flbl}>Key modules</label><input id="s2-modules" name="modules" defaultValue="HCI, Interaction Design, Software Engineering" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label htmlFor="s2-certs" style={flbl}>Certifications <span style={fopt}>optional</span></label><input id="s2-certs" name="certifications" defaultValue="Google UX Design Certificate" style={fin} /></div>
    </div>
  )
}

function Step3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="grid-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><label htmlFor="s3-title" style={flbl}>Job title</label><input id="s3-title" name="jobTitle" defaultValue="UX / Product Designer" style={fin} /></div>
        <div><label htmlFor="s3-employer" style={flbl}>Employer</label><input id="s3-employer" name="employer" defaultValue="Creative Hub (Pvt) Ltd" style={fin} /></div>
        <div><label htmlFor="s3-from" style={flbl}>From</label><input id="s3-from" name="fromDate" defaultValue="2021-03" type="month" style={fin} /></div>
        <div><label htmlFor="s3-to" style={flbl}>To</label><input id="s3-to" name="toDate" defaultValue="Present" style={fin} /></div>
        <div style={{ gridColumn: 'span 2' }}>
          <label htmlFor="s3-achievements" style={flbl}>Key achievements &amp; tools</label>
          <textarea id="s3-achievements" name="achievements" rows={2} style={fin} defaultValue="Led redesign of 3 fintech apps; Figma, design systems, user research." />
        </div>
      </div>
      <button type="button" className="tap-target" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--surface)', border: '1px dashed var(--border-2)', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        <Icon name="plus" size={15} /> Add another role
      </button>
    </div>
  )
}

function Step4() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label htmlFor="s4-titles" style={flbl}>Target job titles</label><input id="s4-titles" name="targetTitles" defaultValue="Senior UX Designer, Product Designer" style={fin} /></div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label htmlFor="s4-sectors" style={flbl}>Sectors</label><input id="s4-sectors" name="sectors" defaultValue="Software, Fintech, Telecom" style={fin} /></div>
        <div><label htmlFor="s4-cities" style={flbl}>Cities / countries</label><input id="s4-cities" name="cities" defaultValue="Colombo, Dubai, Remote" style={fin} /></div>
      </div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label htmlFor="s4-workmode" style={flbl}>Work mode</label>
          <select id="s4-workmode" name="workMode" style={fin}><option>Hybrid preferred</option><option>Remote</option><option>On-site</option></select>
        </div>
        <div><label htmlFor="s4-salary" style={flbl}>Expected salary <span style={fopt}>optional</span></label><input id="s4-salary" name="salary" defaultValue="LKR 350,000+/mo" style={fin} /></div>
      </div>
    </div>
  )
}

function Step5() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label htmlFor="s5-tech" style={flbl}>Technical skills</label><input id="s5-tech" name="techSkills" defaultValue="Figma, Design systems, Prototyping, User research, HTML/CSS" style={fin} /></div>
      <div><label htmlFor="s5-soft" style={flbl}>Soft skills</label><input id="s5-soft" name="softSkills" defaultValue="Stakeholder communication, Facilitation, Mentoring" style={fin} /></div>
      <div>
        <span id="s5-lang-label" style={flbl}>Languages &amp; proficiency</span>
        <div role="group" aria-labelledby="s5-lang-label" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
          <button type="button" style={fchipOn}>English · Fluent</button>
          <button type="button" style={fchipOn}>Sinhala · Native</button>
          <button type="button" style={fchipOn}>Tamil · Conversational</button>
        </div>
      </div>
    </div>
  )
}

function Step6() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)', borderRadius: 11, padding: 16, background: 'var(--surface-2)' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: '#E3F3E8', color: '#1F7A4D', flexShrink: 0 }}>
          <Icon name="check" size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>CV — Tharindu_W_CV.pdf</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Uploaded · 214 KB</div>
        </div>
        <button type="button" className="tap-target" style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}>Replace</button>
      </div>
      <button type="button" className="tap-target" style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed var(--border-2)', borderRadius: 11, padding: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--muted)', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Cover letter <span style={fopt}>optional</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>PDF or DOCX, up to 5 MB</div>
        </div>
      </button>
      <button type="button" className="tap-target" style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed var(--border-2)', borderRadius: 11, padding: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--muted)', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Certificates <span style={fopt}>if useful</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Degree, professional certifications</div>
        </div>
      </button>
    </div>
  )
}

function Step7({ consent1, consent2, onC1, onC2, onPrivacy, onTerms }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label htmlFor="s7-joblinks" style={flbl}>Job links you'd like reviewed <span style={fopt}>optional</span></label>
        <textarea id="s7-joblinks" name="jobLinks" rows={2} placeholder="Paste any specific job postings here…" style={fin} />
      </div>
      <label htmlFor="s7-consent1" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 15, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--surface-2)', cursor: 'pointer' }}>
        <input id="s7-consent1" type="checkbox" checked={consent1} onChange={onC1} style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>
          I consent to ATG Concordia processing my personal data to provide this service, in line with the{' '}
          <button onClick={onPrivacy} type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 14, textDecoration: 'underline' }}>Privacy Policy</button>.
        </span>
      </label>
      <label htmlFor="s7-consent2" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 15, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--surface-2)', cursor: 'pointer' }}>
        <input id="s7-consent2" type="checkbox" checked={consent2} onChange={onC2} style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>
          I give the ATG team permission to prepare and submit job applications on my behalf. I understand I approve each role before it is submitted, and that placement is not guaranteed.
        </span>
      </label>
    </div>
  )
}

const STEPS = [Step0, Step1, Step2, Step3, Step4, Step5, Step6]

export default function SignupWizard({ step, consent1, consent2, draftSaved, onNext, onPrev, onSaveDraft, onFinish, onToggleC1, onToggleC2, onPrivacy, onGoToStep }) {
  const total = WSTEPS.length
  const pct = `${Math.round(((step + 1) / total) * 100)}%`
  const isLast = step === total - 1
  const StepComp = STEPS[step]

  return (
    <div className="container" style={{ maxWidth: 1080, padding: '40px 24px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-4xl)', letterSpacing: '-.01em', margin: 0 }}>Create your profile</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 15 }}>Step {step + 1} of {total} · {WSTEPS[step]} · about 12 minutes total</p>
        </div>
        <button onClick={onSaveDraft} className="tap-target" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--muted)' }}>
          <Icon name="save" size={16} /> Save draft
        </button>
      </div>

      <div role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total} aria-label="Profile completion" style={{ height: 6, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden', margin: '14px 0 24px' }}>
        <div style={{ height: '100%', width: pct, background: 'var(--accent)', borderRadius: 99, transition: 'width .3s ease-out' }} />
      </div>

      <div className="wizard-layout" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 28, alignItems: 'start' }}>
        <nav aria-label="Profile steps" className="wizard-steps-nav" style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 80 }}>
          {WSTEPS.map((label, i) => {
            const done = i < step
            const active = i === step
            const reachable = i <= step
            return (
              <button
                key={i}
                type="button"
                aria-current={active ? 'step' : undefined}
                disabled={!reachable}
                onClick={() => reachable && onGoToStep?.(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 12px', borderRadius: 9, border: 'none', cursor: reachable ? 'pointer' : 'default',
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
              className="tap-target"
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
                ? <button onClick={onFinish} className="tap-target" style={{ padding: '12px 24px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Submit profile &amp; get 2 free</button>
                : <button onClick={onNext} className="tap-target" style={{ padding: '12px 24px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Continue</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
