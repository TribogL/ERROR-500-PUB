import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '../../../services/authService.js'

const STAFF_LEVELS = ['level1', 'level2', 'level3']

export default function ProtectedRoute({ requireStaff = false }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'unauth' | 'forbidden'

  useEffect(() => {
    authService.getSession().then(session => {
      if (!session) { setStatus('unauth'); return }

      if (requireStaff) {
        const level = localStorage.getItem('user_level')
        if (!STAFF_LEVELS.includes(level)) { setStatus('forbidden'); return }
      }

      setStatus('ok')
    })
  }, [requireStaff])

  if (status === 'loading')   return null
  if (status === 'unauth')    return <Navigate to="/login"     replace />
  if (status === 'forbidden') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
