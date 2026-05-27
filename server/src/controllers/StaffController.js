const StaffService = require('../services/StaffService')

class StaffController {
  async getAll(req, res) {
    try {
      const staff = await StaffService.getAll()
      res.json({ success: true, data: staff.map(s => s.toJSON()) })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getById(req, res) {
    try {
      const member = await StaffService.getById(req.params.personId)
      res.json({ success: true, data: member.toJSON() })
    } catch (err) {
      res.status(404).json({ success: false, error: err.message })
    }
  }

  async create(req, res) {
    try {
      const { personId, level, department, hiredAt } = req.body
      const member = await StaffService.create(
        personId,
        { level, department, hiredAt },
        req.user.id
      )
      res.status(201).json({ success: true, data: member.toJSON() })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async updateLevel(req, res) {
    try {
      const { level } = req.body
      const updated = await StaffService.updateLevel(req.params.personId, level)
      res.json({ success: true, data: updated })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async update(req, res) {
    try {
      const { level, department } = req.body
      const updated = await StaffService.update(req.params.id, { level, department })
      res.json({ success: true, data: updated.toJSON() })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async remove(req, res) {
    try {
      await StaffService.remove(req.params.personId)
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new StaffController()
