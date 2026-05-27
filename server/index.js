require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cron = require('node-cron')

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

app.use(express.json())

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Error 500 API is running',
    health: '/api/health'
  })
})

// Routers
const productsRouter = require('./src/routes/products')
const ordersRouter = require('./src/routes/orders')
const reservationsRouter = require('./src/routes/reservations')
const authRouter = require('./src/routes/auth')
const eventsRouter = require('./src/routes/events')
const ticketsRouter = require('./src/routes/tickets')
const loyaltyRouter = require('./src/routes/loyalty')
const personsRouter = require('./src/routes/persons')
const staffRouter = require('./src/routes/staff')
const adminRouter = require('./src/routes/admin')
const communityRouter = require('./src/routes/community')

// Routes with /api
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/reservations', reservationsRouter)
app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/loyalty', loyaltyRouter)
app.use('/api/persons', personsRouter)
app.use('/api/staff', staffRouter)
app.use('/api/admin', adminRouter)
app.use('/api/community', communityRouter)

// Routes without /api, useful for Vercel internal routing
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/reservations', reservationsRouter)
app.use('/auth', authRouter)
app.use('/events', eventsRouter)
app.use('/tickets', ticketsRouter)
app.use('/loyalty', loyaltyRouter)
app.use('/persons', personsRouter)
app.use('/staff', staffRouter)
app.use('/admin', adminRouter)
app.use('/community', communityRouter)

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', project: 'Error 500 Bar' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

// Cron — limpiar reservas de invitados pendientes cada hora
if (!process.env.VERCEL) {
  const AdminService = require('./src/services/AdminService')

  cron.schedule('0 * * * *', async () => {
    try {
      const removed = await AdminService.cleanupGuestReservations()
      if (removed > 0) console.log(`[cron] cleanup_guest_reservations: ${removed} eliminadas`)
    } catch (err) {
      console.error('[cron] cleanup_guest_reservations error:', err.message)
    }
  })
}

const PORT = process.env.PORT || 3000

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Error 500 Server running on port ${PORT}`))
}

module.exports = app