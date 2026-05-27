const ProductService = require('../services/ProductService')

class ProductController {
  async getAll(req, res) {
    try {
      const products = await ProductService.getAll()
      res.json({ success: true, data: products.map(p => p.toJSON()) })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getById(req, res) {
    try {
      const product = await ProductService.getById(req.params.id)
      res.json({ success: true, data: product.toJSON() })
    } catch (err) {
      res.status(404).json({ success: false, error: err.message })
    }
  }

  async create(req, res) {
    try {
      const { type, product, specific } = req.body
      const created = await ProductService.create(type, product, specific)
      res.status(201).json({ success: true, data: created.toJSON() })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async delete(req, res) {
    try {
      await ProductService.delete(req.params.id)
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async toggleAvailability(req, res) {
    try {
      const newState = await ProductService.toggleAvailability(req.params.id)
      res.json({ success: true, data: { available: newState } })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new ProductController()
