const supabase = require('../../config/database')

class EventService {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (error) throw error
    return data
  }

  async getById(id) {
    const { data, error } = await supabase
      .from('events')
      .select('*, tickets(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async update(id, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  async getUpcoming() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
    if (error) throw error
    return data
  }
}

module.exports = new EventService()
