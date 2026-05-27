const router          = require('express').Router()
const AdminController = require('../controllers/AdminController')
const { authMiddleware, requireAdmin } = require('../middleware/auth')

router.use(authMiddleware, requireAdmin)

router.get('/metrics',                      AdminController.getMetrics.bind(AdminController))
router.get('/orders',                       AdminController.getRecentOrders.bind(AdminController))
router.get('/reservations',                 AdminController.getAllReservations.bind(AdminController))
router.patch('/reservations/:id/status',    AdminController.updateReservationStatus.bind(AdminController))
router.post('/cleanup',                     AdminController.runCleanup.bind(AdminController))

module.exports = router
