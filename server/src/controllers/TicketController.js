const supabase      = require('../../config/database')
const TicketService = require('../services/TicketService')

class TicketController {
  async getAll(req, res) {
    try {
      const tickets = await TicketService.getAll()
      res.json({ success: true, data: tickets })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getByEvent(req, res) {
    try {
      const tickets = await TicketService.getByEvent(req.params.eventId)
      res.json({ success: true, data: tickets })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getById(req, res) {
    try {
      const ticket = await TicketService.getById(req.params.id)
      res.json({ success: true, data: ticket })
    } catch (err) {
      res.status(404).json({ success: false, error: err.message })
    }
  }

  async getMyTickets(req, res) {
    try {
      const { data: orders, error: oe } = await supabase
        .from('orders')
        .select('id')
        .eq('person_id', req.user.id)

      if (oe) throw oe
      if (!orders.length) return res.json({ success: true, data: [] })

      const orderIds = orders.map(o => o.id)

      const { data, error } = await supabase
        .from('order_items')
        .select('*, tickets(*, events(name, date, time, image))')
        .in('order_id', orderIds)
        .eq('item_type', 'ticket')

      if (error) throw error
      res.json({ success: true, data })
    } catch (err) {
      console.error('[TicketController.getMyTickets]', err)
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async create(req, res) {
    try {
      const ticket = await TicketService.create(req.body)
      res.status(201).json({ success: true, data: ticket })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async update(req, res) {
    try {
      const ticket = await TicketService.update(req.params.id, req.body)
      res.json({ success: true, data: ticket })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }
}

module.exports = new TicketController()
