import { useEffect, useState } from 'react'
import { api }         from '../../services/api.js'
import { authService } from '../../services/authService.js'
import DatePicker      from './DatePicker.jsx'
import styles          from './Reserve.module.css'

const SECTIONS = [
  { value: 'Barra',           label: 'Barra'           },
  { value: 'Terraza',         label: 'Terraza'         },
  { value: 'Salon principal', label: 'Salón principal' },
  { value: 'Sala privada',    label: 'Sala privada'    },
]

const SECTION_MAP = {
  'Barra':           'barra',
  'Terraza':         'terraza',
  'Salón principal': 'salon',
  'Sala privada':    'sala_privada',
}

const TIMES = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

export default function Reserve() {
  const [form,    setForm]    = useState({
    date: '', time: '', guests: 2, section: '',
    guestName: '', guestDni: '', guestPhone: '', note: ''
  })
  const [isAuth,  setIsAuth]  = useState(false)
  const [status,  setStatus]  = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    authService.getSession().then(s => setIsAuth(!!s))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      const session = await authService.getSession()
      const payload = {
        date:    form.date,
        time:    form.time,
        guests:  Number(form.guests),
        section: SECTION_MAP[form.section] ?? form.section.toLowerCase(),
        note:    form.note || null
      }
      if (session) {
        payload.personId = session.user.id
      } else {
        payload.guestName  = form.guestName
        payload.guestDni   = form.guestDni
        payload.guestPhone = form.guestPhone
      }
      await api.post('/reservations', payload)
      setStatus('success')
      setMessage('Reserva enviada. Te confirmaremos pronto.')
    } catch (err) {
      setStatus('error')
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>Reservar mesa</h1>

      <div className={styles.layout}>
        {/* ── Formulario ── */}
        <section>
          {status === 'success' && <p className={styles.feedbackSuccess}>{message}</p>}
          {status === 'error'   && <p className={styles.feedbackError}>{message}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Datos de la visita</legend>

              <div className={styles.field}>
                <span className={styles.label}>Fecha</span>
                <DatePicker
                  value={form.date}
                  onChange={date => setForm(prev => ({ ...prev, date }))}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="time">Hora</label>
                <select
                  id="time" name="time"
                  value={form.time} onChange={handleChange}
                  className={styles.select} required
                >
                  <option value="">Selecciona una hora</option>
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="guests">Número de personas</label>
                <input
                  id="guests" type="number" name="guests"
                  min={1} max={20}
                  value={form.guests} onChange={handleChange}
                  className={styles.input} required
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Sección</span>
                <div className={styles.sectionGrid} role="radiogroup" aria-label="Sección">
                  {SECTIONS.map(s => (
                    <label key={s.value} className={styles.sectionOption}>
                      <input
                        type="radio"
                        name="section"
                        value={s.value}
                        checked={form.section === s.value}
                        onChange={handleChange}
                        className={styles.sectionInput}
                        required
                      />
                      <span className={styles.sectionLabel}>
                        <span className={styles.sectionName}>{s.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="note">Nota (opcional)</label>
                <textarea
                  id="note" name="note"
                  value={form.note} onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Alergias, celebraciones, solicitudes especiales…"
                  rows={3}
                />
              </div>
            </fieldset>

            {!isAuth && (
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Tus datos (sin cuenta)</legend>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="guestName">Nombre completo</label>
                  <input id="guestName" type="text" name="guestName"
                    value={form.guestName} onChange={handleChange}
                    className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="guestDni">Cédula</label>
                  <input id="guestDni" type="text" name="guestDni"
                    value={form.guestDni} onChange={handleChange}
                    className={styles.input} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="guestPhone">Teléfono</label>
                  <input id="guestPhone" type="tel" name="guestPhone"
                    value={form.guestPhone} onChange={handleChange}
                    className={styles.input} />
                </div>
              </fieldset>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Enviando…' : 'Confirmar reserva'}
            </button>
          </form>
        </section>

        {/* ── Panel de info ── */}
        <aside>
          <div className={styles.infoCard}>
            <h2 className={styles.infoCardTitle}>Horarios</h2>
            <ul className={styles.hoursList}>
              {[
                { day: 'Lun — Vie', value: '4:00 pm — 2:00 am' },
                { day: 'Sáb — Dom', value: '12:00 pm — 3:00 am' },
              ].map(h => (
                <li key={h.day} className={styles.hoursItem}>
                  <span className={styles.hoursDay}>{h.day}</span>
                  <span className={styles.hoursValue}>{h.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.infoCardTitle}>Capacidad por sección</h2>
            <div className={styles.capacityGrid}>
              {[
                { name: 'Barra',           value: '12 personas' },
                { name: 'Terraza',         value: '40 personas' },
                { name: 'Salón principal', value: '60 personas' },
                { name: 'Sala privada',    value: '20 personas' },
              ].map(c => (
                <div key={c.name} className={styles.capacityItem}>
                  <span className={styles.capacityName}>{c.name}</span>
                  <span className={styles.capacityValue}>{c.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.infoCardTitle}>Políticas</h2>
            <ul className={styles.policyList}>
              <li className={styles.policyItem}>Confirmación en menos de 2 horas hábiles.</li>
              <li className={styles.policyItem}>Cancelación gratuita hasta 24 h antes.</li>
              <li className={styles.policyItem}>Grupos mayores de 10 personas requieren depósito.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  )
}
