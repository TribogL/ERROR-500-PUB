import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthController } from '../../controllers/AuthController.js'
import styles from './Auth.module.css'

export default function Login() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await AuthController.login(form.email, form.password, navigate)
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
            El bar donde cada sesión termina con un commit
            y una cerveza bien fría.
          </p>
        </div>
      </div>

      {/* ── Panel formulario ── */}
      <div className={styles.formPanel}>
        <h2 className={styles.formTitle}>Bienvenido de vuelta</h2>
        <p className={styles.formSubtitle}>Inicia sesión para ver tu historial, puntos y reservas.</p>

        {error && <p className={styles.errorMsg}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Correo electrónico</label>
            <input
              id="email" type="email" name="email"
              value={form.email} onChange={handleChange}
              className={styles.input}
              autoComplete="email" required
              placeholder="tu@email.com"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password" type="password" name="password"
              value={form.password} onChange={handleChange}
              className={styles.input}
              autoComplete="current-password" required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.btnAuth} disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className={styles.formFooter}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.switchLink}>Regístrate</Link>
        </p>
      </div>
    </main>
  )
}
