const OrderService = require('../services/OrderService')
const supabase     = require('../../config/database')

class OrderController {
  async getAll(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50
      const { data, error } = await supabase
        .from('orders')
        .select('*, persons(first_name, last_name, email)')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async create(req, res) {
    try {
      const { items, lpRedeemed = 0 } = req.body
      const personId = req.user.id  // viene del middleware de auth

      const builder = OrderService.getBuilder().setCustomer(personId)

      for (const item of items) {
        if (item.itemType === 'product') {
          builder.addProduct(item.productId, item.quantity, item.unitPrice, item.sizeName)
        } else {
          builder.addTicket(item.ticketId, item.quantity, item.unitPrice)
        }
      }

      if (lpRedeemed > 0) builder.applyLoyaltyPoints(lpRedeemed)

      const orderData = builder.build()
      const order     = await OrderService.create(orderData)
      res.status(201).json({ success: true, data: order })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await OrderService.getByPerson(req.user.id)
      res.json({ success: true, data: orders })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new OrderController()
