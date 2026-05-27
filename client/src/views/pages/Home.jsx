import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.welcomeSection}>
        <div className={`${styles.particle} ${styles.particle1}`} aria-hidden="true" />
        <div className={`${styles.particle} ${styles.particle2}`} aria-hidden="true" />
        <div className={`${styles.particle} ${styles.particle3}`} aria-hidden="true" />
        <div className={`${styles.particle} ${styles.particle4}`} aria-hidden="true" />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>// bienvenido al bar</span>

          <h1 className={styles.title}>
            <span className={styles.titleError}>Error </span>
            <span className={styles.titleCode}>500</span>
          </h1>

          <p className={styles.subtitle}>
            Internal Server Bar — donde los bugs se ahogan en cerveza artesanal
            y los commits se celebran con una ronda.
          </p>

          <div className={styles.btnRow}>
            <Link to="/products" className={styles.btnPrimary}>Ver la carta</Link>
            <Link to="/reserve"  className={styles.btnSecondary}>Reservar mesa</Link>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>16+</span>
              <span className={styles.statLabel}>Cervezas artesanales</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>8</span>
              <span className={styles.statLabel}>Eventos al mes</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>500</span>
              <span className={styles.statLabel}>Bugs ahogados</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.cardsSection}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Cervezas artesanales</h2>
          <p className={styles.cardText}>
            Más de 20 estilos en grifo y botella — IPAs, stouts,
            sours y todo lo que tu pipeline necesita.
          </p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Cócteles de autor</h2>
          <p className={styles.cardText}>
            Combinaciones que ningún Stack Overflow tiene.
            Cada trago, un algoritmo irrepetible.
          </p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Eventos & meetups</h2>
          <p className={styles.cardText}>
            Charlas tech, trivia y noches de código.
            La comunidad que compila junta, permanece junta.
          </p>
          <Link to="/events" className={styles.cardLink}>Ver eventos →</Link>
        </article>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>¿Vienes con tu equipo?</h2>
        <p className={styles.ctaText}>
          Reserva tu mesa y asegura el uptime de la noche.
        </p>
        <Link to="/reserve" className={styles.ctaBtn}>Hacer una reserva</Link>
      </section>
    </main>
  )
}
