const supabase = require('../../config/database')

class TicketService {
  async getAll() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, events(name, date)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async getByEvent(eventId) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('event_id', eventId)
    if (error) throw error
    return data
  }

  async getById(id) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, events(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  async getMyTickets(personId) {
    const { data, error } = await supabase
      .from('order_items')
      .select('*, tickets(*, events(name, date)), orders!inner(person_id, status, created_at)')
      .eq('orders.person_id', personId)
      .eq('item_type', 'ticket')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async create(ticketData) {
    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async update(id, ticketData) {
    const { data, error } = await supabase
      .from('tickets')
      .update(ticketData)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

module.exports = new TicketService()
