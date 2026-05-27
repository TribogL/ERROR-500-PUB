const AuthService = require('../services/AuthService')

class AuthController {
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' })
      }
      const person = await AuthService.register({ email, password, firstName, lastName })
      res.status(201).json({ success: true, data: person.toJSON() })
    } catch (err) {
      console.error('[AuthController.register]', err)
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const { user, token } = await AuthService.login({ email, password })
      res.json({ success: true, data: { user, token } })
    } catch (err) {
      res.status(401).json({ success: false, error: err.message })
    }
  }

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      await AuthService.logout(token)
      res.json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async me(req, res) {
    try {
      const { person, staff } = await AuthService.me(req.user.id)
      res.json({
        success: true,
        data: {
          person,
          staff,
          isStaff: !!staff,
          level: staff?.level || 'customer',
        }
      })
    } catch (err) {
      res.status(404).json({ success: false, error: err.message })
    }
  }
}

module.exports = new AuthController()
