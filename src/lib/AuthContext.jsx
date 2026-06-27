import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) resolveProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) resolveProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function resolveProfile(uid) {
    setLoading(true)
    // Check staff first
    const { data: staffRow } = await supabase
      .from('staff')
      .select('id, name, role')
      .eq('auth_user_id', uid)
      .maybeSingle()

    if (staffRow) {
      setProfile({ role: 'admin', id: staffRow.id, name: staffRow.name, staffRole: staffRow.role })
      setLoading(false)
      return
    }

    // Check client
    const { data: clientRow } = await supabase
      .from('clients')
      .select('id, name, package_name, apps_remaining, profession')
      .eq('auth_user_id', uid)
      .maybeSingle()

    if (clientRow) {
      setProfile({
        role: 'user',
        id: clientRow.id,
        name: clientRow.name,
        packageName: clientRow.package_name,
        appsRemaining: clientRow.apps_remaining,
        profession: clientRow.profession,
      })
    }
    setLoading(false)
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  const signUp = (email, password, options = {}) =>
    supabase.auth.signUp({ email, password, options })

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signOut, signUp, resolveProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
