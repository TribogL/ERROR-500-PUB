const supabase = require('../../config/database')

class AdminService {
  async getDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0]

    const [reservations, orders, persons, events, products] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true })
        .eq('date', today),
      supabase.from('orders').select('total')
        .eq('status', 'paid')
        .gte('created_at', today + 'T00:00:00.000Z'),
      supabase.from('persons').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true })
        .gte('date', today),
      supabase.from('products').select('*', { count: 'exact', head: true })
        .eq('available', true),
    ])

    const revenueToday = (orders.data || [])
      .reduce((sum, o) => sum + (o.total || 0), 0)

    const { count: pendingReservations } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    return {
      reservationsToday:   reservations.count ?? 0,
      revenueToday,
      activeUsers:         persons.count ?? 0,
      upcomingEvents:      events.count ?? 0,
      availableProducts:   products.count ?? 0,
      pendingReservations: pendingReservations ?? 0,
      pendingOrders:       pendingOrders ?? 0,
    }
  }

  async getRecentOrders(limit = 10) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), persons(first_name, last_name, email)')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  }

  async getAllReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, persons(first_name, last_name, email)')
      .order('date', { ascending: true })
    if (error) throw error
    return data
  }

  async updateReservationStatus(id, status) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async cleanupGuestReservations() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('reservations')
      .delete()
      .is('person_id', null)
      .eq('status', 'pending')
      .lt('created_at', cutoff)
      .select()
    if (error) throw error
    return data?.length ?? 0
  }
}

module.exports = new AdminService()
