const supabase = require('../../config/database')

// Usuario debe estar autenticado
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  console.log('[authMiddleware] header:', authHeader?.substring(0, 50))

  const token = authHeader?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  console.log('[authMiddleware] user:', user?.id, 'error:', error?.message)

  if (error || !user) return res.status(401).json({ success: false, error: 'Invalid token' })

  req.user = user
  next()
}

// Usuario puede estar autenticado o no (para reservas de invitados)
async function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token)
    req.user = user || null
  }
  next()
}

// Requiere cualquier nivel de staff (level1, level2, level3)
async function requireStaff(req, res, next) {
  const { data } = await supabase
    .from('staff')
    .select('level')
    .eq('person_id', req.user.id)
    .single()
  if (!data || !['level1', 'level2', 'level3'].includes(data.level))
    return res.status(403).json({ success: false, error: 'Staff access required' })
  req.staffLevel = data.level
  next()
}

// Requiere level2 o level3 (manager o admin)
async function requireManager(req, res, next) {
  const { data } = await supabase
    .from('staff')
    .select('level')
    .eq('person_id', req.user.id)
    .single()
  if (!data || !['level2', 'level3'].includes(data.level))
    return res.status(403).json({ success: false, error: 'Manager access required' })
  req.staffLevel = data.level
  next()
}

// Requiere level3 (admin)
async function requireAdmin(req, res, next) {
  const { data } = await supabase
    .from('staff')
    .select('level')
    .eq('person_id', req.user.id)
    .single()
  if (!data || data.level !== 'level3')
    return res.status(403).json({ success: false, error: 'Admin access required' })
  req.staffLevel = data.level
  next()
}

module.exports = { authMiddleware, optionalAuth, requireStaff, requireManager, requireAdmin }
