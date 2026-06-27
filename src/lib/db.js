import { supabase } from './supabase.js'

// ── Field normalizers ────────────────────────────────────────────────────────

export function normalizeJob(row) {
  return {
    id: row.id,
    uid: row.client_id,
    staff: row.staff_id,
    company: row.company,
    title: row.title,
    loc: row.location,
    source: row.source,
    fit: row.fit_score,
    reason: row.fit_reason,
    deadline: row.deadline,
    approval: row.approval,
    status: row.status,
    proof: row.proof_type,
    proofRef: row.proof_ref,
    applied: row.applied_date,
    notesInt: row.internal_notes,
  }
}

export function normalizeClient(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    city: row.city,
    pkg: row.package_name,
    total: row.apps_total,
    used: row.apps_used,
    remaining: row.apps_remaining,
    pay: row.payment_status,
    staff: row.staff_id,
    state: row.client_state,
    role: row.profession,
    created: row.created_at ? row.created_at.slice(0, 10) : '',
  }
}

export function normalizePayment(row) {
  return {
    id: row.id,
    uid: row.client_id,
    pkg: row.package_name,
    amount: row.amount_usd,
    paid: row.paid_usd,
    cur: row.currency,
    method: row.method,
    status: row.status,
    ref: row.reference,
    date: row.payment_date,
    trail: row.payment_trail ?? [],
  }
}

export function normalizeNotif(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    unread: row.unread,
    t: timeAgo(row.created_at),
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'Yesterday' : `${d} days ago`
}

// ── Customer queries ─────────────────────────────────────────────────────────

export async function getMyJobs(clientId) {
  const { data, error } = await supabase
    .from('job_recommendations')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeJob)
}

export async function updateJobApproval(id, approval) {
  const { error } = await supabase
    .from('job_recommendations')
    .update({ approval })
    .eq('id', id)
  if (error) throw error
}

export async function getMyPayments(clientId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*, payment_trail(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizePayment)
}

export async function getMyNotifications(clientId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeNotif)
}

export async function markNotificationsRead(clientId) {
  const { error } = await supabase
    .from('notifications')
    .update({ unread: false })
    .eq('client_id', clientId)
    .eq('unread', true)
  if (error) throw error
}

export async function getSupportMessages(clientId) {
  const { data, error } = await supabase
    .from('support_messages')
    .select('*, staff(name)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function sendSupportMessage(clientId, body) {
  const { error } = await supabase
    .from('support_messages')
    .insert({ client_id: clientId, sender: 'client', body })
  if (error) throw error
}

export async function getMyProfile(clientId) {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('client_id', clientId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function upsertMyProfile(clientId, profileData) {
  const { error } = await supabase
    .from('client_profiles')
    .upsert({ client_id: clientId, ...profileData }, { onConflict: 'client_id' })
  if (error) throw error
}

export async function getMyClient(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()
  if (error) throw error
  return data ? normalizeClient(data) : null
}

export async function updateMyClient(clientId, updates) {
  const { error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId)
  if (error) throw error
}

export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('price_usd', { ascending: true })
  if (error) throw error
  return (data || []).map(row => ({
    name: row.name,
    apps: row.apps,
    price: row.price_usd,
    blurb: row.description,
    feats: row.features || [],
    cta: row.cta_label,
    hi: row.highlight,
  }))
}

export async function getScholarships({ degreeLevel, search, limit = 50 } = {}) {
  let q = supabase
    .from('scholarships')
    .select('id, title, description, source_name, source_url, country, degree_level, deadline, fully_funded')
    .order('deadline', { ascending: true })
    .limit(limit)

  if (degreeLevel && degreeLevel !== 'all') {
    q = q.eq('degree_level', degreeLevel)
  }
  if (search) {
    q = q.textSearch('search_vector', search.split(' ').join(' & '), { type: 'websearch' })
  }

  const { data, error } = await q
  if (error) throw error
  return data || []
}

// ── Admin queries ────────────────────────────────────────────────────────────

export async function getAllClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeClient)
}

export async function getClientById(id) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data ? normalizeClient(data) : null
}

export async function getJobsByClient(clientId) {
  const { data, error } = await supabase
    .from('job_recommendations')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeJob)
}

export async function getAllJobs() {
  const { data, error } = await supabase
    .from('job_recommendations')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(row => ({
    ...normalizeJob(row),
    uname: row.clients?.name || '',
  }))
}

export async function getQCJobs() {
  const { data, error } = await supabase
    .from('job_recommendations')
    .select('*, clients(name)')
    .eq('status', 'qc')
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(row => ({
    ...normalizeJob(row),
    uname: row.clients?.name || '',
  }))
}

export async function addJob(jobData) {
  const { data, error } = await supabase
    .from('job_recommendations')
    .insert(jobData)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateJob(id, updates) {
  const { error } = await supabase
    .from('job_recommendations')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function getAllPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, clients(name), payment_trail(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(row => ({
    ...normalizePayment(row),
    uname: row.clients?.name || '',
  }))
}

export async function updatePayment(id, updates) {
  const { error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function addPaymentTrail(paymentId, actor, action) {
  const { error } = await supabase
    .from('payment_trail')
    .insert({ payment_id: paymentId, actor, action })
  if (error) throw error
}

export async function getAllStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    max: row.max_load,
    load: row.current_load,
  }))
}

export async function getEmailTemplates() {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(row => ({
    id: row.id,
    key: row.key,
    trigger: row.trigger_on,
    subject: row.subject,
    body: row.body,
  }))
}

// ── Signup ───────────────────────────────────────────────────────────────────

export async function createClientRecord({ authUserId, name, email, phone, country, city, profession }) {
  const clientId = crypto.randomUUID()
  const { error } = await supabase
    .from('clients')
    .insert({
      id: clientId,
      auth_user_id: authUserId,
      name,
      email,
      phone,
      country,
      city,
      profession,
      package_name: 'Trial',
      apps_total: 2,
      apps_used: 0,
      payment_status: 'pending',
      client_state: 'new',
    })
  if (error) throw error
  return clientId
}

export async function createClientProfile(clientId, profileData) {
  const { error } = await supabase
    .from('client_profiles')
    .upsert({ client_id: clientId, ...profileData }, { onConflict: 'client_id' })
  if (error) throw error
}
