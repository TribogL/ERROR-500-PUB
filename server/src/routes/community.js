const router   = require('express').Router()
const supabase = require('../../config/database')

router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'name y email son requeridos' })
    }
    const { data, error } = await supabase
      .from('community_subscribers')
      .insert({ name, email, phone: phone || null })
      .select()
      .single()
    if (error) return res.status(400).json({ success: false, error: error.message })
    res.status(201).json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
