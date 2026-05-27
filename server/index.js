require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const cron    = require('node-cron')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes — existing
app.use('/api/products',     require('./src/routes/products'))
app.use('/api/orders',       require('./src/routes/orders'))
app.use('/api/reservations', require('./src/routes/reservations'))

// Routes — new
app.use('/api/auth',    require('./src/routes/auth'))
app.use('/api/events',  require('./src/routes/events'))
app.use('/api/tickets', require('./src/routes/tickets'))
app.use('/api/loyalty', require('./src/routes/loyalty'))
app.use('/api/persons', require('./src/routes/persons'))
app.use('/api/staff',     require('./src/routes/staff'))
app.use('/api/admin',     require('./src/routes/admin'))
app.use('/api/community', require('./src/routes/community'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', project: 'Error 500 Bar' }))

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }))

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
