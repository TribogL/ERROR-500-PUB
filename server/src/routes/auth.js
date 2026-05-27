const router         = require('express').Router()
const AuthController = require('../controllers/AuthController')
const { authMiddleware } = require('../middleware/auth')

router.post('/register', AuthController.register.bind(AuthController))
router.post('/login',    AuthController.login.bind(AuthController))
router.post('/logout',   authMiddleware, AuthController.logout.bind(AuthController))
router.get('/me',        authMiddleware, AuthController.me.bind(AuthController))

module.exports = router
