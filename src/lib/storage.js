import { supabase } from './supabase.js'

const BUCKET = 'client-documents'

export async function uploadDocument(clientId, file, docType) {
  const ext = file.name.split('.').pop()
  const path = `${clientId}/${docType}-${Date.now()}.${ext}`
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true })
  if (error) throw error
  return data.path
}

export function getDocumentUrl(path) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function listDocuments(clientId) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(clientId, { sortBy: { column: 'created_at', order: 'desc' } })
  if (error) throw error
  return (data || []).map(f => ({
    name: f.name,
    path: `${clientId}/${f.name}`,
    size: f.metadata?.size,
    createdAt: f.created_at,
    url: getDocumentUrl(`${clientId}/${f.name}`),
  }))
}

export async function deleteDocument(path) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
