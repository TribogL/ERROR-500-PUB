const router          = require('express').Router()
const StaffController = require('../controllers/StaffController')
const { authMiddleware, requireAdmin } = require('../middleware/auth')

router.get('/',                         authMiddleware, requireAdmin, StaffController.getAll.bind(StaffController))
router.get('/:personId',                authMiddleware, requireAdmin, StaffController.getById.bind(StaffController))
router.post('/',                        authMiddleware, requireAdmin, StaffController.create.bind(StaffController))
router.patch('/:personId/level',        authMiddleware, requireAdmin, StaffController.updateLevel.bind(StaffController))
router.patch('/:id',                    authMiddleware, requireAdmin, StaffController.update.bind(StaffController))
router.delete('/:personId',             authMiddleware, requireAdmin, StaffController.remove.bind(StaffController))

module.exports = router
