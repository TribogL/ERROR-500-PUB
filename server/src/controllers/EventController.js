const EventService = require('../services/EventService')

class EventController {
  async getAll(req, res) {
    try {
      const events = await EventService.getAll()
      res.json({ success: true, data: events })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getUpcoming(req, res) {
    try {
      const events = await EventService.getUpcoming()
      res.json({ success: true, data: events })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getById(req, res) {
    try {
      const event = await EventService.getById(req.params.id)
      res.json({ success: true, data: event })
    } catch (err) {
      res.status(404).json({ success: false, error: err.message })
    }
  }

  async create(req, res) {
    try {
      const event = await EventService.create(req.body)
      res.status(201).json({ success: true, data: event })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async update(req, res) {
    try {
      const event = await EventService.update(req.params.id, req.body)
      res.json({ success: true, data: event })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async delete(req, res) {
    try {
      await EventService.delete(req.params.id)
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new EventController()
