-- ATG Apply — Seed Data
-- Mirrors the mock data in src/data.js exactly.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.
-- =====================================================================

-- ── Packages ──────────────────────────────────────────────────────────
insert into public.packages (name, apps, price_usd, description, features, highlight, cta_label) values
  ('Trial',        2,   0,   'Prove the quality before you pay a cent.',
   array['2 full applications, fully managed','Profile research + fit scoring','Tailored CV + motivation letter','Proof of every submission'],
   false, 'Start free'),
  ('Starter',     50,  60,   'For students and early-stage jobseekers.',
   array['50 managed applications','Everything in Trial','Application tracker + documents','Email + WhatsApp updates'],
   false, 'Choose Starter'),
  ('Professional',100, 100,  'Best balance of value and volume.',
   array['100 managed applications','Priority research turnaround','Interview follow-up tracking','Multi-country targeting'],
   true,  'Choose Professional'),
  ('Premium',     150, 150,  'For serious, multi-location job hunts.',
   array['150 managed applications','Fastest turnaround','Dedicated specialist','Roles across multiple countries'],
   false, 'Choose Premium')
on conflict (name) do nothing;

-- ── Staff ─────────────────────────────────────────────────────────────
insert into public.staff (id, name, role, email, max_load, current_load) values
  ('s1', 'Nadia Fernando',     'Senior Researcher',    'nadia@atgconcordia.com',   12, 9),
  ('s2', 'Roshan Perera',      'Application Specialist','roshan@atgconcordia.com', 12, 11),
  ('s3', 'Imran Haque',        'Researcher',            'imran@atgconcordia.com',  10, 5),
  ('s4', 'Dilani Jayasuriya',  'QC Lead / Founder',     'dilani@atgconcordia.com',  8, 6)
on conflict (id) do nothing;

-- ── Clients ───────────────────────────────────────────────────────────
insert into public.clients
  (id, name, email, phone, country, city, package_name, apps_total, apps_used,
   payment_status, staff_id, client_state, profession, created_at) values
  ('u1',  'Tharindu Wickramasinghe', 'tharindu.w@gmail.com',   '+94 71 555 0142',  'Sri Lanka',  'Colombo',     'Trial',        2,   0, 'pending', 's3', 'new',        'UX / Product Designer',    '2026-06-25'),
  ('u2',  'Ayesha Rahman',           'ayesha.rahman@gmail.com','+880 1711 224 800','Bangladesh', 'Dhaka',       'Trial',        2,   0, 'pending', 's1', 'researching','Marketing Coordinator',     '2026-06-21'),
  ('u3',  'Mohamed Naseer',          'm.naseer@gmail.com',     '+960 777 1820',    'Maldives',   'Malé',        'Trial',        2,   1, 'pending', 's1', 'in_prep',    'Hospitality Operations',    '2026-06-19'),
  ('u4',  'Nandini',                 'nandini@gmail.com',      '+94 76 401 2210',  'Sri Lanka',  'Colombo',     'Professional',100, 23, 'paid',    's2', 'active',     'Senior UX Designer',        '2026-05-30'),
  ('u5',  'Fathima Zahra',           'fathima.z@gmail.com',    '+94 77 882 3301',  'Sri Lanka',  'Galle',       'Starter',     50,  48, 'paid',    's3', 'active',     'Accounts Executive',        '2026-06-02'),
  ('u6',  'Sandun Bandara',          'sandun.b@gmail.com',     '+94 71 220 9087',  'Sri Lanka',  'Kandy',       'Premium',    150,  61, 'partial', 's2', 'active',     'Mechanical Engineer',       '2026-05-18'),
  ('u7',  'Kavya Menon',             'kavya.menon@gmail.com',  '+94 75 119 4420',  'Sri Lanka',  'Jaffna',      'Professional',100, 12, 'partial', 's1', 'active',     'Data Analyst',              '2026-06-10'),
  ('u8',  'Rashid Khan',             'rashid.khan@gmail.com',  '+880 1521 778 904','Bangladesh', 'Chittagong',  'Trial',        2,   2, 'pending', 's3', 'trial_done', 'Supply Chain Officer',      '2026-06-14'),
  ('u9',  'Nilanthi Silva',          'nilanthi.s@gmail.com',   '+94 76 330 7781',  'Sri Lanka',  'Negombo',     'Starter',     50,   9, 'refunded','s3', 'active',     'HR Coordinator',            '2026-06-05'),
  ('u10', 'Amara De Silva',          'amara.desilva@gmail.com','+94 70 558 1290',  'Sri Lanka',  'Colombo',     'Professional',100, 41, 'paid',    's2', 'active',     'Project Manager',           '2026-05-22')
on conflict (id) do nothing;

-- ── Job Recommendations ───────────────────────────────────────────────
insert into public.job_recommendations
  (id, client_id, staff_id, company, title, location, source, fit_score, fit_reason,
   deadline, approval, status, proof_type, proof_ref, applied_date, internal_notes, created_at) values
  ('j1',  'u4', 's2', 'MAS Holdings',      'Senior UX Designer',          'Colombo, LK',    'Company site', 88, 'Strong portfolio match for enterprise UX; 6y experience aligns; on-site in Colombo fits availability.',       '2026-07-04', 'approved', 'applied',           'email',      'Confirmation email — careers@masholdings.com',   '2026-06-18', 'Tailored CV v3 used. Cover letter referenced MAS sustainability programme.', '2026-06-01'),
  ('j2',  'u4', 's2', 'WSO2',              'Product Designer',             'Colombo / Remote','LinkedIn',     82, 'Product design + design-systems experience matches. Remote option suits relocation preference.',              '2026-07-09', 'approved', 'interview',         'appid',      'Application ID: WSO2-PD-20614',                  '2026-06-15', 'Recruiter replied 06/22 — first-round call scheduled 06/29.', '2026-06-05'),
  ('j3',  'u4', 's2', 'Sysco LABS',        'UI Designer',                  'Colombo, LK',    'Indeed',       76, 'Solid UI craft match; slightly junior to candidate level but good volume target.',                           '2026-07-01', 'approved', 'applied',           'screenshot', 'Screenshot of submitted application',            '2026-06-17', '', '2026-06-05'),
  ('j4',  'u4', 's1', '99x',               'Design Lead',                  'Colombo, LK',    'Referral',     64, 'Leadership scope is a stretch; 6y exp slightly below the 8y ask but worth a targeted application.',          '2026-07-12', 'approved', 'drafting',          null,         null,                                             null,         'Need stronger leadership framing in motivation letter — flag for QC.', '2026-06-08'),
  ('j5',  'u4', 's2', 'IFS',               'Senior Product Designer',      'Colombo, LK',    'Company site', 91, 'Excellent match — enterprise SaaS, design systems, seniority all aligned.',                                  '2026-07-15', 'approved', 'approved',          null,         null,                                             null,         '', '2026-06-10'),
  ('j6',  'u4', 's2', 'Dialog Axiata',     'UX Researcher',                'Colombo, LK',    'Niche board',  58, 'Research-leaning role; candidate is more design than research — possible but partial skills gap.',           '2026-07-08', 'pending',  null,                null,         null,                                             null,         '', '2026-06-12'),
  ('j7',  'u4', 's2', 'Creative Software', 'Visual Designer',              'Kandy, LK',      'Indeed',       44, 'Below candidate seniority and location is outside primary target — not recommended.',                       '2026-07-06', 'pending',  null,                null,         null,                                             null,         '', '2026-06-12'),
  ('j8',  'u4', 's2', 'Grab',              'Product Designer',             'Singapore',      'LinkedIn',     47, 'Great brand fit but requires SG work authorization candidate does not yet hold — low feasibility.',          '2026-07-20', 'pending',  null,                null,         null,                                             null,         '', '2026-06-13'),
  ('j9',  'u6', 's2', 'John Keells Holdings','Mechanical Engineer',        'Colombo, LK',    'Company site', 85, 'Direct discipline match, strong CAD + maintenance background.',                                              '2026-07-05', 'approved', 'qc',                null,         null,                                             null,         'Awaiting founder sign-off — first 3 apps for this user need QC gate.', '2026-06-14'),
  ('j10', 'u6', 's2', 'Brandix',           'Maintenance Engineer',         'Ratmalana, LK',  'Referral',     79, 'Good operational fit; shift pattern matches availability.',                                                  '2026-06-28', 'approved', 'rejected',          'email',      'Rejection email received 06/24',                 '2026-06-12', 'Employer filled internally. Suggest similar roles at Hayleys.', '2026-06-05'),
  ('j11', 'u6', 's2', 'Hayleys',           'Project Engineer',             'Colombo, LK',    'LinkedIn',     81, 'Strong match; project delivery experience relevant.',                                                       '2026-07-02', 'approved', 'follow_up_needed',  'appid',      'Application ID: HAY-PE-3391',                    '2026-06-10', 'No response in 14 days — send polite follow-up via portal.', '2026-06-07'),
  ('j12', 'u2', 's1', 'Grameenphone',      'Marketing Coordinator',        'Dhaka, BD',      'Company site', 84, 'Telco marketing match, local role, strong fit.',                                                            '2026-07-07', 'pending',  null,                null,         null,                                             null,         '', '2026-06-20'),
  ('j13', 'u2', 's1', 'Unilever Bangladesh','Brand Executive',             'Dhaka, BD',      'LinkedIn',     72, 'FMCG brand exposure is partial but trajectory fits.',                                                       '2026-07-11', 'pending',  null,                null,         null,                                             null,         '', '2026-06-20'),
  ('j14', 'u3', 's1', 'Universal Resorts', 'Resort Operations Supervisor', 'Malé, MV',       'Niche board',  80, 'Hospitality operations direct match; island-resort experience valued.',                                      '2026-07-03', 'approved', 'drafting',          null,         null,                                             null,         '', '2026-06-18'),
  ('j15', 'u5', 's3', 'Hemas Holdings',    'Accounts Executive',           'Colombo, LK',    'Indeed',       77, 'Accounting background matches; commutable.',                                                                '2026-07-09', 'approved', 'applied',           'email',      'Confirmation email — hr@hemas.com',              '2026-06-20', '', '2026-06-12'),
  ('j16', 'u7', 's1', 'LSEG (Sri Lanka)',  'Data Analyst',                 'Colombo, LK',    'Company site', 86, 'SQL + Python + finance-data match is excellent.',                                                           '2026-07-14', 'approved', 'applied',           'appid',      'Application ID: LSEG-DA-7741',                   '2026-06-22', '', '2026-06-14'),
  ('j17', 'u10','s2', 'IFS',               'Project Manager',              'Colombo, LK',    'Referral',     83, 'PMP + delivery scope aligned.',                                                                             '2026-07-16', 'approved', 'applied',           'email',      'Confirmation email — talent@ifs.com',            '2026-06-23', '', '2026-06-15'),
  ('j18', 'u10','s2', 'Virtusa',           'Delivery Manager',             'Colombo, LK',    'LinkedIn',     69, 'Delivery management partial match; larger team scope.',                                                     '2026-07-18', 'approved', 'drafting',          null,         null,                                             null,         '', '2026-06-18'),
  ('j19', 'u8', 's3', 'Maersk Bangladesh', 'Supply Chain Officer',         'Chittagong, BD', 'Company site', 82, 'Port-city logistics match, strong fit.',                                                                    '2026-06-27', 'approved', 'applied',           'screenshot', 'Screenshot of submitted application',            '2026-06-16', '', '2026-06-10'),
  ('j20', 'u8', 's3', 'BRAC',              'Logistics Coordinator',        'Dhaka, BD',      'Niche board',  74, 'NGO logistics; relocation to Dhaka required.',                                                              '2026-06-26', 'approved', 'applied',           'email',      'Confirmation email — careers@brac.net',           '2026-06-17', '', '2026-06-10')
on conflict (id) do nothing;

-- ── Payments ──────────────────────────────────────────────────────────
insert into public.payments
  (id, client_id, package_name, amount_usd, paid_usd, currency, method, status, reference, payment_date) values
  ('p1', 'u4',  'Professional',           100, 100, 'USD', 'Wise',          'paid',    'WISE-8841-204', '2026-05-30'),
  ('p2', 'u6',  'Premium',                150,  75, 'USD', 'Bank transfer', 'partial', 'BOC-22190',     '2026-05-18'),
  ('p3', 'u7',  'Professional',           100,  50, 'USD', 'Wise',          'partial', 'WISE-9120-771', '2026-06-10'),
  ('p4', 'u9',  'Starter',                 60,   0, 'USD', 'Wise',          'refunded','WISE-7740-118', '2026-06-05'),
  ('p5', 'u5',  'Starter',                 60,  60, 'USD', 'Bank transfer', 'paid',    'COM-44021',     '2026-06-02'),
  ('p6', 'u10', 'Professional',           100, 100, 'USD', 'Wise',          'paid',    'WISE-6610-905', '2026-05-22'),
  ('p7', 'u8',  'Trial → Starter (pending)', 60, 0, 'USD', '—',            'pending', '—',             '2026-06-24'),
  ('p8', 'u1',  'Trial',                    0,  0, 'USD', '—',             'pending', '—',             '2026-06-25')
on conflict (id) do nothing;

-- ── Payment trail ─────────────────────────────────────────────────────
insert into public.payment_trail (payment_id, actor, action, created_at) values
  ('p1', 'Nandini',          'Submitted bank transfer',               '2026-05-30 09:12'),
  ('p1', 'Dilani Jayasuriya','Marked Paid (full)',                     '2026-05-30 14:40'),
  ('p2', 'Sandun Bandara',   'Sent first instalment',                  '2026-05-18 11:02'),
  ('p2', 'Dilani Jayasuriya','Marked Partially Paid (75 of 150)',      '2026-05-19 10:25'),
  ('p3', 'Kavya Menon',      'Sent 50% deposit',                      '2026-06-10 16:30'),
  ('p3', 'Imran Haque',      'Marked Partially Paid (50 of 100)',      '2026-06-11 09:05'),
  ('p4', 'Nilanthi Silva',   'Paid in full',                          '2026-06-05 13:20'),
  ('p4', 'Nilanthi Silva',   'Requested refund (changed plans)',       '2026-06-12 08:40'),
  ('p4', 'Dilani Jayasuriya','Approved & marked Refunded',             '2026-06-13 15:10'),
  ('p5', 'Fathima Zahra',    'Bank transfer',                         '2026-06-02 10:00'),
  ('p5', 'Dilani Jayasuriya','Marked Paid (full)',                     '2026-06-02 17:30'),
  ('p6', 'Amara De Silva',   'Wise transfer',                         '2026-05-22 12:15'),
  ('p6', 'Dilani Jayasuriya','Marked Paid (full)',                     '2026-05-22 18:02'),
  ('p7', 'System',           'Upgrade quote sent after trial completion','2026-06-24 09:00'),
  ('p8', 'System',           'Free trial granted (no payment due)',    '2026-06-25 10:30');

-- ── Notifications ─────────────────────────────────────────────────────
insert into public.notifications (id, client_id, type, title, body, unread, created_at) values
  ('n1', 'u4', 'interview', 'Interview invitation — WSO2',              'WSO2 replied to your Product Designer application. First-round call scheduled for 29 Jun.',                         true,  now() - interval '2 hours'),
  ('n2', 'u4', 'applied',   'Application submitted — MAS Holdings',     'Your Senior UX Designer application was submitted. Confirmation email logged as proof.',                            true,  now() - interval '1 day'),
  ('n3', 'u4', 'job',       '3 new jobs recommended',                   'Your ATG researcher added Dialog Axiata, Creative Software and Grab for your review.',                              false, now() - interval '2 days'),
  ('n4', 'u4', 'drafting',  'Preparing your 99x application',           'Roshan is tailoring your CV and motivation letter for the Design Lead role.',                                       false, now() - interval '3 days'),
  ('n5', 'u4', 'reply',     'Support replied to your message',          '"Happy to help — your IFS application is queued and will be prepared this week."',                                  false, now() - interval '4 days'),
  ('n6', 'u4', 'paid',      'Payment confirmed — Professional package', 'We received your USD 100 payment. 100 applications added to your balance.',                                         false, now() - interval '28 days')
on conflict (id) do nothing;

-- ── Email templates ───────────────────────────────────────────────────
insert into public.email_templates (id, key, trigger_on, subject, body) values
  ('t1', 'Trial granted',        'On intake completion',              'Welcome to ATG Apply — your 2 free applications are ready',
   'Hi {first_name}, your profile is in. Your personal ATG team is now researching roles that fit you. We will add your first recommended jobs within {sla} working days. You can review and approve each one before we apply.'),
  ('t2', 'Job recommended',      'On job added by staff',             'New job matched for you — {job_title} at {company}',
   'Hi {first_name}, we found a {fit_tier}-fit role: {job_title} at {company} ({location}). Fit score {fit_score}%. Open your dashboard to approve or skip it.'),
  ('t3', 'Application submitted','On status → Applied',               'Applied: {job_title} at {company}',
   'Hi {first_name}, your application for {job_title} at {company} has been submitted by our team. Proof of submission ({proof_type}) is saved in your dashboard. {remaining} applications remaining.'),
  ('t4', 'Upgrade prompt',       'On trial used up / balance low',    'You are out of applications — keep the momentum going',
   'Hi {first_name}, you have used all your applications. Pick a package to continue: Starter (50 / $60), Professional (100 / $100) or Premium (150 / $150). Your profile and history stay exactly as they are.'),
  ('t5', 'Support reply',        'On staff reply in Support',         'Re: your message to ATG Apply',
   'Hi {first_name}, {agent_name} here. {reply_body} — reply any time and a real person will get back to you within one working day.')
on conflict (id) do nothing;
