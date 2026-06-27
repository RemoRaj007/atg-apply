import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useLang } from '../i18n/LanguageContext.jsx'

const flbl = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }
const fin = { width: '100%', padding: '11px 13px', borderRadius: 9, border: '1px solid var(--border-2)', background: 'var(--surface-2)', fontSize: 14, color: 'inherit', boxSizing: 'border-box', fontFamily: 'inherit' }
const fopt = { fontWeight: 400, color: 'var(--muted)', fontSize: 12 }
const fchipOn = { display: 'inline-flex', padding: '6px 13px', borderRadius: 8, background: 'var(--primary)', color: 'var(--on-primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }
const fchip = { display: 'inline-flex', padding: '6px 13px', borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--muted)', fontFamily: 'inherit' }

function Step0() {
  const { t } = useLang()
  return (
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div><label htmlFor="s0-name" style={flbl}>{t('signup.fullName')}</label><input id="s0-name" name="fullName" defaultValue="Tharindu Wickramasinghe" style={fin} /></div>
      <div><label htmlFor="s0-email" style={flbl}>{t('signup.email')}</label><input id="s0-email" name="email" type="email" defaultValue="tharindu.w@gmail.com" style={fin} /></div>
      <div><label htmlFor="s0-phone" style={flbl}>{t('signup.phone')}</label><input id="s0-phone" name="phone" defaultValue="+94 71 555 0142" style={fin} /></div>
      <div><label htmlFor="s0-country" style={flbl}>{t('signup.country')}</label><input id="s0-country" name="country" defaultValue="Sri Lanka" style={fin} /></div>
      <div><label htmlFor="s0-nationality" style={flbl}>{t('signup.nationality')}</label><input id="s0-nationality" name="nationality" defaultValue="Sri Lankan" style={fin} /></div>
      <div><label htmlFor="s0-linkedin" style={flbl}>{t('signup.linkedin')}</label><input id="s0-linkedin" name="linkedin" defaultValue="linkedin.com/in/tharindu-w" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label htmlFor="s0-portfolio" style={flbl}>{t('signup.portfolio')} <span style={fopt}>{t('signup.optional')}</span></label><input id="s0-portfolio" name="portfolio" placeholder="dribbble.com/…" style={fin} /></div>
    </div>
  )
}

function Step1() {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label htmlFor="s1-countries" style={flbl}>{t('signup.targetCountries')}</label><input id="s1-countries" name="targetCountries" defaultValue="Sri Lanka, UAE, Singapore" style={fin} /></div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label htmlFor="s1-visa" style={flbl}>{t('signup.visa')}</label>
          <select id="s1-visa" name="visa" style={fin}><option>Citizen / no sponsorship needed</option><option>Have permit for target country</option><option>Need sponsorship</option></select>
        </div>
        <div>
          <label htmlFor="s1-availability" style={flbl}>{t('signup.availability')}</label>
          <select id="s1-availability" name="availability" style={fin}><option>Immediately</option><option>2 weeks notice</option><option>1 month notice</option></select>
        </div>
      </div>
      <div>
        <span id="s1-reloc-label" style={flbl}>{t('signup.relocation')}</span>
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
  const { t } = useLang()
  return (
    <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div><label htmlFor="s2-degree" style={flbl}>{t('signup.degree')}</label><input id="s2-degree" name="degree" defaultValue="BSc (Hons) Information Technology" style={fin} /></div>
      <div><label htmlFor="s2-university" style={flbl}>{t('signup.university')}</label><input id="s2-university" name="university" defaultValue="University of Moratuwa" style={fin} /></div>
      <div><label htmlFor="s2-country" style={flbl}>{t('signup.eduCountry')}</label><input id="s2-country" name="eduCountry" defaultValue="Sri Lanka" style={fin} /></div>
      <div><label htmlFor="s2-grad" style={flbl}>{t('signup.gradDate')}</label><input id="s2-grad" name="gradDate" defaultValue="2019-08" type="month" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label htmlFor="s2-modules" style={flbl}>{t('signup.modules')}</label><input id="s2-modules" name="modules" defaultValue="HCI, Interaction Design, Software Engineering" style={fin} /></div>
      <div style={{ gridColumn: 'span 2' }}><label htmlFor="s2-certs" style={flbl}>{t('signup.certifications')} <span style={fopt}>{t('signup.optional')}</span></label><input id="s2-certs" name="certifications" defaultValue="Google UX Design Certificate" style={fin} /></div>
    </div>
  )
}

function Step3() {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="grid-2" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><label htmlFor="s3-title" style={flbl}>{t('signup.jobTitle')}</label><input id="s3-title" name="jobTitle" defaultValue="UX / Product Designer" style={fin} /></div>
        <div><label htmlFor="s3-employer" style={flbl}>{t('signup.employer')}</label><input id="s3-employer" name="employer" defaultValue="Creative Hub (Pvt) Ltd" style={fin} /></div>
        <div><label htmlFor="s3-from" style={flbl}>{t('signup.from')}</label><input id="s3-from" name="fromDate" defaultValue="2021-03" type="month" style={fin} /></div>
        <div><label htmlFor="s3-to" style={flbl}>{t('signup.to')}</label><input id="s3-to" name="toDate" defaultValue="Present" style={fin} /></div>
        <div style={{ gridColumn: 'span 2' }}>
          <label htmlFor="s3-achievements" style={flbl}>{t('signup.achievements')}</label>
          <textarea id="s3-achievements" name="achievements" rows={2} style={fin} defaultValue="Led redesign of 3 fintech apps; Figma, design systems, user research." />
        </div>
      </div>
      <button type="button" className="tap-target" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, background: 'var(--surface)', border: '1px dashed var(--border-2)', color: 'var(--primary)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
        <Icon name="plus" size={15} /> {t('signup.addRole')}
      </button>
    </div>
  )
}

function Step4() {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label htmlFor="s4-titles" style={flbl}>{t('signup.targetTitles')}</label><input id="s4-titles" name="targetTitles" defaultValue="Senior UX Designer, Product Designer" style={fin} /></div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label htmlFor="s4-sectors" style={flbl}>{t('signup.sectors')}</label><input id="s4-sectors" name="sectors" defaultValue="Software, Fintech, Telecom" style={fin} /></div>
        <div><label htmlFor="s4-cities" style={flbl}>{t('signup.cities')}</label><input id="s4-cities" name="cities" defaultValue="Colombo, Dubai, Remote" style={fin} /></div>
      </div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label htmlFor="s4-workmode" style={flbl}>{t('signup.workMode')}</label>
          <select id="s4-workmode" name="workMode" style={fin}><option>Hybrid preferred</option><option>Remote</option><option>On-site</option></select>
        </div>
        <div><label htmlFor="s4-salary" style={flbl}>{t('signup.expectedSalary')} <span style={fopt}>{t('signup.optional')}</span></label><input id="s4-salary" name="salary" defaultValue="LKR 350,000+/mo" style={fin} /></div>
      </div>
    </div>
  )
}

function Step5() {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div><label htmlFor="s5-tech" style={flbl}>{t('signup.techSkills')}</label><input id="s5-tech" name="techSkills" defaultValue="Figma, Design systems, Prototyping, User research, HTML/CSS" style={fin} /></div>
      <div><label htmlFor="s5-soft" style={flbl}>{t('signup.softSkills')}</label><input id="s5-soft" name="softSkills" defaultValue="Stakeholder communication, Facilitation, Mentoring" style={fin} /></div>
      <div>
        <span id="s5-lang-label" style={flbl}>{t('signup.languages')}</span>
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
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border)', borderRadius: 11, padding: 16, background: 'var(--surface-2)' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: '#E3F3E8', color: '#1F7A4D', flexShrink: 0 }}>
          <Icon name="check" size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>CV — Tharindu_W_CV.pdf</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t('signup.cvUploaded')} · 214 KB</div>
        </div>
        <button type="button" className="tap-target" style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}>{t('signup.replace')}</button>
      </div>
      <button type="button" className="tap-target" style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed var(--border-2)', borderRadius: 11, padding: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--muted)', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{t('signup.coverLetter')} <span style={fopt}>{t('signup.optional')}</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t('signup.coverLetterSub')}</div>
        </div>
      </button>
      <button type="button" className="tap-target" style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px dashed var(--border-2)', borderRadius: 11, padding: 16, background: 'var(--surface)', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 10, background: 'var(--surface-3)', color: 'var(--muted)', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{t('signup.certificates')} <span style={fopt}>{t('signup.ifUseful')}</span></div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t('signup.certificatesSub')}</div>
        </div>
      </button>
    </div>
  )
}

function Step7({ consent1, consent2, onC1, onC2, onPrivacy, onTerms }) {
  const { t } = useLang()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label htmlFor="s7-joblinks" style={flbl}>{t('signup.jobLinks')} <span style={fopt}>{t('signup.optional')}</span></label>
        <textarea id="s7-joblinks" name="jobLinks" rows={2} placeholder={t('signup.jobLinksPlaceholder')} style={fin} />
      </div>
      <label htmlFor="s7-consent1" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 15, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--surface-2)', cursor: 'pointer' }}>
        <input id="s7-consent1" type="checkbox" checked={consent1} onChange={onC1} style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>
          {t('signup.consent1Pre')}{' '}
          <button onClick={onPrivacy} type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 14, textDecoration: 'underline' }}>{t('signup.consent1Link')}</button>.
        </span>
      </label>
      <label htmlFor="s7-consent2" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 15, border: '1px solid var(--border)', borderRadius: 11, background: 'var(--surface-2)', cursor: 'pointer' }}>
        <input id="s7-consent2" type="checkbox" checked={consent2} onChange={onC2} style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--primary)', flexShrink: 0 }} />
        <span style={{ fontSize: 14, lineHeight: 1.55 }}>
          {t('signup.consent2')}
        </span>
      </label>
    </div>
  )
}

const STEPS = [Step0, Step1, Step2, Step3, Step4, Step5, Step6]

export default function SignupWizard({ step, consent1, consent2, draftSaved, onNext, onPrev, onSaveDraft, onFinish, onToggleC1, onToggleC2, onPrivacy, onGoToStep }) {
  const { t } = useLang()
  const wsteps = [t('signup.step0'), t('signup.step1'), t('signup.step2'), t('signup.step3'), t('signup.step4'), t('signup.step5'), t('signup.step6'), t('signup.step7')]
  const hints = [t('signup.hint0'), t('signup.hint1'), t('signup.hint2'), t('signup.hint3'), t('signup.hint4'), t('signup.hint5'), t('signup.hint6'), t('signup.hint7')]
  const total = wsteps.length
  const pct = `${Math.round(((step + 1) / total) * 100)}%`
  const isLast = step === total - 1
  const StepComp = STEPS[step]

  return (
    <div className="container" style={{ maxWidth: 1080, padding: '40px 24px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-4xl)', letterSpacing: '-.01em', margin: 0 }}>{t('signup.title')}</h1>
          <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 15 }}>{t('signup.stepOf', { n: step + 1, total })} · {wsteps[step]} · {t('signup.minutesTotal')}</p>
        </div>
        <button onClick={onSaveDraft} className="tap-target" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--muted)' }}>
          <Icon name="save" size={16} /> {t('signup.saveDraft')}
        </button>
      </div>

      <div role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total} aria-label={t('signup.title')} style={{ height: 6, borderRadius: 99, background: 'var(--surface-3)', overflow: 'hidden', margin: '14px 0 24px' }}>
        <div style={{ height: '100%', width: pct, background: 'var(--accent)', borderRadius: 99, transition: 'width .3s ease-out' }} />
      </div>

      <div className="wizard-layout" style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 28, alignItems: 'start' }}>
        <nav aria-label={t('signup.title')} className="wizard-steps-nav" style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 80 }}>
          {wsteps.map((label, i) => {
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
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 24, margin: '0 0 4px' }}>{wsteps[step]}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 22px' }}>{hints[step]}</p>

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
              <Icon name="chevronLeft" size={15} /> {t('signup.back')}
            </button>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {draftSaved && <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{t('signup.draftSaved')}</span>}
              {isLast
                ? <button onClick={onFinish} className="tap-target" style={{ padding: '12px 24px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{t('signup.submit')}</button>
                : <button onClick={onNext} className="tap-target" style={{ padding: '12px 24px', borderRadius: 9, background: 'var(--primary)', color: 'var(--on-primary)', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{t('signup.continue')}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
