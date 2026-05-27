import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { api }   from '../../services/api.js'
import styles    from './Events.module.css'

const EVENT_ACCENTS = ['var(--gold)', 'var(--copper)', 'var(--irish)']

export default function Events() {
  const navigate              = useNavigate()
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const [subName,  setSubName]  = useState('')
  const [subEmail, setSubEmail] = useState('')
  const [subPhone, setSubPhone] = useState('')
  const [subSent,  setSubSent]  = useState(false)
  const [subError, setSubError] = useState(null)

  useEffect(() => {
    api.get('/events/upcoming')
      .then(({ data }) => setEvents(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubscribe(e) {
    e.preventDefault()
    setSubError(null)
    try {
      await api.post('/community', { name: subName, email: subEmail, phone: subPhone || undefined })
      setSubSent(true)
    } catch (err) {
      setSubError(err.message || 'Error al suscribirse. Inténtalo de nuevo.')
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Eventos</h1>
        <p className={styles.subtitle}>Noches que vale la pena deployar.</p>
      </header>

      {loading && <p className={styles.loading}>Cargando eventos…</p>}
      {error   && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && (
        <section className={styles.grid}>
          {events.length === 0 ? (
            <p className={styles.empty}>No hay eventos próximos por el momento.</p>
          ) : (
            events.map((event, i) => (
              <article
                key={event.id}
                className={styles.eventCard}
                style={{ '--event-accent': EVENT_ACCENTS[i % EVENT_ACCENTS.length] }}
              >
                {event.image && (
                  <div className={styles.imageWrap}>
                    <img src={event.image} alt={event.name} className={styles.img} loading="lazy" />
                  </div>
                )}

                <div className={styles.body}>
                  <h2 className={styles.name}>{event.name}</h2>

                  <div className={styles.eventMeta}>
                    {event.date && (
                      <span className={styles.metaDate}>
                        {new Date(event.date).toLocaleDateString('es-CO', {
                          weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className={styles.desc}>{event.description}</p>
                  )}
                </div>

                <div className={styles.footer}>
                  <span className={styles.eventPrice}>
                    {event.price === 0
                      ? 'Entrada libre'
                      : `$ ${event.price?.toLocaleString('es-CO')}`
                    }
                  </span>
                  <button
                    type="button"
                    className={styles.eventBtn}
                    onClick={() => navigate('/products?tab=Tickets')}
                  >
                    Ver entradas
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      )}
      {/* ── Suscripción ── */}
      <section className={styles.subscribeSection}>
        <h2 className={styles.subscribeTitle}>Únete a la comunidad</h2>
        <p className={styles.subscribeLead}>Recibe noticias de eventos y ofertas especiales.</p>
        {subSent ? (
          <p className={styles.subscribeSuccess}>¡Gracias! Te hemos registrado en la comunidad.</p>
        ) : (
          <form className={styles.subscribeForm} onSubmit={handleSubscribe}>
            <input className={styles.subscribeInput} type="text"  placeholder="Nombre"
              value={subName}  onChange={e => setSubName(e.target.value)}  required />
            <input className={styles.subscribeInput} type="email" placeholder="Email"
              value={subEmail} onChange={e => setSubEmail(e.target.value)} required />
            <input className={styles.subscribeInput} type="tel"   placeholder="Teléfono (opcional)"
              value={subPhone} onChange={e => setSubPhone(e.target.value)} />
            <button type="submit" className={styles.subscribeBtn}>Suscribirse</button>
            {subError && <p className={styles.subscribeError}>{subError}</p>}
          </form>
        )}
      </section>
    </main>
  )
}
