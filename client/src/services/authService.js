import { supabase } from './supabase.js'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  async register({ firstName, lastName, email, password }) {
    console.log('Registering:', { firstName, lastName, email })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name:  lastName,
        },
      },
    })
    if (error) throw error

    // Auto-login: signUp no garantiza sesión si email confirm está habilitado
    const { data: session, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (loginError) throw loginError
    return session
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => callback(session))
  }
}
