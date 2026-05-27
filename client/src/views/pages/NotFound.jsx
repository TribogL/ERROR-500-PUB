import { Link, useNavigate } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <div className={styles.terminal}>
        {/* Barra de ventana */}
        <div className={styles.termBar}>
          <span className={styles.dotRed}    />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen}  />
          <span className={styles.termTitle}>bash — error500@server:~</span>
        </div>

        {/* Cuerpo */}
        <div className={styles.termBody}>
          <p className={styles.termLine}>
            <span className={styles.prompt}>error500@server:~$</span>
            <span> curl /api/this-page</span>
          </p>

          <p className={styles.errorCode}>404</p>

          <p className={styles.termLine}>
            <span className={styles.errorMsg}>
              ERROR: Route not found on this server.
            </span>
          </p>

          <p className={styles.termLine}>
            Quizás el endpoint fue eliminado, movido, o nunca existió.
          </p>

          <p className={styles.termLine}>
            <span className={styles.prompt}>error500@server:~$</span>
            <span className={styles.cursor}>_</span>
          </p>
        </div>

        {/* Botones */}
        <div className={styles.actions}>
          <Link to="/" className={styles.btnHome}>Ir al inicio</Link>
          <button
            type="button"
            className={styles.btnBack}
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  )
}
