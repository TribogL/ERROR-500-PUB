const router           = require('express').Router()
const TicketController = require('../controllers/TicketController')
const { authMiddleware, requireStaff, requireAdmin } = require('../middleware/auth')

router.get('/',                       TicketController.getAll.bind(TicketController))
router.get('/me',                     authMiddleware, TicketController.getMyTickets.bind(TicketController))
router.get('/event/:eventId',         TicketController.getByEvent.bind(TicketController))
router.get('/:id',                    TicketController.getById.bind(TicketController))
router.post('/',                      authMiddleware, requireAdmin, TicketController.create.bind(TicketController))
router.put('/:id',                    authMiddleware, requireAdmin, TicketController.update.bind(TicketController))

module.exports = router
