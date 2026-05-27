const router          = require('express').Router()
const OrderController = require('../controllers/OrderController')
const { authMiddleware } = require('../middleware/auth')

router.post('/',  authMiddleware, OrderController.create.bind(OrderController))
router.get('/me', authMiddleware, OrderController.getMyOrders.bind(OrderController))

module.exports = router
