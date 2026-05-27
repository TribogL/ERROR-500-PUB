const router            = require('express').Router()
const LoyaltyController = require('../controllers/LoyaltyController')
const { authMiddleware, requireStaff } = require('../middleware/auth')

router.get('/balance',       authMiddleware,             LoyaltyController.getBalance.bind(LoyaltyController))
router.get('/history',       authMiddleware,             LoyaltyController.getHistory.bind(LoyaltyController))
router.post('/redeem',       authMiddleware,             LoyaltyController.redeemPoints.bind(LoyaltyController))
router.post('/add',          authMiddleware, requireStaff, LoyaltyController.addPoints.bind(LoyaltyController))
router.get('/all-history',   authMiddleware, requireStaff, LoyaltyController.getAllHistory.bind(LoyaltyController))
router.get('/rewards',       authMiddleware,              LoyaltyController.getRewards.bind(LoyaltyController))
router.post('/rewards',      authMiddleware, requireStaff, LoyaltyController.createReward.bind(LoyaltyController))
router.put('/rewards/:id',   authMiddleware, requireStaff, LoyaltyController.updateReward.bind(LoyaltyController))
router.patch('/rewards/:id', authMiddleware, requireStaff, LoyaltyController.toggleReward.bind(LoyaltyController))

module.exports = router
