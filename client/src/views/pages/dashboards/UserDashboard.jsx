import { useEffect, useState } from 'react'
import { useNavigate }      from 'react-router-dom'
import { api }              from '../../../services/api.js'
import easterEggService     from '../../../services/easterEggService.js'
import { authService }      from '../../../services/authService.js'
import { DashboardFactory } from '../../../factories/DashboardFactory.jsx'
import styles               from './Dashboard.module.css'

const STAFF_LEVELS = ['level1', 'level2', 'level3']

const ICONS = {
  orders:       '≡',
  reservations: '◷',
  loyalty:      '◆',
  rewards:      '◈',
  events:       '◉',
  settings:     '⚙',
}

const LABELS = {
  orders:       'Pedidos',
  reservations: 'Reservas',
  loyalty:      'Loyalty',
  rewards:      'Rewards',
  events:       'Eventos',
  settings:     'Ajustes',
}

const STATUS_BADGE = {
  completed: styles.badgeCompleted,
  pending:   styles.badgePending,
  cancelled: styles.badgeCancelled,
  confirmed: styles.badgeConfirmed,
}

export default function UserDashboard() {
  const navigate   = useNavigate()
  const [person,          setPerson]          = useState(null)
  const [orders,          setOrders]          = useState([])
  const [reservations,    setReservations]    = useState([])
  const [balance,         setBalance]         = useState(0)
  const [tickets,         setTickets]         = useState([])
  const [rewards,         setRewards]         = useState([])
  const [rewardsLoading,  setRewardsLoading]  = useState(false)
  const [easterEggEnabled, setEasterEggEnabled] = useState(easterEggService.isEnabled())
  const [loading,         setLoading]         = useState(true)

  const config     = DashboardFactory.createConfig('customer')
  const sections   = config.getSections()
  const [active, setActive] = useState(sections[0])

  useEffect(() => {
    const level = localStorage.getItem('user_level')
    if (STAFF_LEVELS.includes(level)) {
      navigate('/admin', { replace: true })
      return
    }

    async function load() {
      try {
        const session = await authService.getSession()
        if (!session) return

        const [personRes, ordersRes, reservationsRes, loyaltyRes, ticketsRes] = await Promise.allSettled([
          api.get('/auth/me'),
          api.get('/orders/me'),
          api.get('/reservations/me'),
          api.get('/loyalty/balance'),
          api.get('/tickets/me'),
        ])

        if (personRes.status       === 'fulfilled') setPerson(personRes.value.data?.person ?? personRes.value.data)
        if (ordersRes.status       === 'fulfilled') setOrders(ordersRes.value.data ?? [])
        if (reservationsRes.status === 'fulfilled') setReservations(reservationsRes.value.data ?? [])
        if (loyaltyRes.status      === 'fulfilled') setBalance(loyaltyRes.value.data.balance ?? 0)
        if (ticketsRes.status      === 'fulfilled') setTickets(ticketsRes.value.data ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  useEffect(() => {
    if (active !== 'rewards' || rewards.length > 0) return
    setRewardsLoading(true)
    console.log('[UserDashboard] fetching rewards…')
    api.get('/loyalty/rewards')
      .then(r => {
        console.log('[UserDashboard rewards]', r)
        setRewards(r.data || [])
      })
      .catch(err => console.error('[UserDashboard rewards error]', err))
      .finally(() => setRewardsLoading(false))
  }, [active])

  async function handleRedeem(reward) {
    try {
      await api.post('/loyalty/redeem', { rewardId: reward.id })
      const [balRes, rwRes] = await Promise.all([
        api.get('/loyalty/balance'),
        api.get('/loyalty/rewards'),
      ])
      setBalance(balRes.data.balance ?? 0)
      setRewards(rwRes.data || [])
    } catch (err) {
      window.alert(err.message || 'Error al canjear la reward')
    }
  }

  if (loading) return <div className={styles.loadingState}>Cargando perfil…</div>

  const firstName = person?.firstName ?? person?.first_name ?? ''
  const lastName  = person?.lastName  ?? person?.last_name  ?? ''
  const initials  = `${firstName[0] ?? '?'}${lastName[0] ?? ''}`.toUpperCase()
  const welcome   = config.getWelcomeMessage(firstName)

  return (
    <div className={styles.wrapper}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.profileBlock}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <p className={styles.profileName}>{firstName} {lastName}</p>
            <p className={styles.profileRole}>Cliente</p>
          </div>
        </div>

        <nav className={styles.sidebarNav} aria-label="Secciones del dashboard">
          {sections.map(s => (
            <button
              key={s}
              type="button"
              className={`${styles.sidebarBtn}${active === s ? ' ' + styles.active : ''}`}
              onClick={() => setActive(s)}
            >
              <span className={styles.sidebarIcon}>{ICONS[s]}</span>
              {LABELS[s]}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Contenido ── */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>{welcome}</h1>
        <p className={styles.pageSubtitle}>Tu panel personal en Error 500.</p>

        {/* Loyalty */}
        {active === 'loyalty' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Loyalty Points</h2>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--gold)' }}>
                <p className={styles.statLabel}>Balance actual</p>
                <p className={styles.statValue}>{balance}</p>
                <p className={styles.statUnit}>puntos disponibles</p>
              </div>
            </div>
          </section>
        )}

        {/* Orders */}
        {active === 'orders' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Mis pedidos</h2>
            </div>
            {orders.length === 0 ? (
              <p className={styles.emptyState}>Aún no tienes pedidos registrados.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td>#{o.id.slice(0, 8)}</td>
                        <td>$ {o.total?.toLocaleString('es-CO')}</td>
                        <td>
                          <span className={`${styles.badge} ${STATUS_BADGE[o.status] ?? ''}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Reservations */}
        {active === 'reservations' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Mis reservas</h2>
            </div>
            {reservations.length === 0 ? (
              <p className={styles.emptyState}>Aún no tienes reservas registradas.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Personas</th>
                      <th>Sección</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(r => (
                      <tr key={r.id}>
                        <td>{r.date}</td>
                        <td>{r.time}</td>
                        <td>{r.guests}</td>
                        <td className={styles.listMeta}>{r.section ?? '—'}</td>
                        <td>
                          <span className={`${styles.badge} ${STATUS_BADGE[r.status] ?? styles.badgePending}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Events */}
        {active === 'events' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Mis entradas</h2>
            </div>
            {tickets.length === 0 ? (
              <p className={styles.emptyState}>Aún no tienes entradas compradas.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Ticket</th>
                      <th>Fecha</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id}>
                        <td>{t.tickets?.events?.name ?? '—'}</td>
                        <td>{t.tickets?.name ?? '—'}</td>
                        <td>{t.tickets?.events?.date
                          ? new Date(t.tickets.events.date).toLocaleDateString('es-CO')
                          : '—'}
                        </td>
                        <td>{t.quantity}</td>
                        <td>$ {(t.unit_price * t.quantity)?.toLocaleString('es-CO')}</td>
                        <td>
                          <span className={`${styles.badge} ${STATUS_BADGE[t.orders?.status] ?? ''}`}>
                            {t.orders?.status ?? '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        {/* Rewards */}
        {active === 'rewards' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Rewards</h2>
              <span style={{ fontSize: '.85rem', color: 'var(--gold)', fontWeight: 600 }}>
                {balance} LP disponibles
              </span>
            </div>
            {rewardsLoading ? (
              <p className={styles.emptyState}>Cargando rewards…</p>
            ) : rewards.length === 0 ? (
              <p className={styles.emptyState}>No hay rewards disponibles por el momento.</p>
            ) : (
              <div className={`${styles.statsRow} ${styles.kpiGrid}`}>
                {rewards.map(rw => {
                  const canRedeem = balance >= rw.lp_cost && rw.available && rw.stock > 0
                  return (
                    <div key={rw.id} className={styles.statCard}
                      style={{ '--accent-bar': canRedeem ? 'var(--gold)' : 'var(--border)' }}>
                      <p className={styles.statLabel}>{rw.name}</p>
                      <p className={styles.statValue}>{rw.lp_cost} <span style={{ fontSize: '1rem' }}>LP</span></p>
                      {rw.description && <p className={styles.statUnit}>{rw.description}</p>}
                      <p className={styles.statUnit}>Stock: {rw.stock}</p>
                      <button
                        type="button"
                        className={canRedeem ? styles.btnConfirm : styles.btnCancel}
                        style={{ marginTop: 12, opacity: canRedeem ? 1 : 0.5 }}
                        disabled={!canRedeem}
                        onClick={() => handleRedeem(rw)}
                      >
                        {rw.stock === 0
                          ? 'Sin stock'
                          : canRedeem
                            ? 'Canjear'
                            : `Faltan ${rw.lp_cost - balance} LP`}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Settings */}
        {active === 'settings' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ajustes</h2>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--copper)' }}>
                <p className={styles.statLabel}>Easter Egg habilitado</p>
                <p className={styles.statUnit}>Activa o desactiva el efecto hover sobre el logo</p>
                <button
                  type="button"
                  className={easterEggEnabled ? styles.btnConfirm : styles.btnCancel}
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    const next = !easterEggEnabled
                    easterEggService.setEnabled(next)
                    setEasterEggEnabled(next)
                    if (!next) window.dispatchEvent(new Event('e500-easter-egg-disabled'))
                  }}
                >
                  {easterEggEnabled ? 'Habilitado' : 'Deshabilitado'}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
