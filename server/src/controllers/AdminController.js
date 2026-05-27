const AdminService = require('../services/AdminService')

class AdminController {
  async getMetrics(req, res) {
    try {
      const metrics = await AdminService.getDashboardMetrics()
      res.json({ success: true, data: metrics })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getRecentOrders(req, res) {
    try {
      const limit  = parseInt(req.query.limit) || 10
      const orders = await AdminService.getRecentOrders(limit)
      res.json({ success: true, data: orders })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getAllReservations(req, res) {
    try {
      const reservations = await AdminService.getAllReservations()
      res.json({ success: true, data: reservations })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async updateReservationStatus(req, res) {
    try {
      const { status } = req.body
      const reservation = await AdminService.updateReservationStatus(req.params.id, status)
      res.json({ success: true, data: reservation })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async runCleanup(req, res) {
    try {
      const count = await AdminService.cleanupGuestReservations()
      res.json({ success: true, data: { removed: count } })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new AdminController()
