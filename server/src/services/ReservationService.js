const supabase            = require('../../config/database')
const ReservationBuilder  = require('../builders/ReservationBuilder')

class ReservationService {
  getBuilder() { return new ReservationBuilder() }

  async create(reservationData) {
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        person_id:   reservationData.personId   || null,
        guest_name:  reservationData.guestName  || null,
        guest_dni:   reservationData.guestDni   || null,
        guest_phone: reservationData.guestPhone || null,
        date:        reservationData.date,
        time:        reservationData.time,
        guests:      reservationData.guests,
        section:     reservationData.section,
        note:        reservationData.note       || null,
        status:      'pending'
      })
      .select().single()
    if (error) throw error
    return data
  }

  async getAll() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
    if (error) throw error
    return data
  }

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('reservations').update({ status }).eq('id', id).select().single()
    if (error) throw error
    return data
  }
}

module.exports = new ReservationService()
