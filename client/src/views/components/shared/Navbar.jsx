import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthController } from '../../../controllers/AuthController.js'
import CartIcon from './CartIcon.jsx'
import '../../../styles/navbar.css'

const NAV_LINKS = [
  { to: '/',         label: 'Inicio'   },
  { to: '/products', label: 'Carta'    },
  { to: '/events',   label: 'Eventos'  },
  { to: '/reserve',  label: 'Reservas' },
  { to: '/about',    label: 'Nosotros' }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [level,   setLevel]   = useState(null)

  useEffect(() => {
    AuthController.getSession().then(s => {
      setSession(s)
      setLevel(s ? localStorage.getItem('user_level') : null)
    })

    const { data: { subscription } } = AuthController.onAuthChange(s => {
      setSession(s)
      setLevel(s ? localStorage.getItem('user_level') : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await AuthController.logout(navigate)
  }

  const isStaff = ['level1', 'level2', 'level3', 'staff', 'admin'].includes(level)

  const profileLabel = level === 'level3' ? 'Admin'
    : level === 'level2' ? 'Manager'
    : level === 'level1' ? 'Bartender'
    : 'Mi perfil'
  const profileRoute = isStaff ? '/admin' : '/dashboard'

  return (
    <nav className="navbar">
      {/* Brand */}
      <NavLink
        to="/"
        className="nav-brand"
        aria-label="Error 500 — Inicio"
      >
        <span className="nav-brand-error">Error </span>
        <span className="nav-brand-code">500</span>
      </NavLink>

      {/* Links */}
      <ul className="nav-list">
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          </li>
        ))}
        {isStaff && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
            >
              Admin
            </NavLink>
          </li>
        )}
      </ul>

      {/* Auth */}
      <div className="nav-auth">
        {session === undefined ? null : session ? (
          <>
            <NavLink
              to={profileRoute}
              className={({ isActive }) =>
                `btn-nav${isActive ? ' active' : ''}`
              }
            >
              {profileLabel}
            </NavLink>
            <CartIcon />
            <button
              type="button"
              className="btn-nav btn-nav-primary"
              onClick={handleLogout}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login"    className="btn-nav">Iniciar sesión</NavLink>
            <NavLink to="/register" className="btn-nav btn-nav-primary">Registrarse</NavLink>
          </>
        )}
      </div>

      {/* Espuma — foam cream visible bajo el navbar */}
      <div className="nav-foam" aria-hidden="true">
        <svg
          viewBox="0 0 1440 30"
          height="30"
          width="100%"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <ellipse cx="60"   cy="22" rx="72"  ry="18" fill="#F2E8D5" />
          <ellipse cx="185"  cy="18" rx="95"  ry="22" fill="#F2E8D5" />
          <ellipse cx="310"  cy="24" rx="68"  ry="16" fill="#F2E8D5" />
          <ellipse cx="430"  cy="16" rx="88"  ry="20" fill="#F2E8D5" />
          <ellipse cx="560"  cy="22" rx="75"  ry="18" fill="#F2E8D5" />
          <ellipse cx="690"  cy="14" rx="92"  ry="22" fill="#F2E8D5" />
          <ellipse cx="820"  cy="20" rx="70"  ry="17" fill="#F2E8D5" />
          <ellipse cx="950"  cy="25" rx="85"  ry="19" fill="#F2E8D5" />
          <ellipse cx="1075" cy="15" rx="78"  ry="21" fill="#F2E8D5" />
          <ellipse cx="1200" cy="22" rx="90"  ry="18" fill="#F2E8D5" />
          <ellipse cx="1320" cy="17" rx="73"  ry="20" fill="#F2E8D5" />
          <ellipse cx="1420" cy="23" rx="65"  ry="16" fill="#F2E8D5" />
        </svg>
      </div>
    </nav>
  )
}
