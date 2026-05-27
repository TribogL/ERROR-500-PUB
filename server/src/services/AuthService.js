const supabase       = require('../../config/database')
const { createClient } = require('@supabase/supabase-js')
const PersonFactory  = require('../factories/PersonFactory')

// Anon client for credential-based auth flows
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
)

class AuthService {
  async register({ email, password, firstName, lastName }) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (authError) {
      console.error('[AuthService.register] createUser:', authError)
      throw authError
    }
    const user = authData.user

    const { data: person, error: pe } = await supabase
      .from('persons')
      .insert({ id: user.id, first_name: firstName, last_name: lastName, email })
      .select()
      .single()
    if (pe) {
      console.error('[AuthService.register] persons insert:', pe)
      throw pe
    }

    const { data: customer, error: ce } = await supabase
      .from('customers')
      .insert({ person_id: user.id })
      .select()
      .single()
    if (ce) {
      console.error('[AuthService.register] customers insert:', ce)
      throw ce
    }

    return PersonFactory.fromDB(person, customer, null)
  }

  async login({ email, password }) {
    const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password })
    if (error) throw error
    return { user: data.user, token: data.session.access_token }
  }

  async logout(token) {
    // Invalidation handled client-side; server logs it
    const { error } = await supabase.auth.admin.signOut(token)
    if (error) throw error
  }

  async me(userId) {
    const { data: person, error } = await supabase
      .from('persons')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error

    const { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('person_id', userId)
      .maybeSingle()

    const { data: staff } = await supabase
      .from('staff')
      .select('*')
      .eq('person_id', userId)
      .maybeSingle()

    return { person, customer, staff }
  }
}

module.exports = new AuthService()
