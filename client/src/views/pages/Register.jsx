import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthController } from '../../controllers/AuthController.js'
import styles from './Auth.module.css'

const BENEFITS = [
  { title: 'Loyalty Points',  desc: 'Acumula puntos en cada pedido y canjéalos por bebidas.' },
  { title: 'Reservas rápidas', desc: 'Guarda tus datos y reserva en segundos.' },
  { title: 'Historial completo', desc: 'Revisa cada pedido y cada noche en el bar.' },
]

export default function Register() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({
    firstName: '', lastName: '', email: '', password: '', confirm: ''
  })
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await AuthController.register(form.email, form.password, form.firstName, form.lastName, navigate)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.wrapper}>
      {/* ── Panel marca ── */}
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <h1 className={styles.brandTitle}>
            <span className={styles.wordError}>Error</span>
            <span className={styles.wordCode}>500</span>
          </h1>
          <p className={styles.brandTagline}>
            Crea tu cuenta y empieza a acumular puntos desde el primer trago.
          </p>

          <ul className={styles.benefits}>
            {BENEFITS.map(b => (
              <li key={b.title} className={styles.benefitItem}>
                <span className={styles.benefitTitle}>{b.title}</span>
                <span className={styles.benefitDesc}>{b.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Panel formulario ── */}
      <div className={styles.formPanel}>
        <h2 className={styles.formTitle}>Crear cuenta</h2>
        <p className={styles.formSubtitle}>Únete a la comunidad del bar más geek de la ciudad.</p>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">Nombre</label>
              <input
                id="firstName" type="text" name="firstName"
                value={form.firstName} onChange={handleChange}
                className={styles.input}
                autoComplete="given-name" required placeholder="Ada"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Apellido</label>
              <input
                id="lastName" type="text" name="lastName"
                value={form.lastName} onChange={handleChange}
                className={styles.input}
                autoComplete="family-name" required placeholder="Lovelace"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email" type="email" name="email"
              value={form.email} onChange={handleChange}
              className={styles.input}
              autoComplete="email" required placeholder="ada@error500.bar"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password" type="password" name="password"
              value={form.password} onChange={handleChange}
              className={styles.input}
              autoComplete="new-password" required minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">Confirmar contraseña</label>
            <input
              id="confirm" type="password" name="confirm"
              value={form.confirm} onChange={handleChange}
              className={styles.input}
              autoComplete="new-password" required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.btnAuth} disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className={styles.formFooter}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.switchLink}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  )
}
