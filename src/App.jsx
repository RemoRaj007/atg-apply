import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Toast from './components/Toast.jsx'
import Icon from './components/Icon.jsx'
import { useLang } from './i18n/LanguageContext.jsx'
import { Home, HowItWorks, Pricing, Contact, Privacy, Terms } from './pages/PublicPages.jsx'
import SignupWizard from './pages/SignupWizard.jsx'
import ArchitecturePage from './pages/ArchitecturePage.jsx'
import {
  CustomerDashboard, CustomerJobs, CustomerApplications, CustomerDocuments,
  CustomerPayments, CustomerUpgrade, CustomerNotifications, CustomerSupport, CustomerProfile
} from './pages/CustomerPages.jsx'
import {
  AdminDashboard, AdminUsers, AdminUserDetail, AdminAddJob, AdminApplications,
  AdminQCQueue, AdminPayments, AdminStaff, AdminNotifications, AdminExport
} from './pages/AdminPages.jsx'
import { ROWS } from './data.js'

const MY_UID = 'u4'

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
  const [role, setRole] = useState('public')
  const [view, setView] = useState('home')
  const [theme, setTheme] = useState('light')
  const [step, setStep] = useState(0)
  const [consent1, setConsent1] = useState(false)
  const [consent2, setConsent2] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [selUser, setSelUser] = useState('u4')
  const [approvals, setApprovals] = useState({})
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const flash = (msg) => {
    setToast(msg)
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }

  const nav = (r, v) => {
    setRole(r)
    setView(v)
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const approveJob = (id) => {
    setApprovals(a => ({ ...a, [id]: 'approved' }))
    flash(t('toast.jobApproved'))
  }
  const declineJob = (id) => {
    setApprovals(a => ({ ...a, [id]: 'declined' }))
    flash(t('toast.jobSkipped'))
  }

  const myPendingCount = ROWS.filter(r => r.uid === MY_UID && (approvals[r.id] || r.approval) === 'pending').length
  const qcCount = ROWS.filter(r => r.status === 'qc').length

  const userNav = [
    { view: 'u-dash', label: t('cust.nav.dashboard'), icon: 'home' },
    { view: 'u-jobs', label: t('cust.nav.jobs'), icon: 'briefcase', badge: myPendingCount },
    { view: 'u-apps', label: t('cust.nav.applications'), icon: 'list' },
    { view: 'u-docs', label: t('cust.nav.documents'), icon: 'file' },
    { view: 'u-pay', label: t('cust.nav.payments'), icon: 'card' },
    { view: 'u-upgrade', label: t('cust.nav.upgrade'), icon: 'spark' },
    { view: 'u-notify', label: t('cust.nav.notifications'), icon: 'bell', badge: 2 },
    { view: 'u-support', label: t('cust.nav.support'), icon: 'chat' },
    { view: 'u-profile', label: t('cust.nav.profile'), icon: 'users' },
  ]

  const adminNav = [
    { view: 'a-dash', label: t('admin.nav.overview'), icon: 'home' },
    { view: 'a-users', label: t('admin.nav.users'), icon: 'users' },
    { view: 'a-jobnew', label: t('admin.nav.addJob'), icon: 'briefcase' },
    { view: 'a-apps', label: t('admin.nav.applications'), icon: 'list' },
    { view: 'a-qc', label: t('admin.nav.qc'), icon: 'shield', badge: qcCount },
    { view: 'a-pay', label: t('admin.nav.payments'), icon: 'card' },
    { view: 'a-staff', label: t('admin.nav.staff'), icon: 'gauge' },
    { view: 'a-notify', label: t('admin.nav.notifications'), icon: 'bell' },
    { view: 'a-export', label: t('admin.nav.export'), icon: 'download' },
  ]

  const isPublic = role === 'public'
  const isShell = role === 'user' || role === 'admin'

  const whoName = role === 'user' ? 'Nandini' : 'Dilani Jayasuriya'
  const whoRole = role === 'user' ? `Professional · ${77 - Object.values(approvals).filter(v => v === 'approved').length * 0} left` : 'Admin · Founder'
  const whoInitials = role === 'user' ? 'ND' : 'DJ'

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
      case 'signup': return (
        <SignupWizard
          step={step} consent1={consent1} consent2={consent2} draftSaved={draftSaved}
          onNext={() => setStep(s => Math.min(s + 1, 7))}
          onPrev={() => setStep(s => Math.max(s - 1, 0))}
          onSaveDraft={() => { setDraftSaved(true); flash(t('toast.draftSaved')) }}
          onFinish={() => { flash(t('toast.profileSubmitted')); nav('user', 'u-dash') }}
          onToggleC1={() => setConsent1(c => !c)}
          onToggleC2={() => setConsent2(c => !c)}
          onPrivacy={() => go('privacy')}
          onGoToStep={(i) => setStep(s => i <= s ? i : s)}
        />
      )
      default: return <Home onSignup={() => { setStep(0); nav('public', 'signup') }} onHow={() => go('how')} onPricing={() => go('pricing')} />
    }
  }

  const setViewAndClose = (v) => { setView(v); setSidebarOpen(false) }

  const renderCustomerPage = () => {
    switch (view) {
      case 'u-dash': return <CustomerDashboard approvals={approvals} onApprove={approveJob} onDecline={declineJob} onGoJobs={() => setViewAndClose('u-jobs')} onGoApps={() => setViewAndClose('u-apps')} onGoUpgrade={() => setViewAndClose('u-upgrade')} onGoProfile={() => setViewAndClose('u-profile')} onGoNotify={() => setViewAndClose('u-notify')} />
      case 'u-jobs': return <CustomerJobs approvals={approvals} onApprove={approveJob} onDecline={declineJob} />
      case 'u-apps': return <CustomerApplications approvals={approvals} />
      case 'u-docs': return <CustomerDocuments />
      case 'u-pay': return <CustomerPayments />
      case 'u-upgrade': return <CustomerUpgrade onUpgrade={() => flash(t('toast.upgradeRequested'))} />
      case 'u-notify': return <CustomerNotifications />
      case 'u-support': return <CustomerSupport onSend={() => flash(t('toast.messageSent'))} />
      case 'u-profile': return <CustomerProfile onSave={() => flash(t('toast.profileSaved'))} />
      default: return <CustomerDashboard approvals={approvals} onApprove={approveJob} onDecline={declineJob} onGoJobs={() => setViewAndClose('u-jobs')} onGoApps={() => setViewAndClose('u-apps')} onGoUpgrade={() => setViewAndClose('u-upgrade')} onGoProfile={() => setViewAndClose('u-profile')} onGoNotify={() => setViewAndClose('u-notify')} />
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

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--surface-2)', color: 'var(--on-surface)', fontFamily: 'var(--font-ui)' }}>
      <Header
        role={role}
        view={view}
        theme={theme}
        showMenuToggle={isShell}
        onToggleMenu={() => setSidebarOpen(o => !o)}
        onViewPublic={() => nav('public', 'home')}
        onViewUser={() => nav('user', 'u-dash')}
        onViewAdmin={() => nav('admin', 'a-dash')}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onGoHome={() => nav('public', 'home')}
        onGoArch={() => nav('public', 'arch')}
      />

      {isPublic && (
        <>
          <PublicNav view={view} onNav={nav} onSignup={() => { setStep(0); nav('public', 'signup') }} />
          <main>{renderPublicPage()}</main>
          {view !== 'arch' && <Footer onNav={nav} />}
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
