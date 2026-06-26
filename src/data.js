export const STAFF = [
  { id: 's1', name: 'Nadia Fernando', role: 'Senior Researcher', email: 'nadia@atgconcordia.com', max: 12, load: 9 },
  { id: 's2', name: 'Roshan Perera', role: 'Application Specialist', email: 'roshan@atgconcordia.com', max: 12, load: 11 },
  { id: 's3', name: 'Imran Haque', role: 'Researcher', email: 'imran@atgconcordia.com', max: 10, load: 5 },
  { id: 's4', name: 'Dilani Jayasuriya', role: 'QC Lead / Founder', email: 'dilani@atgconcordia.com', max: 8, load: 6 },
]

export const USERS = [
  { id: 'u1', name: 'Tharindu Wickramasinghe', email: 'tharindu.w@gmail.com', phone: '+94 71 555 0142', country: 'Sri Lanka', city: 'Colombo', pkg: 'Trial', total: 2, used: 0, remaining: 2, pay: 'pending', staff: 's3', state: 'new', created: '2026-06-25', role: 'UX / Product Designer' },
  { id: 'u2', name: 'Ayesha Rahman', email: 'ayesha.rahman@gmail.com', phone: '+880 1711 224 800', country: 'Bangladesh', city: 'Dhaka', pkg: 'Trial', total: 2, used: 0, remaining: 2, pay: 'pending', staff: 's1', state: 'researching', created: '2026-06-21', role: 'Marketing Coordinator' },
  { id: 'u3', name: 'Mohamed Naseer', email: 'm.naseer@gmail.com', phone: '+960 777 1820', country: 'Maldives', city: 'Malé', pkg: 'Trial', total: 2, used: 1, remaining: 1, pay: 'pending', staff: 's1', state: 'in_prep', created: '2026-06-19', role: 'Hospitality Operations' },
  { id: 'u4', name: 'Nandini', email: 'nandini@gmail.com', phone: '+94 76 401 2210', country: 'Sri Lanka', city: 'Colombo', pkg: 'Professional', total: 100, used: 23, remaining: 77, pay: 'paid', staff: 's2', state: 'active', created: '2026-05-30', role: 'Senior UX Designer' },
  { id: 'u5', name: 'Fathima Zahra', email: 'fathima.z@gmail.com', phone: '+94 77 882 3301', country: 'Sri Lanka', city: 'Galle', pkg: 'Starter', total: 50, used: 48, remaining: 2, pay: 'paid', staff: 's3', state: 'active', created: '2026-06-02', role: 'Accounts Executive' },
  { id: 'u6', name: 'Sandun Bandara', email: 'sandun.b@gmail.com', phone: '+94 71 220 9087', country: 'Sri Lanka', city: 'Kandy', pkg: 'Premium', total: 150, used: 61, remaining: 89, pay: 'partial', staff: 's2', state: 'active', created: '2026-05-18', role: 'Mechanical Engineer' },
  { id: 'u7', name: 'Kavya Menon', email: 'kavya.menon@gmail.com', phone: '+94 75 119 4420', country: 'Sri Lanka', city: 'Jaffna', pkg: 'Professional', total: 100, used: 12, remaining: 88, pay: 'partial', staff: 's1', state: 'active', created: '2026-06-10', role: 'Data Analyst' },
  { id: 'u8', name: 'Rashid Khan', email: 'rashid.khan@gmail.com', phone: '+880 1521 778 904', country: 'Bangladesh', city: 'Chittagong', pkg: 'Trial', total: 2, used: 2, remaining: 0, pay: 'pending', staff: 's3', state: 'trial_done', created: '2026-06-14', role: 'Supply Chain Officer' },
  { id: 'u9', name: 'Nilanthi Silva', email: 'nilanthi.s@gmail.com', phone: '+94 76 330 7781', country: 'Sri Lanka', city: 'Negombo', pkg: 'Starter', total: 50, used: 9, remaining: 41, pay: 'refunded', staff: 's3', state: 'active', created: '2026-06-05', role: 'HR Coordinator' },
  { id: 'u10', name: 'Amara De Silva', email: 'amara.desilva@gmail.com', phone: '+94 70 558 1290', country: 'Sri Lanka', city: 'Colombo', pkg: 'Professional', total: 100, used: 41, remaining: 59, pay: 'paid', staff: 's2', state: 'active', created: '2026-05-22', role: 'Project Manager' },
]

export const ROWS = [
  { id: 'j1', uid: 'u4', company: 'MAS Holdings', title: 'Senior UX Designer', loc: 'Colombo, LK', source: 'Company site', fit: 88, reason: 'Strong portfolio match for enterprise UX; 6y experience aligns; on-site in Colombo fits availability.', deadline: '2026-07-04', approval: 'approved', status: 'applied', staff: 's2', proof: 'email', proofRef: 'Confirmation email — careers@masholdings.com', applied: '2026-06-18', notesInt: 'Tailored CV v3 used. Cover letter referenced MAS sustainability programme.' },
  { id: 'j2', uid: 'u4', company: 'WSO2', title: 'Product Designer', loc: 'Colombo / Remote', source: 'LinkedIn', fit: 82, reason: 'Product design + design-systems experience matches. Remote option suits relocation preference.', deadline: '2026-07-09', approval: 'approved', status: 'interview', staff: 's2', proof: 'appid', proofRef: 'Application ID: WSO2-PD-20614', applied: '2026-06-15', notesInt: 'Recruiter replied 06/22 — first-round call scheduled 06/29.' },
  { id: 'j3', uid: 'u4', company: 'Sysco LABS', title: 'UI Designer', loc: 'Colombo, LK', source: 'Indeed', fit: 76, reason: 'Solid UI craft match; slightly junior to candidate level but good volume target.', deadline: '2026-07-01', approval: 'approved', status: 'applied', staff: 's2', proof: 'screenshot', proofRef: 'Screenshot of submitted application', applied: '2026-06-17', notesInt: '' },
  { id: 'j4', uid: 'u4', company: '99x', title: 'Design Lead', loc: 'Colombo, LK', source: 'Referral', fit: 64, reason: 'Leadership scope is a stretch; 6y exp slightly below the 8y ask but worth a targeted application.', deadline: '2026-07-12', approval: 'approved', status: 'drafting', staff: 's1', proof: null, proofRef: null, applied: null, notesInt: 'Need stronger leadership framing in motivation letter — flag for QC.' },
  { id: 'j5', uid: 'u4', company: 'IFS', title: 'Senior Product Designer', loc: 'Colombo, LK', source: 'Company site', fit: 91, reason: 'Excellent match — enterprise SaaS, design systems, seniority all aligned.', deadline: '2026-07-15', approval: 'approved', status: 'approved', staff: 's2', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j6', uid: 'u4', company: 'Dialog Axiata', title: 'UX Researcher', loc: 'Colombo, LK', source: 'Niche board', fit: 58, reason: 'Research-leaning role; candidate is more design than research — possible but partial skills gap.', deadline: '2026-07-08', approval: 'pending', status: null, staff: 's2', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j7', uid: 'u4', company: 'Creative Software', title: 'Visual Designer', loc: 'Kandy, LK', source: 'Indeed', fit: 44, reason: 'Below candidate seniority and location is outside primary target — not recommended.', deadline: '2026-07-06', approval: 'pending', status: null, staff: 's2', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j8', uid: 'u4', company: 'Grab', title: 'Product Designer', loc: 'Singapore', source: 'LinkedIn', fit: 47, reason: 'Great brand fit but requires SG work authorization candidate does not yet hold — low feasibility.', deadline: '2026-07-20', approval: 'pending', status: null, staff: 's2', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j9', uid: 'u6', company: 'John Keells Holdings', title: 'Mechanical Engineer', loc: 'Colombo, LK', source: 'Company site', fit: 85, reason: 'Direct discipline match, strong CAD + maintenance background.', deadline: '2026-07-05', approval: 'approved', status: 'qc', staff: 's2', proof: null, proofRef: null, applied: null, notesInt: 'Awaiting founder sign-off — first 3 apps for this user need QC gate.' },
  { id: 'j10', uid: 'u6', company: 'Brandix', title: 'Maintenance Engineer', loc: 'Ratmalana, LK', source: 'Referral', fit: 79, reason: 'Good operational fit; shift pattern matches availability.', deadline: '2026-06-28', approval: 'approved', status: 'rejected', staff: 's2', proof: 'email', proofRef: 'Rejection email received 06/24', applied: '2026-06-12', notesInt: 'Employer filled internally. Suggest similar roles at Hayleys.' },
  { id: 'j11', uid: 'u6', company: 'Hayleys', title: 'Project Engineer', loc: 'Colombo, LK', source: 'LinkedIn', fit: 81, reason: 'Strong match; project delivery experience relevant.', deadline: '2026-07-02', approval: 'approved', status: 'follow_up_needed', staff: 's2', proof: 'appid', proofRef: 'Application ID: HAY-PE-3391', applied: '2026-06-10', notesInt: 'No response in 14 days — send polite follow-up via portal.' },
  { id: 'j12', uid: 'u2', company: 'Grameenphone', title: 'Marketing Coordinator', loc: 'Dhaka, BD', source: 'Company site', fit: 84, reason: 'Telco marketing match, local role, strong fit.', deadline: '2026-07-07', approval: 'pending', status: null, staff: 's1', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j13', uid: 'u2', company: 'Unilever Bangladesh', title: 'Brand Executive', loc: 'Dhaka, BD', source: 'LinkedIn', fit: 72, reason: 'FMCG brand exposure is partial but trajectory fits.', deadline: '2026-07-11', approval: 'pending', status: null, staff: 's1', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j14', uid: 'u3', company: 'Universal Resorts', title: 'Resort Operations Supervisor', loc: 'Malé, MV', source: 'Niche board', fit: 80, reason: 'Hospitality operations direct match; island-resort experience valued.', deadline: '2026-07-03', approval: 'approved', status: 'drafting', staff: 's1', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j15', uid: 'u5', company: 'Hemas Holdings', title: 'Accounts Executive', loc: 'Colombo, LK', source: 'Indeed', fit: 77, reason: 'Accounting background matches; commutable.', deadline: '2026-07-09', approval: 'approved', status: 'applied', staff: 's3', proof: 'email', proofRef: 'Confirmation email — hr@hemas.com', applied: '2026-06-20', notesInt: '' },
  { id: 'j16', uid: 'u7', company: 'LSEG (Sri Lanka)', title: 'Data Analyst', loc: 'Colombo, LK', source: 'Company site', fit: 86, reason: 'SQL + Python + finance-data match is excellent.', deadline: '2026-07-14', approval: 'approved', status: 'applied', staff: 's1', proof: 'appid', proofRef: 'Application ID: LSEG-DA-7741', applied: '2026-06-22', notesInt: '' },
  { id: 'j17', uid: 'u10', company: 'IFS', title: 'Project Manager', loc: 'Colombo, LK', source: 'Referral', fit: 83, reason: 'PMP + delivery scope aligned.', deadline: '2026-07-16', approval: 'approved', status: 'applied', staff: 's2', proof: 'email', proofRef: 'Confirmation email — talent@ifs.com', applied: '2026-06-23', notesInt: '' },
  { id: 'j18', uid: 'u10', company: 'Virtusa', title: 'Delivery Manager', loc: 'Colombo, LK', source: 'LinkedIn', fit: 69, reason: 'Delivery management partial match; larger team scope.', deadline: '2026-07-18', approval: 'approved', status: 'drafting', staff: 's2', proof: null, proofRef: null, applied: null, notesInt: '' },
  { id: 'j19', uid: 'u8', company: 'Maersk Bangladesh', title: 'Supply Chain Officer', loc: 'Chittagong, BD', source: 'Company site', fit: 82, reason: 'Port-city logistics match, strong fit.', deadline: '2026-06-27', approval: 'approved', status: 'applied', staff: 's3', proof: 'screenshot', proofRef: 'Screenshot of submitted application', applied: '2026-06-16', notesInt: '' },
  { id: 'j20', uid: 'u8', company: 'BRAC', title: 'Logistics Coordinator', loc: 'Dhaka, BD', source: 'Niche board', fit: 74, reason: 'NGO logistics; relocation to Dhaka required.', deadline: '2026-06-26', approval: 'approved', status: 'applied', staff: 's3', proof: 'email', proofRef: 'Confirmation email — careers@brac.net', applied: '2026-06-17', notesInt: '' },
]

export const PAYMENTS = [
  { id: 'p1', uid: 'u4', pkg: 'Professional', amount: 100, paid: 100, cur: 'USD', method: 'Wise', status: 'paid', ref: 'WISE-8841-204', date: '2026-05-30', trail: [{ a: 'Nandini', act: 'Submitted bank transfer', t: '2026-05-30 09:12' }, { a: 'Dilani Jayasuriya', act: 'Marked Paid (full)', t: '2026-05-30 14:40' }] },
  { id: 'p2', uid: 'u6', pkg: 'Premium', amount: 150, paid: 75, cur: 'USD', method: 'Bank transfer', status: 'partial', ref: 'BOC-22190', date: '2026-05-18', trail: [{ a: 'Sandun Bandara', act: 'Sent first instalment', t: '2026-05-18 11:02' }, { a: 'Dilani Jayasuriya', act: 'Marked Partially Paid (75 of 150)', t: '2026-05-19 10:25' }] },
  { id: 'p3', uid: 'u7', pkg: 'Professional', amount: 100, paid: 50, cur: 'USD', method: 'Wise', status: 'partial', ref: 'WISE-9120-771', date: '2026-06-10', trail: [{ a: 'Kavya Menon', act: 'Sent 50% deposit', t: '2026-06-10 16:30' }, { a: 'Imran Haque', act: 'Marked Partially Paid (50 of 100)', t: '2026-06-11 09:05' }] },
  { id: 'p4', uid: 'u9', pkg: 'Starter', amount: 60, paid: 0, cur: 'USD', method: 'Wise', status: 'refunded', ref: 'WISE-7740-118', date: '2026-06-05', trail: [{ a: 'Nilanthi Silva', act: 'Paid in full', t: '2026-06-05 13:20' }, { a: 'Nilanthi Silva', act: 'Requested refund (changed plans)', t: '2026-06-12 08:40' }, { a: 'Dilani Jayasuriya', act: 'Approved & marked Refunded', t: '2026-06-13 15:10' }] },
  { id: 'p5', uid: 'u5', pkg: 'Starter', amount: 60, paid: 60, cur: 'USD', method: 'Bank transfer', status: 'paid', ref: 'COM-44021', date: '2026-06-02', trail: [{ a: 'Fathima Zahra', act: 'Bank transfer', t: '2026-06-02 10:00' }, { a: 'Dilani Jayasuriya', act: 'Marked Paid (full)', t: '2026-06-02 17:30' }] },
  { id: 'p6', uid: 'u10', pkg: 'Professional', amount: 100, paid: 100, cur: 'USD', method: 'Wise', status: 'paid', ref: 'WISE-6610-905', date: '2026-05-22', trail: [{ a: 'Amara De Silva', act: 'Wise transfer', t: '2026-05-22 12:15' }, { a: 'Dilani Jayasuriya', act: 'Marked Paid (full)', t: '2026-05-22 18:02' }] },
  { id: 'p7', uid: 'u8', pkg: 'Trial → Starter (pending)', amount: 60, paid: 0, cur: 'USD', method: '—', status: 'pending', ref: '—', date: '2026-06-24', trail: [{ a: 'System', act: 'Upgrade quote sent after trial completion', t: '2026-06-24 09:00' }] },
  { id: 'p8', uid: 'u1', pkg: 'Trial', amount: 0, paid: 0, cur: 'USD', method: '—', status: 'pending', ref: '—', date: '2026-06-25', trail: [{ a: 'System', act: 'Free trial granted (no payment due)', t: '2026-06-25 10:30' }] },
]

export const NOTIF = [
  { id: 'n1', type: 'interview', title: 'Interview invitation — WSO2', body: 'WSO2 replied to your Product Designer application. First-round call scheduled for 29 Jun.', t: '2 hours ago', unread: true },
  { id: 'n2', type: 'applied', title: 'Application submitted — MAS Holdings', body: 'Your Senior UX Designer application was submitted. Confirmation email logged as proof.', t: 'Yesterday', unread: true },
  { id: 'n3', type: 'job', title: '3 new jobs recommended', body: 'Your ATG researcher added Dialog Axiata, Creative Software and Grab for your review.', t: '2 days ago', unread: false },
  { id: 'n4', type: 'drafting', title: 'Preparing your 99x application', body: 'Roshan is tailoring your CV and motivation letter for the Design Lead role.', t: '3 days ago', unread: false },
  { id: 'n5', type: 'reply', title: 'Support replied to your message', body: '"Happy to help — your IFS application is queued and will be prepared this week."', t: '4 days ago', unread: false },
  { id: 'n6', type: 'paid', title: 'Payment confirmed — Professional package', body: 'We received your USD 100 payment. 100 applications added to your balance.', t: '27 May', unread: false },
]

export const TEMPLATES = [
  { id: 't1', key: 'Trial granted', trigger: 'On intake completion', subject: 'Welcome to ATG Apply — your 2 free applications are ready', body: 'Hi {first_name}, your profile is in. Your personal ATG team is now researching roles that fit you. We will add your first recommended jobs within {sla} working days. You can review and approve each one before we apply.' },
  { id: 't2', key: 'Job recommended', trigger: 'On job added by staff', subject: 'New job matched for you — {job_title} at {company}', body: 'Hi {first_name}, we found a {fit_tier}-fit role: {job_title} at {company} ({location}). Fit score {fit_score}%. Open your dashboard to approve or skip it.' },
  { id: 't3', key: 'Application submitted', trigger: 'On status → Applied', subject: 'Applied: {job_title} at {company}', body: 'Hi {first_name}, your application for {job_title} at {company} has been submitted by our team. Proof of submission ({proof_type}) is saved in your dashboard. {remaining} applications remaining.' },
  { id: 't4', key: 'Upgrade prompt', trigger: 'On trial used up / balance low', subject: 'You are out of applications — keep the momentum going', body: 'Hi {first_name}, you have used all your applications. Pick a package to continue: Starter (50 / $60), Professional (100 / $100) or Premium (150 / $150). Your profile and history stay exactly as they are.' },
  { id: 't5', key: 'Support reply', trigger: 'On staff reply in Support', subject: 'Re: your message to ATG Apply', body: 'Hi {first_name}, {agent_name} here. {reply_body} — reply any time and a real person will get back to you within one working day.' },
]

export const PRICING = [
  { name: 'Trial', apps: 2, price: 0, unit: 'Free', blurb: 'Prove the quality before you pay a cent.', feats: ['2 full applications, fully managed', 'Profile research + fit scoring', 'Tailored CV + motivation letter', 'Proof of every submission'], cta: 'Start free', hi: false },
  { name: 'Starter', apps: 50, price: 60, unit: 'USD', blurb: 'For students and early-stage jobseekers.', feats: ['50 managed applications', 'Everything in Trial', 'Application tracker + documents', 'Email + WhatsApp updates'], cta: 'Choose Starter', hi: false },
  { name: 'Professional', apps: 100, price: 100, unit: 'USD', blurb: 'Best balance of value and volume.', feats: ['100 managed applications', 'Priority research turnaround', 'Interview follow-up tracking', 'Multi-country targeting'], cta: 'Choose Professional', hi: true },
  { name: 'Premium', apps: 150, price: 150, unit: 'USD', blurb: 'For serious, multi-location job hunts.', feats: ['150 managed applications', 'Fastest turnaround', 'Dedicated specialist', 'Roles across multiple countries'], cta: 'Choose Premium', hi: false },
]

export const WSTEPS = ['Personal', 'Work authorization', 'Education', 'Experience', 'Target roles', 'Skills & languages', 'Documents', 'Consent']

export const ST = {
  pending_review: { l: 'Pending review', c: '#5F6B68', b: '#ECEAE3', i: 'clock' },
  approved: { l: 'Approved', c: '#0F5C4E', b: '#E1EFE9', i: 'check' },
  drafting: { l: 'Drafting', c: '#1E4E8C', b: '#E4ECF7', i: 'pen' },
  qc: { l: 'In QC', c: '#8A6100', b: '#FBF0D9', i: 'shield' },
  applied: { l: 'Applied', c: '#1F7A4D', b: '#E3F3E8', i: 'send' },
  interview: { l: 'Interview', c: '#6B3FA0', b: '#EFE8F8', i: 'star' },
  rejected: { l: 'Rejected', c: '#B23A2E', b: '#F7E5E2', i: 'x' },
  follow_up_needed: { l: 'Follow-up needed', c: '#A85A1E', b: '#FAEBDD', i: 'bell' },
}

export const PAY_META = {
  pending: { l: 'Pending', c: '#8A6100', b: '#FBF0D9' },
  paid: { l: 'Paid', c: '#1F7A4D', b: '#E3F3E8' },
  partial: { l: 'Partially paid', c: '#1E4E8C', b: '#E4ECF7' },
  refunded: { l: 'Refunded', c: '#B23A2E', b: '#F7E5E2' },
}

export const PROOF_LABELS = {
  email: 'Confirmation email',
  appid: 'Application ID',
  screenshot: 'Screenshot',
  note: 'Internal note',
}

export function fitMeta(score) {
  if (score >= 80) return { tier: 'High', c: '#1F7A4D', b: '#E3F3E8' }
  if (score >= 50) return { tier: 'Medium', c: '#8A6100', b: '#FBF0D9' }
  return { tier: 'Low', c: '#6B6F6B', b: '#ECEAE3' }
}

export function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m - 1]
  return `${+day} ${mo} ${y}`
}

export function initials(name) {
  return (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function staffName(staffId) {
  const s = STAFF.find(x => x.id === staffId)
  return s ? s.name : 'Unassigned'
}

export function userById(id) {
  return USERS.find(u => u.id === id)
}
