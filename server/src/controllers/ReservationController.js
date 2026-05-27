const ReservationService = require('../services/ReservationService')
const supabase           = require('../../config/database')

class ReservationController {
  async create(req, res) {
    try {
      const { guestName, guestDni, guestPhone, date, time, guests, section, note } = req.body
      const personId = req.user?.id || null  // null si es invitado

      const builder = ReservationService.getBuilder()
        .setDateTime(date, time)
        .setGuests(guests)
        .setSection(section)

      if (personId)   builder.setAuthUser(personId)
      else            builder.setGuest(guestName, guestDni, guestPhone)
      if (note)       builder.setNote(note)

      const reservationData = builder.build()
      const reservation     = await ReservationService.create(reservationData)
      res.status(201).json({ success: true, data: reservation })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async getAll(req, res) {
    try {
      const reservations = await ReservationService.getAll()
      res.json({ success: true, data: reservations })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getMyReservations(req, res) {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('person_id', req.user.id)
      .order('date', { ascending: false })
    if (error) return res.status(500).json({ success: false, error: error.message })
    res.json({ success: true, data })
  }

  async updateStatus(req, res) {
    try {
      const updated = await ReservationService.updateStatus(req.params.id, req.body.status)
      res.json({ success: true, data: updated })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }
}

module.exports = new ReservationController()
