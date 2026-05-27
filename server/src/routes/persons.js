console.log('[persons router] loaded')

const router            = require('express').Router()
const PersonController  = require('../controllers/PersonController')
const { authMiddleware, requireAdmin, requireStaff } = require('../middleware/auth')

router.get('/me',      authMiddleware,               PersonController.getMe.bind(PersonController))
router.patch('/me',    authMiddleware,               PersonController.updateMe.bind(PersonController))
router.get('/',        authMiddleware, requireStaff,  PersonController.getAll.bind(PersonController))
router.patch('/:id',   authMiddleware, requireStaff,  PersonController.update.bind(PersonController))
router.delete('/:id',  authMiddleware, requireAdmin,  PersonController.delete.bind(PersonController))

module.exports = router
