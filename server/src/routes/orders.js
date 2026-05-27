const router          = require('express').Router()
const OrderController = require('../controllers/OrderController')
const { authMiddleware, requireStaff } = require('../middleware/auth')

router.post('/',  authMiddleware,               OrderController.create.bind(OrderController))
router.get('/me', authMiddleware,               OrderController.getMyOrders.bind(OrderController))
router.get('/',   authMiddleware, requireStaff, OrderController.getAll.bind(OrderController))

module.exports = router
