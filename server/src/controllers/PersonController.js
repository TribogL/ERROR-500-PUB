const supabase      = require('../../config/database')
const PersonService = require('../services/PersonService')

class PersonController {
  async getMe(req, res) {
    try {
      const { data, error } = await supabase
        .from('persons')
        .select('*, customers(loyalty_balance, member_since)')
        .eq('id', req.user.id)
        .single()
      if (error) throw error
      res.json({ success: true, data })
    } catch (err) {
      console.error('[PersonController.getMe]', err)
      res.status(404).json({ success: false, error: err.message })
    }
  }

  async getAll(req, res) {
    try {
      const email = req.query.email || null
      const persons = await PersonService.getAll(email)
      res.json({ success: true, data: persons })
    } catch (err) {
      console.error('[PersonController.getAll]', err)
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getById(req, res) {
    try {
      const person = await PersonService.getById(req.params.id)
      res.json({ success: true, data: person.toJSON() })
    } catch (err) {
      res.status(404).json({ success: false, error: err.message })
    }
  }

  async updateMe(req, res) {
    try {
      const { firstName, lastName } = req.body
      const updated = await PersonService.update(req.user.id, { firstName, lastName })
      res.json({ success: true, data: updated })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async update(req, res) {
    console.log('[PersonController.update]', req.params.id, req.body)
    try {
      const { first_name, last_name } = req.body
      const { data, error } = await supabase
        .from('persons')
        .update({ first_name, last_name })
        .eq('id', req.params.id)
        .select()
        .single()
      if (error) throw error
      res.json({ success: true, data })
    } catch (err) {
      console.error('[PersonController.update]', err)
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async delete(req, res) {
    try {
      await PersonService.delete(req.params.id)
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new PersonController()
