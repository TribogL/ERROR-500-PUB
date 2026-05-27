const router            = require('express').Router()
const ProductController = require('../controllers/ProductController')
const { authMiddleware, requireAdmin } = require('../middleware/auth')

router.get('/',           ProductController.getAll.bind(ProductController))
router.get('/:id',        ProductController.getById.bind(ProductController))
router.post('/',          authMiddleware, requireAdmin, ProductController.create.bind(ProductController))
router.patch('/:id/toggle', authMiddleware, requireAdmin, ProductController.toggleAvailability.bind(ProductController))
router.delete('/:id',       authMiddleware, requireAdmin, ProductController.delete.bind(ProductController))

module.exports = router
