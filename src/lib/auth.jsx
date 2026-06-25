import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Look up the logged-in user's role from the profiles table.
  useEffect(() => {
    const uid = session?.user?.id
    if (!supabase || !uid) {
      setRole(null)
      return
    }
    let on = true
    setRoleLoading(true)
    supabase
      .from('profiles')
      .select('role')
      .eq('id', uid)
      .single()
      .then(({ data }) => {
        if (!on) return
        setRole(data?.role ?? 'member') // default to least privilege
        setRoleLoading(false)
      })
      .catch(() => {
        if (!on) return
        setRole('member')
        setRoleLoading(false)
      })
    return () => {
      on = false
    }
  }, [session])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email: email.trim(), password })
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        role,
        roleLoading,
        isAdmin: role === 'admin',
        signIn,
        signOut,
        configured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
