import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Toast from './components/Toast.jsx'
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
  const lnk = (v, label) => (
    <button
      onClick={() => onNav('public', v)}
      style={{
        padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14,
        background: 'none', fontWeight: view === v ? 600 : 400, color: view === v ? 'var(--on-surface)' : 'var(--muted)',
      }}
    >{label}</button>
  )
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', padding: '10px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 60, zIndex: 40 }}>
      {lnk('home', 'Home')}
      {lnk('how', 'How it works')}
      {lnk('pricing', 'Pricing')}
      {lnk('contact', 'Contact')}
      {lnk('privacy', 'Privacy')}
      {lnk('terms', 'Terms')}
      <span style={{ flex: 1 }} />
      <button onClick={onSignup} style={{ padding: '9px 18px', borderRadius: 9, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Start free — 2 applications</button>
    </nav>
  )
}

export default function App() {
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

  const flash = (msg) => {
    setToast(msg)
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }

  const nav = (r, v) => {
    setRole(r)
    setView(v)
    window.scrollTo(0, 0)
  }

  const approveJob = (id) => {
    setApprovals(a => ({ ...a, [id]: 'approved' }))
    flash('Job approved — sent to your ATG team')
  }
  const declineJob = (id) => {
    setApprovals(a => ({ ...a, [id]: 'declined' }))
    flash('Job skipped')
  }

  const myPendingCount = ROWS.filter(r => r.uid === MY_UID && (approvals[r.id] || r.approval) === 'pending').length
  const qcCount = ROWS.filter(r => r.status === 'qc').length

  const userNav = [
    { view: 'u-dash', label: 'Dashboard', icon: 'home' },
    { view: 'u-jobs', label: 'Recommended jobs', icon: 'briefcase', badge: myPendingCount },
    { view: 'u-apps', label: 'Applications', icon: 'list' },
    { view: 'u-docs', label: 'Documents', icon: 'file' },
    { view: 'u-pay', label: 'Payments', icon: 'card' },
    { view: 'u-upgrade', label: 'Upgrade', icon: 'spark' },
    { view: 'u-notify', label: 'Notifications', icon: 'bell', badge: 2 },
    { view: 'u-support', label: 'Support', icon: 'chat' },
    { view: 'u-profile', label: 'Profile', icon: 'users' },
  ]

  const adminNav = [
    { view: 'a-dash', label: 'Overview', icon: 'home' },
    { view: 'a-users', label: 'Users', icon: 'users' },
    { view: 'a-jobnew', label: 'Add job', icon: 'briefcase' },
    { view: 'a-apps', label: 'Applications', icon: 'list' },
    { view: 'a-qc', label: 'QC queue', icon: 'shield', badge: qcCount },
    { view: 'a-pay', label: 'Payments', icon: 'card' },
    { view: 'a-staff', label: 'Team capacity', icon: 'gauge' },
    { view: 'a-notify', label: 'Notifications', icon: 'bell' },
    { view: 'a-export', label: 'Export', icon: 'download' },
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
      case 'contact': return <Contact onSend={() => flash("Message sent — we'll reply within one working day")} />
      case 'privacy': return <Privacy />
      case 'terms': return <Terms />
      case 'arch': return <ArchitecturePage />
      case 'signup': return (
        <SignupWizard
          step={step} consent1={consent1} consent2={consent2} draftSaved={draftSaved}
          onNext={() => setStep(s => Math.min(s + 1, 7))}
          onPrev={() => setStep(s => Math.max(s - 1, 0))}
          onSaveDraft={() => { setDraftSaved(true); flash('Draft saved — you can finish later') }}
          onFinish={() => { flash('Profile submitted! 2 free applications granted.'); nav('user', 'u-dash') }}
          onToggleC1={() => setConsent1(c => !c)}
          onToggleC2={() => setConsent2(c => !c)}
          onPrivacy={() => go('privacy')}
        />
      )
      default: return <Home onSignup={() => { setStep(0); nav('public', 'signup') }} onHow={() => go('how')} onPricing={() => go('pricing')} />
    }
  }

  const renderCustomerPage = () => {
    switch (view) {
      case 'u-dash': return <CustomerDashboard approvals={approvals} onApprove={approveJob} onDecline={declineJob} onGoJobs={() => setView('u-jobs')} onGoApps={() => setView('u-apps')} onGoUpgrade={() => setView('u-upgrade')} onGoProfile={() => setView('u-profile')} onGoNotify={() => setView('u-notify')} />
      case 'u-jobs': return <CustomerJobs approvals={approvals} onApprove={approveJob} onDecline={declineJob} />
      case 'u-apps': return <CustomerApplications approvals={approvals} />
      case 'u-docs': return <CustomerDocuments />
      case 'u-pay': return <CustomerPayments />
      case 'u-upgrade': return <CustomerUpgrade onUpgrade={() => flash('Upgrade request sent — your team will contact you shortly')} />
      case 'u-notify': return <CustomerNotifications />
      case 'u-support': return <CustomerSupport onSend={() => flash('Message sent')} />
      case 'u-profile': return <CustomerProfile onSave={() => flash('Profile saved')} />
      default: return <CustomerDashboard approvals={approvals} onApprove={approveJob} onDecline={declineJob} onGoJobs={() => setView('u-jobs')} onGoApps={() => setView('u-apps')} onGoUpgrade={() => setView('u-upgrade')} onGoProfile={() => setView('u-profile')} onGoNotify={() => setView('u-notify')} />
    }
  }

  const renderAdminPage = () => {
    switch (view) {
      case 'a-dash': return <AdminDashboard onGoQC={() => setView('a-qc')} onGoPay={() => setView('a-pay')} />
      case 'a-users': return <AdminUsers onOpenUser={(id) => { setSelUser(id); setView('a-user') }} onGoExport={() => setView('a-export')} />
      case 'a-user': return <AdminUserDetail userId={selUser} onBack={() => setView('a-users')} onGoAddJob={() => setView('a-jobnew')} onToast={flash} />
      case 'a-jobnew': return <AdminAddJob userId={selUser} onSave={() => { flash('Job recommendation added'); setView('a-user') }} />
      case 'a-apps': return <AdminApplications />
      case 'a-qc': return <AdminQCQueue onToast={flash} />
      case 'a-pay': return <AdminPayments onToast={flash} />
      case 'a-staff': return <AdminStaff />
      case 'a-notify': return <AdminNotifications />
      case 'a-export': return <AdminExport onToast={flash} />
      default: return <AdminDashboard onGoQC={() => setView('a-qc')} onGoPay={() => setView('a-pay')} />
    }
  }

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--surface-2)', color: 'var(--on-surface)', fontFamily: 'var(--font-ui)' }}>
      <Header
        role={role}
        view={view}
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
        <div style={{ display: 'grid', gridTemplateColumns: '248px 1fr', minHeight: 'calc(100vh - 60px)' }}>
          <Sidebar
            role={role}
            view={view}
            onNav={(v) => setView(v)}
            userNav={userNav}
            adminNav={adminNav}
            whoName={whoName}
            whoRole={whoRole}
            whoInitials={whoInitials}
          />
          <main style={{ minWidth: 0, padding: 0 }}>
            {role === 'user' ? renderCustomerPage() : renderAdminPage()}
          </main>
        </div>
      )}

      <Toast message={toast} />
    </div>
  )
}

function Footer({ onNav }) {
  const lnk = (role, view, label) => (
    <button onClick={() => onNav(role, view)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', fontWeight: 400, fontSize: 14, cursor: 'pointer', padding: '2px 0', textAlign: 'left', fontFamily: 'inherit' }}>{label}</button>
  )
  return (
    <footer style={{ background: 'var(--primary)', color: 'var(--on-primary)', marginTop: 0 }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="rgba(255,255,255,.15)" /><path d="M18 8.5L9 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" /><path d="M18 8.5L27 27.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" /><path d="M12.5 21.5H23.5" stroke="white" strokeWidth="2.3" strokeLinecap="round" /><circle cx="18" cy="8.5" r="3" fill="#C2613B" /></svg>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17 }}>ATG Apply</span>
          </div>
          <p style={{ fontSize: 13, opacity: .75, lineHeight: 1.6, margin: 0, maxWidth: '24em' }}>Human-managed job applications. Research-led matching, prepared and submitted by a trained team.</p>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .6, marginBottom: 12 }}>Product</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lnk('public', 'how', 'How it works')}
            {lnk('public', 'pricing', 'Pricing')}
            {lnk('public', 'signup', 'Start free')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .6, marginBottom: 12 }}>Company</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lnk('public', 'contact', 'Contact')}
            {lnk('public', 'arch', 'System architecture')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', opacity: .6, marginBottom: 12 }}>Legal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {lnk('public', 'privacy', 'Privacy policy')}
            {lnk('public', 'terms', 'Terms of service')}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 24px', fontSize: 12, opacity: .6 }}>
          © 2026 ATG Concordia (Pvt) Ltd · Colombo, Sri Lanka
        </div>
      </div>
    </footer>
  )
}
