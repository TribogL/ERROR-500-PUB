const supabase       = require('../../config/database')
const PersonFactory  = require('../factories/PersonFactory')

class PersonService {
  async getByEmail(email) {
    const { data, error } = await supabase
      .from('persons')
      .select('id, first_name, last_name, email')
      .ilike('email', email)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async getAll(email = null) {
    let query = supabase
      .from('persons')
      .select('*, customers(loyalty_balance, member_since)')
      .order('created_at', { ascending: false })

    if (email) {
      query = query.ilike('email', `%${email}%`)
    }

    const { data, error } = await query
    if (error) {
      console.error('[PersonService.getAll]', error)
      throw error
    }
    return data
  }

  async getById(id) {
    const { data, error } = await supabase
      .from('persons')
      .select('*, customers(*), staff(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return PersonFactory.fromDB(data, data.customers || null, data.staff || null)
  }

  async update(id, { firstName, lastName }) {
    const updates = {}
    if (firstName !== undefined) updates.first_name = firstName
    if (lastName  !== undefined) updates.last_name  = lastName

    const { data, error } = await supabase
      .from('persons')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async delete(id) {
    const { error } = await supabase.auth.admin.deleteUser(id)
    if (error) throw error
  }
}

module.exports = new PersonService()
