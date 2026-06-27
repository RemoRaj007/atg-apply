import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Toast from './components/Toast.jsx'
import Icon from './components/Icon.jsx'
import { useLang } from './i18n/LanguageContext.jsx'
import { useAuth } from './lib/AuthContext.jsx'
import { updateJobApproval, createClientRecord, createClientProfile } from './lib/db.js'
import { Home, HowItWorks, Pricing, Contact, Privacy, Terms } from './pages/PublicPages.jsx'
import SignupWizard from './pages/SignupWizard.jsx'
import ArchitecturePage from './pages/ArchitecturePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import {
  CustomerDashboard, CustomerJobs, CustomerApplications, CustomerDocuments,
  CustomerPayments, CustomerUpgrade, CustomerNotifications, CustomerSupport,
  CustomerProfile, CustomerScholarships
} from './pages/CustomerPages.jsx'
import {
  AdminDashboard, AdminUsers, AdminUserDetail, AdminAddJob, AdminApplications,
  AdminQCQueue, AdminPayments, AdminStaff, AdminNotifications, AdminExport
} from './pages/AdminPages.jsx'

function PublicNav({ view, onNav, onSignup }) {
  const { t } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const lnk = (v, label) => (
    <button
      onClick={() => { onNav('public', v); setMobileOpen(false) }}
      style={{
        padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14,
        background: 'none', fontWeight: view === v ? 600 : 400, color: view === v ? 'var(--on-surface)' : 'var(--muted)',
        textAlign: 'left', minHeight: 40,
      }}
    >{label}</button>
  )
  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 'var(--header-h)', zIndex: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', padding: '10px 20px' }}>
        <div className="public-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {lnk('home', t('nav.home'))}
          {lnk('how', t('nav.how'))}
          {lnk('pricing', t('nav.pricing'))}
          {lnk('contact', t('nav.contact'))}
          {lnk('privacy', t('nav.privacy'))}
          {lnk('terms', t('nav.terms'))}
        </div>
        <button
          className="public-nav-toggle tap-target"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          aria-label="Toggle site navigation"
          style={{ display: 'none', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          {t('nav.menu')} <Icon name={mobileOpen ? 'x' : 'menu'} size={16} />
        </button>
        <span style={{ flex: 1 }} />
        <button onClick={onSignup} style={{ padding: '9px 18px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{t('nav.startFree')}</button>
      </div>
      {mobileOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 20px 12px', borderTop: '1px solid var(--border)' }}>
          {lnk('home', t('nav.home'))}
          {lnk('how', t('nav.how'))}
          {lnk('pricing', t('nav.pricing'))}
          {lnk('contact', t('nav.contact'))}
          {lnk('privacy', t('nav.privacy'))}
          {lnk('terms', t('nav.terms'))}
        </div>
      )}
    </nav>
  )
}

export default function App() {
  const { t } = useLang()
  const auth = useAuth()

  // roleOverride lets the demo switcher in Header preview any role
  // Real role from auth takes precedence when it matches the override
  const [roleOverride, setRoleOverride] = useState('public')
  const [view, setView] = useState('home')
  const [theme, setTheme] = useState('light')
  const [step, setStep] = useState(0)
  const [consent1, setConsent1] = useState(false)
  const [consent2, setConsent2] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [selUser, setSelUser] = useState(null)
  const [approvals, setApprovals] = useState({})
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

  // When auth resolves, sync the role override to match the real role
  useEffect(() => {
    if (!auth.loading && auth.profile) {
      setRoleOverride(auth.profile.role)
      if (auth.profile.role === 'user') setView('u-dash')
      if (auth.profile.role === 'admin') setView('a-dash')
    }
  }, [auth.loading, auth.profile])

  // Effective role: if logged in, honour auth role; otherwise use override for demo
  const role = auth.profile ? auth.profile.role : roleOverride

  // Client ID: real from auth, or 'u4' (mock) for demo preview
  const clientId = auth.profile?.role === 'user' ? auth.profile.id : (roleOverride === 'user' ? 'u4' : null)
  const adminName = auth.profile?.role === 'admin' ? auth.profile.name : 'Dilani Jayasuriya'

  const flash = (msg) => {
    setToast(msg)
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }

  const nav = (r, v) => {
    setRoleOverride(r)
    setView(v)
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const approveJob = useCallback(async (id) => {
    setApprovals(a => ({ ...a, [id]: 'approved' }))
    flash(t('toast.jobApproved'))
    if (auth.profile) {
      try { await updateJobApproval(id, 'approved') } catch (_) { /* optimistic */ }
    }
  }, [auth.profile, t])

  const declineJob = useCallback(async (id) => {
    setApprovals(a => ({ ...a, [id]: 'declined' }))
    flash(t('toast.jobSkipped'))
    if (auth.profile) {
      try { await updateJobApproval(id, 'declined') } catch (_) { /* optimistic */ }
    }
  }, [auth.profile, t])

  const handleSignupFinish = async (formData) => {
    const email = (formData.email || '').trim()
    const password = formData.password || ''
    const name = (formData.fullName || '').trim()

    if (!email || !password || !name) { flash('Please fill in your name, email, and password'); return }
    if (password.length < 8) { flash('Password must be at least 8 characters'); return }

    setSignupLoading(true)
    try {
      const { data, error: authError } = await auth.signUp(email, password, {
        data: { full_name: name },
      })
      if (authError) { flash(authError.message); return }

      const authUserId = data?.user?.id
      if (!authUserId) {
        flash('Account created! Check your email to verify, then sign in.')
        nav('public', 'login')
        return
      }

      const clientId = await createClientRecord({
        authUserId,
        name,
        email,
        phone: formData.phone || '',
        country: formData.country || '',
        city: formData.city || '',
        profession: (formData.targetTitles || '').split(',')[0].trim(),
      })

      createClientProfile(clientId, {
        nationality: formData.nationality,
        linkedin_url: formData.linkedin,
        portfolio_url: formData.portfolio,
        target_countries: formData.targetCountries,
        visa_status: formData.visa,
        availability: formData.availability,
        degree: formData.degree,
        university: formData.university,
        edu_country: formData.eduCountry,
        grad_date: formData.gradDate,
        modules: formData.modules,
        certifications: formData.certifications,
        job_title: formData.jobTitle,
        employer: formData.employer,
        from_date: formData.fromDate,
        to_date: formData.toDate,
        achievements: formData.achievements,
        target_titles: formData.targetTitles,
        sectors: formData.sectors,
        target_cities: formData.cities,
        work_mode: formData.workMode,
        expected_salary: formData.salary,
        tech_skills: formData.techSkills,
        soft_skills: formData.softSkills,
        job_links: formData.jobLinks,
      }).catch(err => console.warn('Profile insert warn:', err))

      flash(t('toast.profileSubmitted'))
      if (data.session) {
        await auth.resolveProfile(authUserId)
      } else {
        nav('public', 'login')
      }
    } catch (err) {
      flash(err.message || 'Signup failed')
    } finally {
      setSignupLoading(false)
    }
  }

  const handleSignOut = async () => {
    await auth.signOut()
    setRoleOverride('public')
    setView('home')
    setApprovals({})
  }

  const isPublic = role === 'public'
  const isShell = role === 'user' || role === 'admin'

  const whoName = role === 'user' ? (auth.profile?.name || 'Nandini') : adminName
  const whoRole = role === 'user' ? (auth.profile?.packageName || 'Professional') : 'Admin · Founder'
  const whoInitials = (whoName || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const userNav = [
    { view: 'u-dash', label: t('cust.nav.dashboard'), icon: 'home' },
    { view: 'u-jobs', label: t('cust.nav.jobs'), icon: 'briefcase' },
    { view: 'u-apps', label: t('cust.nav.applications'), icon: 'list' },
    { view: 'u-scholarships', label: t('cust.nav.scholarships'), icon: 'globe' },
    { view: 'u-docs', label: t('cust.nav.documents'), icon: 'file' },
    { view: 'u-pay', label: t('cust.nav.payments'), icon: 'card' },
    { view: 'u-upgrade', label: t('cust.nav.upgrade'), icon: 'spark' },
    { view: 'u-notify', label: t('cust.nav.notifications'), icon: 'bell' },
    { view: 'u-support', label: t('cust.nav.support'), icon: 'chat' },
    { view: 'u-profile', label: t('cust.nav.profile'), icon: 'users' },
  ]

  const adminNav = [
    { view: 'a-dash', label: t('admin.nav.overview'), icon: 'home' },
    { view: 'a-users', label: t('admin.nav.users'), icon: 'users' },
    { view: 'a-jobnew', label: t('admin.nav.addJob'), icon: 'briefcase' },
    { view: 'a-apps', label: t('admin.nav.applications'), icon: 'list' },
    { view: 'a-qc', label: t('admin.nav.qc'), icon: 'shield' },
    { view: 'a-pay', label: t('admin.nav.payments'), icon: 'card' },
    { view: 'a-staff', label: t('admin.nav.staff'), icon: 'gauge' },
    { view: 'a-notify', label: t('admin.nav.notifications'), icon: 'bell' },
    { view: 'a-export', label: t('admin.nav.export'), icon: 'download' },
  ]

  const setViewAndClose = (v) => { setView(v); setSidebarOpen(false) }

  const renderPublicPage = () => {
    const go = (v) => nav('public', v)
    switch (view) {
      case 'home': return <Home onSignup={() => { setStep(0); nav('public', 'signup') }} onHow={() => go('how')} onPricing={() => go('pricing')} />
      case 'how': return <HowItWorks />
      case 'pricing': return <Pricing onSignup={() => { setStep(0); nav('public', 'signup') }} onTerms={() => go('terms')} />
      case 'contact': return <Contact onSend={() => flash(t('toast.messageSentReply'))} />
      case 'privacy': return <Privacy />
      case 'terms': return <Terms />
      case 'arch': return <ArchitecturePage />
      case 'login': return (
        <LoginPage
          onSuccess={() => { /* AuthContext useEffect handles nav */ }}
          onSignup={() => { setStep(0); nav('public', 'signup') }}
        />
      )
      case 'signup': return (
        <SignupWizard
          step={step} consent1={consent1} consent2={consent2} draftSaved={draftSaved}
          loading={signupLoading}
          onNext={() => setStep(s => Math.min(s + 1, 7))}
          onPrev={() => setStep(s => Math.max(s - 1, 0))}
          onSaveDraft={() => { setDraftSaved(true); flash(t('toast.draftSaved')) }}
          onFinish={handleSignupFinish}
          onToggleC1={() => setConsent1(c => !c)}
          onToggleC2={() => setConsent2(c => !c)}
          onPrivacy={() => go('privacy')}
          onGoToStep={(i) => setStep(s => i <= s ? i : s)}
        />
      )
      default: return <Home onSignup={() => { setStep(0); nav('public', 'signup') }} onHow={() => go('how')} onPricing={() => go('pricing')} />
    }
  }

  const renderCustomerPage = () => {
    const cp = { clientId, approvals, onApprove: approveJob, onDecline: declineJob }
    switch (view) {
      case 'u-dash': return <CustomerDashboard {...cp} onGoJobs={() => setViewAndClose('u-jobs')} onGoApps={() => setViewAndClose('u-apps')} onGoUpgrade={() => setViewAndClose('u-upgrade')} onGoProfile={() => setViewAndClose('u-profile')} onGoNotify={() => setViewAndClose('u-notify')} />
      case 'u-jobs': return <CustomerJobs {...cp} />
      case 'u-apps': return <CustomerApplications {...cp} />
      case 'u-scholarships': return <CustomerScholarships />
      case 'u-docs': return <CustomerDocuments clientId={clientId} />
      case 'u-pay': return <CustomerPayments clientId={clientId} />
      case 'u-upgrade': return <CustomerUpgrade onUpgrade={() => flash(t('toast.upgradeRequested'))} />
      case 'u-notify': return <CustomerNotifications clientId={clientId} />
      case 'u-support': return <CustomerSupport clientId={clientId} onSend={() => flash(t('toast.messageSent'))} />
      case 'u-profile': return <CustomerProfile clientId={clientId} onSave={() => flash(t('toast.profileSaved'))} />
      default: return <CustomerDashboard {...cp} onGoJobs={() => setViewAndClose('u-jobs')} onGoApps={() => setViewAndClose('u-apps')} onGoUpgrade={() => setViewAndClose('u-upgrade')} onGoProfile={() => setViewAndClose('u-profile')} onGoNotify={() => setViewAndClose('u-notify')} />
    }
  }

  const renderAdminPage = () => {
    switch (view) {
      case 'a-dash': return <AdminDashboard onGoQC={() => setViewAndClose('a-qc')} onGoPay={() => setViewAndClose('a-pay')} />
      case 'a-users': return <AdminUsers onOpenUser={(id) => { setSelUser(id); setViewAndClose('a-user') }} onGoExport={() => setViewAndClose('a-export')} />
      case 'a-user': return <AdminUserDetail userId={selUser} onBack={() => setViewAndClose('a-users')} onGoAddJob={() => setViewAndClose('a-jobnew')} onToast={flash} />
      case 'a-jobnew': return <AdminAddJob userId={selUser} onSave={() => { flash(t('toast.jobRecAdded')); setViewAndClose('a-user') }} />
      case 'a-apps': return <AdminApplications />
      case 'a-qc': return <AdminQCQueue onToast={flash} />
      case 'a-pay': return <AdminPayments onToast={flash} />
      case 'a-staff': return <AdminStaff />
      case 'a-notify': return <AdminNotifications />
      case 'a-export': return <AdminExport onToast={flash} />
      default: return <AdminDashboard onGoQC={() => setViewAndClose('a-qc')} onGoPay={() => setViewAndClose('a-pay')} />
    }
  }

  // Show spinner while auth resolves on first load
  if (auth.loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: 'var(--muted)' }}>
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="var(--primary)" />
            <path d="M18 8.5L9 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M18 8.5L27 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M12.5 21.5H23.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" />
            <circle cx="18" cy="8.5" r="3" fill="var(--accent)" />
          </svg>
          <span style={{ fontSize: 14 }}>Loading…</span>
        </div>
      </div>
    )
  }

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--surface-2)', color: 'var(--on-surface)', fontFamily: 'var(--font-ui)' }}>
      <Header
        role={role}
        view={view}
        theme={theme}
        showMenuToggle={isShell}
        onToggleMenu={() => setSidebarOpen(o => !o)}
        onViewPublic={() => nav('public', 'home')}
        onViewUser={() => { if (auth.profile?.role === 'user') nav('user', 'u-dash'); else nav('user', 'u-dash') }}
        onViewAdmin={() => { if (auth.profile?.role === 'admin') nav('admin', 'a-dash'); else nav('admin', 'a-dash') }}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onGoHome={() => nav('public', 'home')}
        onGoArch={() => nav('public', 'arch')}
        isLoggedIn={!!auth.profile}
        onLogin={() => nav('public', 'login')}
        onSignOut={handleSignOut}
      />

      {isPublic && (
        <>
          {view !== 'login' && view !== 'signup' && (
            <PublicNav view={view} onNav={nav} onSignup={() => { setStep(0); nav('public', 'signup') }} />
          )}
          <main>{renderPublicPage()}</main>
          {view !== 'arch' && view !== 'login' && view !== 'signup' && <Footer onNav={nav} />}
        </>
      )}

      {isShell && (
        <div className="app-shell">
          <Sidebar
            role={role}
            view={view}
            onNav={(v) => setView(v)}
            userNav={userNav}
            adminNav={adminNav}
            whoName={whoName}
            whoRole={whoRole}
            whoInitials={whoInitials}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSignOut={handleSignOut}
            isLoggedIn={!!auth.profile}
          />
          <main style={{ minWidth: 0, padding: 0 }}>
            {role === 'user' ? renderCustomerPage() : renderAdminPage()}
          </main>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function Footer({ onNav }) {
  const { t } = useLang()
  const lnk = (role, view, label) => (
    <button onClick={() => onNav(role, view)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', fontWeight: 400, fontSize: 14, cursor: 'pointer', padding: '2px 0', textAlign: 'left', fontFamily: 'inherit' }}>{label}</button>
  )
  return (
    <footer style={{ background: 'var(--primary)', color: 'var(--on-primary)', marginTop: 0 }}>
      <div className="container footer-grid" style={{ padding: '40px 24px', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="rgba(255,255,255,.15)" /><path d="M18 8.5L9 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" /><path d="M18 8.5L27 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" /><path d="M12.5 21.5H23.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" /><circle cx="18" cy="8.5" r="3" fill="#C2613B" /></svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>ATG Apply</span>
          </div>
          <p style={{ fontSize: 13, opacity: .75, lineHeight: 1.6, margin: 0, maxWidth: '24em' }}>{t('footer.tagline')}</p>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .6, marginBottom: 12 }}>{t('footer.product')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lnk('public', 'how', t('nav.how'))}
            {lnk('public', 'pricing', t('nav.pricing'))}
            {lnk('public', 'signup', t('footer.startFree'))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .6, marginBottom: 12 }}>{t('footer.company')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lnk('public', 'contact', t('nav.contact'))}
            {lnk('public', 'arch', t('nav.architecture'))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .6, marginBottom: 12 }}>{t('footer.legal')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lnk('public', 'privacy', t('legal.privacyTitle'))}
            {lnk('public', 'terms', t('legal.termsTitle'))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
        <div className="container" style={{ padding: '16px 24px', fontSize: 12, opacity: .6 }}>
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
