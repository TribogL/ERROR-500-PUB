import { authService } from '../services/authService.js'
import { api }         from '../services/api.js'

const STAFF_LEVELS = ['level1', 'level2', 'level3']

export const AuthController = {
  async login(email, password, navigate) {
    await authService.login(email, password)

    await new Promise(resolve => setTimeout(resolve, 500))

    const meResponse = await api.get('/auth/me')
    const { person, staff } = meResponse.data

    const level = staff?.level || 'customer'
    localStorage.setItem('user_level', level)
    localStorage.setItem('user_id', person.id)

    if (STAFF_LEVELS.includes(level)) {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  },

  async register(email, password, firstName, lastName, navigate) {
    await authService.register({ email, password, firstName, lastName })
    localStorage.setItem('user_level', 'customer')
    navigate('/dashboard')
  },

  async logout(navigate) {
    await authService.logout()
    localStorage.removeItem('user_level')
    localStorage.removeItem('user_id')
    navigate('/')
  },

  getSession() {
    return authService.getSession()
  },

  onAuthChange(callback) {
    return authService.onAuthChange(callback)
  }
}
