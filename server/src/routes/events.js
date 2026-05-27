const router          = require('express').Router()
const EventController = require('../controllers/EventController')
const { authMiddleware, requireAdmin } = require('../middleware/auth')

router.get('/',            EventController.getAll.bind(EventController))
router.get('/upcoming',    EventController.getUpcoming.bind(EventController))
router.get('/:id',         EventController.getById.bind(EventController))
router.post('/',           authMiddleware, requireAdmin, EventController.create.bind(EventController))
router.put('/:id',         authMiddleware, requireAdmin, EventController.update.bind(EventController))
router.delete('/:id',      authMiddleware, requireAdmin, EventController.delete.bind(EventController))

module.exports = router
