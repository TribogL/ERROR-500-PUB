const router                 = require('express').Router()
const ReservationController  = require('../controllers/ReservationController')
const { authMiddleware, optionalAuth, requireStaff } = require('../middleware/auth')

router.post('/',          optionalAuth,   ReservationController.create.bind(ReservationController))
router.get('/me',         authMiddleware, ReservationController.getMyReservations.bind(ReservationController))
router.get('/',           authMiddleware, requireStaff, ReservationController.getAll.bind(ReservationController))
router.patch('/:id/status', authMiddleware, requireStaff, ReservationController.updateStatus.bind(ReservationController))

module.exports = router
