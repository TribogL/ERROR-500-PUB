import { useEffect, useState } from 'react'
import { api }              from '../../../services/api.js'
import easterEggService     from '../../../services/easterEggService.js'
import { DashboardFactory } from '../../../factories/DashboardFactory.jsx'
import styles               from './Dashboard.module.css'

// ── Modal inline styles ──────────────────────────────────────────────────────
const M = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  box:     { background: 'var(--dark-brown, #1a0a00)', border: '1px solid var(--gold, #c9a84c)', borderRadius: 8, padding: '2rem', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' },
  h3:      { color: 'var(--gold, #c9a84c)', marginTop: 0, marginBottom: '1.2rem' },
  lbl:     { display: 'block', fontSize: '.78rem', color: 'var(--gold, #c9a84c)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  inp:     { width: '100%', background: 'rgba(0,0,0,.4)', border: '1px solid rgba(201,168,76,.4)', borderRadius: 4, padding: '7px 10px', color: 'var(--cream, #f5e6c8)', boxSizing: 'border-box', marginBottom: 10 },
  sel:     { width: '100%', background: '#0d0503', border: '1px solid rgba(201,168,76,.4)', borderRadius: 4, padding: '7px 10px', color: 'var(--cream, #f5e6c8)', boxSizing: 'border-box', marginBottom: 10 },
  chk:     { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  err:     { color: '#ff6b6b', fontSize: '.85rem', padding: '6px 10px', background: 'rgba(255,107,107,.1)', borderRadius: 4, borderLeft: '3px solid #ff6b6b', marginBottom: 10 },
  foot:    { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(201,168,76,.2)' },
  save:    { background: 'var(--gold, #c9a84c)', color: '#1a0a00', border: 'none', borderRadius: 4, padding: '8px 22px', cursor: 'pointer', fontWeight: 600 },
  cxl:     { background: 'transparent', color: 'var(--gold, #c9a84c)', border: '1px solid var(--gold, #c9a84c)', borderRadius: 4, padding: '8px 22px', cursor: 'pointer' },
}

function ModalShell({ title, onClose, error, onSubmit, children }) {
  return (
    <div style={M.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={M.box}>
        <h3 style={M.h3}>{title}</h3>
        {error && <div style={M.err}>{error}</div>}
        <form onSubmit={onSubmit}>
          {children}
          <div style={M.foot}>
            <button type="button" style={M.cxl} onClick={onClose}>Cancelar</button>
            <button type="submit" style={M.save}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard constants ──────────────────────────────────────────────────────
const SECTION_ICONS = {
  metrics: '◈', orders: '≡', reservations: '◷', products: '▦',
  staff: '◎', events: '◉', customers: '◻', loyalty: '✦', rewards: '◆', settings: '⚙',
}
const SECTION_LABELS = {
  metrics: 'Métricas', orders: 'Órdenes', reservations: 'Reservas', products: 'Productos',
  staff: 'Staff', events: 'Eventos', customers: 'Clientes', loyalty: 'Loyalty',
  rewards: 'Rewards', settings: 'Ajustes',
}
const STATUS_BADGE = {
  completed: styles.badgeCompleted, pending: styles.badgePending,
  cancelled:  styles.badgeCancelled, confirmed: styles.badgeConfirmed,
}
const LEVEL_LABEL = {
  level1: 'Bartender', level2: 'Manager', level3: 'Admin', staff: 'Staff', admin: 'Admin',
}

export default function AdminDashboard() {

  // ── existing state ─────────────────────────────────────────────────────────
  const [metrics,      setMetrics]      = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [reservations, setReservations] = useState([])
  const [loading,      setLoading]      = useState(true)

  // ── staff state ────────────────────────────────────────────────────────────
  const [staffList,    setStaffList]    = useState([])
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffModal,   setStaffModal]   = useState(null)   // null | 'create' | staffObj
  const [pEmail,       setPEmail]       = useState('')
  const [pFound,       setPFound]       = useState(null)
  const [pSearchErr,   setPSearchErr]   = useState('')

  // ── products state ─────────────────────────────────────────────────────────
  const [productList,    setProductList]    = useState([])
  const [productLoading, setProductLoading] = useState(false)
  const [productModal,   setProductModal]   = useState(null)   // null | 'create'
  const [productCat,     setProductCat]     = useState('beer')

  // ── events state ───────────────────────────────────────────────────────────
  const [eventList,    setEventList]    = useState([])
  const [eventLoading, setEventLoading] = useState(false)
  const [eventModal,   setEventModal]   = useState(null)   // null | 'create' | eventObj

  // ── rewards state ──────────────────────────────────────────────────────────
  const [rewardList,    setRewardList]    = useState([])
  const [rewardLoading, setRewardLoading] = useState(false)
  const [rewardModal,   setRewardModal]   = useState(null)   // null | 'create' | rewardObj

  // ── customers state ────────────────────────────────────────────────────────
  const [customerList,    setCustomerList]    = useState([])
  const [customerLoading, setCustomerLoading] = useState(false)
  const [customerModal,   setCustomerModal]   = useState(null)   // null | personObj

  // ── loyalty history state ──────────────────────────────────────────────────
  const [historyList,    setHistoryList]    = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // ── easter egg ─────────────────────────────────────────────────────────────
  const [pixelMode, setPixelMode] = useState(easterEggService.isActive())

  const [modalError, setModalError] = useState('')

  const level       = localStorage.getItem('user_level') ?? 'level1'
  const config      = DashboardFactory.createConfig(level)
  const sections    = config.getSections()
  const permissions = config.getPermissions()
  const [active, setActive] = useState(sections[0])

  // ── initial load (metrics / orders / reservations) ─────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const fetches = [
          permissions.canViewMetrics ? api.get('/admin/metrics') : Promise.resolve(null),
          api.get('/admin/orders?limit=10'),
          api.get('/admin/reservations'),
        ]
        const [metricsRes, ordersRes, reservRes] = await Promise.allSettled(fetches)
        if (metricsRes.status === 'fulfilled' && metricsRes.value) setMetrics(metricsRes.value.data)
        if (ordersRes.status  === 'fulfilled') setRecentOrders(ordersRes.value.data)
        if (reservRes.status  === 'fulfilled') setReservations(reservRes.value.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── load section data on tab switch ────────────────────────────────────────
  useEffect(() => {
    if (active === 'staff'     && permissions.canViewStaff)      loadStaff()
    if (active === 'products'  && permissions.canManageProducts) loadProducts()
    if (active === 'events'    && permissions.canManageEvents)   loadEvents()
    if (active === 'rewards'   && permissions.canManageLoyalty)  { loadRewards(); loadHistory() }
    if (active === 'customers' && permissions.canManageStaff)    loadCustomers()
    if (active === 'loyalty'   && permissions.canManageLoyalty)  loadHistory()
  }, [active])   // eslint-disable-line react-hooks/exhaustive-deps

  async function loadStaff() {
    setStaffLoading(true)
    try { const r = await api.get('/staff');           setStaffList(r.data   ?? []) } catch {}
    finally { setStaffLoading(false) }
  }
  async function loadProducts() {
    setProductLoading(true)
    try { const r = await api.get('/products');        setProductList(r.data ?? []) } catch {}
    finally { setProductLoading(false) }
  }
  async function loadEvents() {
    setEventLoading(true)
    try { const r = await api.get('/events');          setEventList(r.data   ?? []) } catch {}
    finally { setEventLoading(false) }
  }
  async function loadRewards() {
    setRewardLoading(true)
    try { const r = await api.get('/loyalty/rewards'); setRewardList(r.data  ?? []) } catch {}
    finally { setRewardLoading(false) }
  }

  async function loadCustomers() {
    setCustomerLoading(true)
    try { const r = await api.get('/persons'); setCustomerList(r.data ?? []) } catch {}
    finally { setCustomerLoading(false) }
  }
  async function loadHistory() {
    setHistoryLoading(true)
    try {
      console.log('[AdminDashboard] fetching loyalty history…')
      const r = await api.get('/loyalty/all-history')
      console.log('[AdminDashboard loyalty history]', r)
      setHistoryList(r.data ?? [])
    } catch (err) {
      console.error('[AdminDashboard loyalty history error]', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  // ── customer handler ───────────────────────────────────────────────────────
  async function handleUpdateCustomer(e) {
    e.preventDefault()
    setModalError('')
    const fd = new FormData(e.target)
    try {
      await api.patch(`/persons/${customerModal.id}`, {
        first_name: fd.get('first_name'),
        last_name:  fd.get('last_name'),
      })
      const newBalance     = Number(fd.get('loyalty_balance'))
      const currentBalance = customerModal.customers?.loyalty_balance ?? 0
      const delta          = newBalance - currentBalance
      if (delta !== 0) {
        await api.post('/loyalty/add', {
          userId:      customerModal.id,
          points:      delta,
          description: 'Ajuste manual por admin',
        })
      }
      setCustomerModal(null)
      loadCustomers()
    } catch (err) {
      setModalError(err.message)
    }
  }

  // ── reservation handlers ───────────────────────────────────────────────────
  async function handleConfirmReservation(id) {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'confirmed' })
      const res = await api.get('/reservations')
      setReservations(res.data || [])
    } catch (err) {
      console.error('Error confirming reservation:', err)
    }
  }

  async function handleCancelReservation(id) {
    if (!window.confirm('¿Cancelar esta reserva?')) return
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'cancelled' })
      const res = await api.get('/reservations')
      setReservations(res.data || [])
    } catch (err) {
      console.error('Error cancelling reservation:', err)
    }
  }

  // ── staff handlers ─────────────────────────────────────────────────────────
  async function searchPerson() {
    setPFound(null); setPSearchErr('')
    if (!pEmail.trim()) return
    try {
      const r = await api.get(`/persons?email=${encodeURIComponent(pEmail.trim())}`)
      if (r.data?.length) setPFound(r.data[0])
      else setPSearchErr('No se encontró ninguna persona con ese email.')
    } catch (err) { setPSearchErr(err.message) }
  }

  async function handleCreateStaff(e) {
    e.preventDefault(); setModalError('')
    if (!pFound) { setModalError('Busca y confirma el email primero.'); return }
    const fd = new FormData(e.target)
    try {
      await api.post('/staff', {
        personId:   pFound.id,
        level:      fd.get('level'),
        department: fd.get('department'),
      })
      setStaffModal(null); setPFound(null); setPEmail(''); loadStaff()
    } catch (err) { setModalError(err.message) }
  }

  async function handleUpdateStaff(e) {
    e.preventDefault(); setModalError('')
    const fd = new FormData(e.target)
    try {
      await api.patch(`/staff/${staffModal.id}`, {
        level:      fd.get('level'),
        department: fd.get('department'),
      })
      setStaffModal(null); loadStaff()
    } catch (err) { setModalError(err.message) }
  }

  async function handleDeleteStaff(id) {
    if (!window.confirm('¿Eliminar este miembro del staff?')) return
    try { await api.delete(`/staff/${id}`); loadStaff() }
    catch (err) { window.alert(err.message) }
  }

  // ── product handlers ───────────────────────────────────────────────────────
  async function handleCreateProduct(e) {
    e.preventDefault(); setModalError('')
    const fd  = new FormData(e.target)
    const cat = fd.get('category')
    const product = {
      name:        fd.get('name'),
      description: fd.get('description'),
      price:       Number(fd.get('price')),
      stars:       Number(fd.get('stars')),
      featured:    fd.get('featured') === 'on',
      available:   fd.get('available') === 'on',
    }
    const specific = {}
    if (cat === 'beer') {
      specific.style   = fd.get('style')
      specific.abv     = parseFloat(fd.get('abv'))  || 0
      specific.brewery = fd.get('brewery')
      specific.on_tap  = fd.get('on_tap') === 'on'
    } else if (cat === 'cocktail') {
      specific.ingredients     = fd.get('ingredients')
      specific.alcohol_content = parseFloat(fd.get('alcohol_content')) || 0
    } else if (cat === 'food') {
      specific.allergens     = fd.get('allergens')
      specific.prep_time_min = Number(fd.get('prep_time_min')) || 0
      specific.vegetarian    = fd.get('vegetarian') === 'on'
    }
    try {
      await api.post('/products', { type: cat, product, specific })
      setProductModal(null); loadProducts()
    } catch (err) { setModalError(err.message) }
  }

  async function handleToggleProduct(id) {
    try { await api.patch(`/products/${id}/toggle`); loadProducts() }
    catch (err) { window.alert(err.message) }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    try { await api.delete(`/products/${id}`); loadProducts() }
    catch (err) { window.alert(err.message) }
  }

  // ── event handlers ─────────────────────────────────────────────────────────
  function parseEventForm(fd) {
    return {
      name:     fd.get('name'),
      category: fd.get('category'),
      date:     fd.get('date'),
      time:     fd.get('time'),
      capacity: Number(fd.get('capacity')) || null,
      price:    Number(fd.get('price'))    || 0,
      free:     fd.get('free') === 'on',
      image:    fd.get('image') || null,
    }
  }

  async function handleCreateEvent(e) {
    e.preventDefault(); setModalError('')
    try { await api.post('/events', parseEventForm(new FormData(e.target))); setEventModal(null); loadEvents() }
    catch (err) { setModalError(err.message) }
  }

  async function handleUpdateEvent(e) {
    e.preventDefault(); setModalError('')
    try { await api.put(`/events/${eventModal.id}`, parseEventForm(new FormData(e.target))); setEventModal(null); loadEvents() }
    catch (err) { setModalError(err.message) }
  }

  async function handleDeleteEvent(id) {
    if (!window.confirm('¿Eliminar este evento?')) return
    try { await api.delete(`/events/${id}`); loadEvents() }
    catch (err) { window.alert(err.message) }
  }

  // ── reward handlers ────────────────────────────────────────────────────────
  function parseRewardForm(fd) {
    return {
      name:        fd.get('name'),
      description: fd.get('description'),
      lp_cost:     Number(fd.get('lp_cost')) || 0,
      stock:       Number(fd.get('stock'))   || 0,
      available:   fd.get('available') === 'on',
    }
  }

  async function handleCreateReward(e) {
    e.preventDefault(); setModalError('')
    try { await api.post('/loyalty/rewards', parseRewardForm(new FormData(e.target))); setRewardModal(null); loadRewards() }
    catch (err) { setModalError(err.message) }
  }

  async function handleUpdateReward(e) {
    e.preventDefault(); setModalError('')
    try { await api.put(`/loyalty/rewards/${rewardModal.id}`, parseRewardForm(new FormData(e.target))); setRewardModal(null); loadRewards() }
    catch (err) { setModalError(err.message) }
  }

  async function handleToggleReward(id) {
    try { await api.patch(`/loyalty/rewards/${id}`); loadRewards() }
    catch (err) { window.alert(err.message) }
  }

  if (loading) return <div className={styles.loadingState}>Cargando panel…</div>

  const levelLabel = LEVEL_LABEL[level] ?? 'Staff'

  return (
    <div className={styles.wrapper}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.profileBlock}>
          <div className={styles.avatar}>{levelLabel[0]}</div>
          <div>
            <p className={styles.profileName}>Panel de Control</p>
            <p className={styles.profileRole}>{levelLabel}</p>
          </div>
        </div>
        <nav className={styles.sidebarNav} aria-label="Secciones del panel">
          {sections.map(s => (
            <button key={s} type="button"
              className={`${styles.sidebarBtn}${active === s ? ' ' + styles.active : ''}`}
              onClick={() => setActive(s)}>
              <span className={styles.sidebarIcon}>{SECTION_ICONS[s]}</span>
              {SECTION_LABELS[s]}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>{config.getWelcomeMessage()}</h1>
        <p className={styles.pageSubtitle}>Gestión y métricas en tiempo real.</p>

        {/* ── KPIs ── */}
        {active === 'metrics' && permissions.canViewMetrics && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>KPIs</h2>
            </div>
            <div className={`${styles.statsRow} ${styles.kpiGrid}`}>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--gold)' }}>
                <p className={styles.statLabel}>Revenue hoy</p>
                <p className={styles.statValue}>$ {metrics?.revenueToday?.toLocaleString('es-CO') ?? 0}</p>
                <p className={styles.statUnit}>COP · órdenes pagadas</p>
              </div>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--copper)' }}>
                <p className={styles.statLabel}>Órdenes pendientes</p>
                <p className={styles.statValue}>{metrics?.pendingOrders ?? 0}</p>
                <p className={styles.statUnit}>por procesar</p>
              </div>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--irish)' }}>
                <p className={styles.statLabel}>Usuarios registrados</p>
                <p className={styles.statValue}>{metrics?.activeUsers ?? 0}</p>
                <p className={styles.statUnit}>personas</p>
              </div>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--cream)' }}>
                <p className={styles.statLabel}>Reservas pendientes</p>
                <p className={styles.statValue}>{metrics?.pendingReservations ?? 0}</p>
                <p className={styles.statUnit}>por confirmar</p>
              </div>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--gold)' }}>
                <p className={styles.statLabel}>Reservas hoy</p>
                <p className={styles.statValue}>{metrics?.reservationsToday ?? 0}</p>
                <p className={styles.statUnit}>para hoy</p>
              </div>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--copper)' }}>
                <p className={styles.statLabel}>Eventos próximos</p>
                <p className={styles.statValue}>{metrics?.upcomingEvents ?? 0}</p>
                <p className={styles.statUnit}>desde hoy</p>
              </div>
            </div>
          </section>
        )}

        {/* ── Órdenes ── */}
        {active === 'orders' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Órdenes recientes</h2>
            </div>
            {recentOrders.length === 0 ? (
              <p className={styles.emptyState}>Sin órdenes recientes.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th>
                    {permissions.canDelete && <th>Acciones</th>}
                  </tr></thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o.id}>
                        <td>#{o.id.slice(0, 8)}</td>
                        <td>{o.persons?.first_name} {o.persons?.last_name}</td>
                        <td>$ {o.total?.toLocaleString('es-CO')}</td>
                        <td><span className={`${styles.badge} ${STATUS_BADGE[o.status] ?? ''}`}>{o.status}</span></td>
                        <td>{new Date(o.created_at).toLocaleDateString('es-CO')}</td>
                        {permissions.canDelete && (
                          <td><button type="button" className={styles.btnCancel}>Eliminar</button></td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Reservas ── */}
        {active === 'reservations' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Reservas</h2>
            </div>
            {reservations.length === 0 ? (
              <p className={styles.emptyState}>Sin reservas registradas.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Nombre</th><th>Fecha</th><th>Hora</th><th>Personas</th><th>Estado</th><th>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {reservations.slice(0, 15).map(r => (
                      <tr key={r.id}>
                        <td className={styles.listName}>
                          {r.guest_name ?? `${r.persons?.first_name} ${r.persons?.last_name}`}
                        </td>
                        <td className={styles.listMeta}>{r.date}</td>
                        <td className={styles.listMeta}>{r.time}</td>
                        <td className={styles.listMeta}>{r.guests}</td>
                        <td>
                          <span className={`${styles.badge} ${STATUS_BADGE[r.status] ?? styles.badgePending}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className={styles.actionCell}>
                          {r.status === 'pending' && (<>
                            <button type="button" className={styles.btnConfirm}
                              onClick={() => handleConfirmReservation(r.id)}>Confirmar</button>
                            {permissions.canDelete && (
                              <button type="button" className={styles.btnCancel}
                                onClick={() => handleCancelReservation(r.id)}>Cancelar</button>
                            )}
                          </>)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Staff ── */}
        {active === 'staff' && permissions.canViewStaff && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {permissions.canManageStaff ? 'Gestión de staff' : 'Equipo'}
              </h2>
              {permissions.canManageStaff && (
                <button type="button" className={styles.btnConfirm}
                  onClick={() => {
                    setStaffModal('create'); setModalError('')
                    setPFound(null); setPEmail(''); setPSearchErr('')
                  }}>
                  + Nuevo staff
                </button>
              )}
            </div>
            {staffLoading ? (
              <p className={styles.emptyState}>Cargando…</p>
            ) : staffList.length === 0 ? (
              <p className={styles.emptyState}>No hay staff registrado.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Nombre</th><th>Email</th><th>Level</th><th>Departamento</th><th>Alta</th>
                    {permissions.canManageStaff && <th>Acciones</th>}
                  </tr></thead>
                  <tbody>
                    {staffList.map(s => (
                      <tr key={s.id}>
                        <td className={styles.listName}>{s.firstName} {s.lastName}</td>
                        <td className={styles.listMeta}>{s.email}</td>
                        <td><span className={styles.badge}>{LEVEL_LABEL[s.level] ?? s.level}</span></td>
                        <td className={styles.listMeta}>{s.department ?? '—'}</td>
                        <td className={styles.listMeta}>
                          {s.hiredAt ? new Date(s.hiredAt).toLocaleDateString('es-CO') : '—'}
                        </td>
                        {permissions.canManageStaff && (
                          <td className={styles.actionCell}>
                            <button type="button" className={styles.btnConfirm}
                              onClick={() => { setStaffModal(s); setModalError('') }}>
                              Editar
                            </button>
                            <button type="button" className={styles.btnCancel}
                              onClick={() => handleDeleteStaff(s.id)}>
                              Eliminar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Productos ── */}
        {active === 'products' && permissions.canManageProducts && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Gestión de productos</h2>
              <button type="button" className={styles.btnConfirm}
                onClick={() => { setProductModal('create'); setProductCat('beer'); setModalError('') }}>
                + Nuevo producto
              </button>
            </div>
            {productLoading ? (
              <p className={styles.emptyState}>Cargando…</p>
            ) : productList.length === 0 ? (
              <p className={styles.emptyState}>No hay productos registrados.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Nombre</th><th>Tipo</th><th>Precio</th><th>Disponible</th><th>Destacado</th><th>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {productList.map(p => (
                      <tr key={p.id}>
                        <td className={styles.listName}>{p.name}</td>
                        <td className={styles.listMeta}>{p.type}</td>
                        <td>$ {p.price?.toLocaleString('es-CO')}</td>
                        <td>
                          <span className={`${styles.badge} ${p.available ? styles.badgeConfirmed : styles.badgeCancelled}`}>
                            {p.available ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className={styles.listMeta}>{p.featured ? '★' : '—'}</td>
                        <td className={styles.actionCell}>
                          <button type="button" className={styles.btnConfirm}
                            onClick={() => handleToggleProduct(p.id)}>Toggle</button>
                          <button type="button" className={styles.btnCancel}
                            onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Eventos ── */}
        {active === 'events' && permissions.canManageEvents && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Eventos</h2>
              <button type="button" className={styles.btnConfirm}
                onClick={() => { setEventModal('create'); setModalError('') }}>
                + Nuevo evento
              </button>
            </div>
            {eventLoading ? (
              <p className={styles.emptyState}>Cargando…</p>
            ) : eventList.length === 0 ? (
              <p className={styles.emptyState}>No hay eventos registrados.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Nombre</th><th>Categoría</th><th>Fecha</th><th>Hora</th>
                    <th>Capacidad</th><th>Precio</th><th>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {eventList.map(ev => (
                      <tr key={ev.id}>
                        <td className={styles.listName}>{ev.name}</td>
                        <td className={styles.listMeta}>{ev.category}</td>
                        <td className={styles.listMeta}>{ev.date}</td>
                        <td className={styles.listMeta}>{ev.time}</td>
                        <td className={styles.listMeta}>{ev.capacity ?? '—'}</td>
                        <td>{ev.free ? 'Gratis' : `$ ${ev.price?.toLocaleString('es-CO')}`}</td>
                        <td className={styles.actionCell}>
                          <button type="button" className={styles.btnConfirm}
                            onClick={() => { setEventModal(ev); setModalError('') }}>Editar</button>
                          {permissions.canDelete && (
                            <button type="button" className={styles.btnCancel}
                              onClick={() => handleDeleteEvent(ev.id)}>Eliminar</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Rewards ── */}
        {active === 'rewards' && permissions.canManageLoyalty && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Rewards</h2>
              <button type="button" className={styles.btnConfirm}
                onClick={() => { setRewardModal('create'); setModalError('') }}>
                + Nueva reward
              </button>
            </div>
            {rewardLoading ? (
              <p className={styles.emptyState}>Cargando…</p>
            ) : rewardList.length === 0 ? (
              <p className={styles.emptyState}>No hay rewards registradas.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Nombre</th><th>Descripción</th><th>LP Cost</th><th>Stock</th><th>Disponible</th><th>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {rewardList.map(rw => (
                      <tr key={rw.id}>
                        <td className={styles.listName}>{rw.name}</td>
                        <td className={styles.listMeta}>{rw.description}</td>
                        <td>{rw.lp_cost}</td>
                        <td>{rw.stock}</td>
                        <td>
                          <span className={`${styles.badge} ${rw.available ? styles.badgeConfirmed : styles.badgeCancelled}`}>
                            {rw.available ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td className={styles.actionCell}>
                          <button type="button" className={styles.btnConfirm}
                            onClick={() => { setRewardModal(rw); setModalError('') }}>Editar</button>
                          <button type="button" className={styles.btnConfirm}
                            onClick={() => handleToggleReward(rw.id)}>Toggle</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Loyalty (historial) ── */}
        {active === 'loyalty' && permissions.canManageLoyalty && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Historial de puntos</h2>
            </div>
            {historyLoading ? (
              <p className={styles.emptyState}>Cargando…</p>
            ) : historyList.length === 0 ? (
              <p className={styles.emptyState}>Sin transacciones registradas.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Usuario</th><th>Puntos</th><th>Tipo</th><th>Descripción</th><th>Fecha</th>
                  </tr></thead>
                  <tbody>
                    {historyList.map(tx => (
                      <tr key={tx.id}>
                        <td className={styles.listName}>
                          {tx.persons?.first_name} {tx.persons?.last_name}
                        </td>
                        <td style={{ color: tx.points > 0 ? 'var(--irish)' : '#ff6b6b' }}>
                          {tx.points > 0 ? `+${tx.points}` : tx.points}
                        </td>
                        <td className={styles.listMeta}>{tx.type ?? '—'}</td>
                        <td className={styles.listMeta}>{tx.description ?? tx.reason ?? '—'}</td>
                        <td className={styles.listMeta}>
                          {new Date(tx.created_at).toLocaleDateString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Clientes ── */}
        {active === 'customers' && permissions.canManageStaff && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Clientes</h2>
            </div>
            {customerLoading ? (
              <p className={styles.emptyState}>Cargando…</p>
            ) : customerList.length === 0 ? (
              <p className={styles.emptyState}>No hay clientes registrados.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead><tr>
                    <th>Nombre</th><th>Email</th><th>LP Balance</th><th>Miembro desde</th><th>Registrado</th><th>Acciones</th>
                  </tr></thead>
                  <tbody>
                    {customerList.map(c => (
                      <tr key={c.id}>
                        <td className={styles.listName}>{c.first_name} {c.last_name}</td>
                        <td className={styles.listMeta}>{c.email}</td>
                        <td className={styles.listMeta}>{c.customers?.loyalty_balance ?? 0}</td>
                        <td className={styles.listMeta}>
                          {c.customers?.member_since
                            ? new Date(c.customers.member_since).toLocaleDateString('es-CO')
                            : '—'}
                        </td>
                        <td className={styles.listMeta}>
                          {c.created_at ? new Date(c.created_at).toLocaleDateString('es-CO') : '—'}
                        </td>
                        <td className={styles.actionCell}>
                          <button type="button" className={styles.btnConfirm}
                            onClick={() => { setCustomerModal(c); setModalError('') }}>
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Ajustes ── */}
        {active === 'settings' && permissions.canManageStaff && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ajustes del sistema</h2>
            </div>
            <div className={styles.statsRow}>
              <div className={styles.statCard} style={{ '--accent-bar': 'var(--copper)' }}>
                <p className={styles.statLabel}>Modo Pixel</p>
                <p className={styles.statUnit}>Easter egg: activa el tema retro con música</p>
                <button
                  type="button"
                  className={pixelMode ? styles.btnCancel : styles.btnConfirm}
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    if (easterEggService.isActive()) {
                      easterEggService.deactivate()
                      easterEggService.setEnabled(false)
                      window.dispatchEvent(new Event('e500-easter-egg-disabled'))
                    } else {
                      easterEggService.setEnabled(true)
                      easterEggService.activate()
                    }
                    setPixelMode(easterEggService.isActive())
                  }}
                >
                  {pixelMode ? 'Desactivar Pixel Mode' : 'Activar Pixel Mode'}
                </button>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════ */}

      {/* ── Staff: Crear ── */}
      {staffModal === 'create' && (
        <ModalShell title="Nuevo staff" onClose={() => setStaffModal(null)}
          error={modalError} onSubmit={handleCreateStaff}>
          <label style={M.lbl}>Email de la persona</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            <input style={{ ...M.inp, flex: 1, marginBottom: 0 }} type="email"
              value={pEmail} onChange={e => setPEmail(e.target.value)}
              placeholder="persona@example.com"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), searchPerson())} />
            <button type="button" style={M.save} onClick={searchPerson}>Buscar</button>
          </div>
          {pSearchErr && (
            <p style={{ color: '#ff6b6b', fontSize: '.83rem', margin: '4px 0 8px' }}>{pSearchErr}</p>
          )}
          {pFound && (
            <p style={{ color: '#66bb6a', fontSize: '.83rem', margin: '4px 0 10px' }}>
              ✓ {pFound.first_name} {pFound.last_name}
            </p>
          )}
          <label style={M.lbl}>Level</label>
          <select style={M.sel} name="level" required>
            <option value="level1">Bartender (level1)</option>
            <option value="level2">Manager (level2)</option>
            <option value="level3">Admin (level3)</option>
          </select>
          <label style={M.lbl}>Departamento</label>
          <input style={M.inp} name="department" placeholder="Bar, Cocina, Sala…" />
        </ModalShell>
      )}

      {/* ── Staff: Editar ── */}
      {staffModal && staffModal !== 'create' && (
        <ModalShell title="Editar staff" onClose={() => setStaffModal(null)}
          error={modalError} onSubmit={handleUpdateStaff}>
          <p style={{ color: 'var(--cream,#f5e6c8)', opacity: .65, marginTop: 0, marginBottom: 14 }}>
            {staffModal.firstName} {staffModal.lastName} · {staffModal.email}
          </p>
          <label style={M.lbl}>Level</label>
          <select style={M.sel} name="level" defaultValue={staffModal.level} required>
            <option value="level1">Bartender (level1)</option>
            <option value="level2">Manager (level2)</option>
            <option value="level3">Admin (level3)</option>
          </select>
          <label style={M.lbl}>Departamento</label>
          <input style={M.inp} name="department" defaultValue={staffModal.department ?? ''} />
        </ModalShell>
      )}

      {/* ── Producto: Crear ── */}
      {productModal === 'create' && (
        <ModalShell title="Nuevo producto" onClose={() => setProductModal(null)}
          error={modalError} onSubmit={handleCreateProduct}>
          <label style={M.lbl}>Nombre</label>
          <input style={M.inp} name="name" required />
          <label style={M.lbl}>Descripción</label>
          <input style={M.inp} name="description" />
          <label style={M.lbl}>Precio (COP)</label>
          <input style={M.inp} name="price" type="number" min="0" required />
          <label style={M.lbl}>Categoría</label>
          <select style={M.sel} name="category" value={productCat}
            onChange={e => setProductCat(e.target.value)} required>
            <option value="beer">Cerveza</option>
            <option value="cocktail">Cóctel</option>
            <option value="food">Comida</option>
            <option value="merch">Merch</option>
          </select>
          <label style={M.lbl}>Estrellas</label>
          <select style={M.sel} name="stars" defaultValue="5">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <div style={M.chk}>
            <input type="checkbox" name="featured" id="pFeat" />
            <label htmlFor="pFeat" style={{ color: 'var(--cream,#f5e6c8)' }}>Destacado</label>
          </div>
          <div style={M.chk}>
            <input type="checkbox" name="available" id="pAvail" defaultChecked />
            <label htmlFor="pAvail" style={{ color: 'var(--cream,#f5e6c8)' }}>Disponible</label>
          </div>
          {productCat === 'beer' && <>
            <label style={M.lbl}>Estilo</label>
            <input style={M.inp} name="style" placeholder="IPA, Lager, Stout…" />
            <label style={M.lbl}>ABV (%)</label>
            <input style={M.inp} name="abv" type="number" step="0.1" min="0" />
            <label style={M.lbl}>Cervecería</label>
            <input style={M.inp} name="brewery" />
            <div style={M.chk}>
              <input type="checkbox" name="on_tap" id="pTap" />
              <label htmlFor="pTap" style={{ color: 'var(--cream,#f5e6c8)' }}>De grifo</label>
            </div>
          </>}
          {productCat === 'cocktail' && <>
            <label style={M.lbl}>Ingredientes</label>
            <input style={M.inp} name="ingredients" placeholder="Ron, lima, azúcar…" />
            <label style={M.lbl}>Contenido alcohólico (%)</label>
            <input style={M.inp} name="alcohol_content" type="number" step="0.1" min="0" />
          </>}
          {productCat === 'food' && <>
            <label style={M.lbl}>Alérgenos</label>
            <input style={M.inp} name="allergens" placeholder="Gluten, lactosa…" />
            <label style={M.lbl}>Tiempo de preparación (min)</label>
            <input style={M.inp} name="prep_time_min" type="number" min="0" />
            <div style={M.chk}>
              <input type="checkbox" name="vegetarian" id="pVeg" />
              <label htmlFor="pVeg" style={{ color: 'var(--cream,#f5e6c8)' }}>Vegetariano</label>
            </div>
          </>}
        </ModalShell>
      )}

      {/* ── Evento: Crear / Editar ── */}
      {eventModal && (() => {
        const ev    = eventModal !== 'create' ? eventModal : null
        const isNew = eventModal === 'create'
        return (
          <ModalShell title={isNew ? 'Nuevo evento' : 'Editar evento'}
            onClose={() => setEventModal(null)} error={modalError}
            onSubmit={isNew ? handleCreateEvent : handleUpdateEvent}>
            <label style={M.lbl}>Nombre</label>
            <input style={M.inp} name="name" defaultValue={ev?.name ?? ''} required />
            <label style={M.lbl}>Categoría</label>
            <input style={M.inp} name="category" defaultValue={ev?.category ?? ''} placeholder="Live Music, DJ, Trivia…" />
            <label style={M.lbl}>Fecha</label>
            <input style={M.inp} name="date" type="date" defaultValue={ev?.date ?? ''} required />
            <label style={M.lbl}>Hora</label>
            <input style={M.inp} name="time" type="time" defaultValue={ev?.time ?? ''} />
            <label style={M.lbl}>Capacidad</label>
            <input style={M.inp} name="capacity" type="number" min="0" defaultValue={ev?.capacity ?? ''} />
            <label style={M.lbl}>Precio (COP)</label>
            <input style={M.inp} name="price" type="number" min="0" defaultValue={ev?.price ?? 0} />
            <div style={M.chk}>
              <input type="checkbox" name="free" id="evFree" defaultChecked={ev?.free ?? false} />
              <label htmlFor="evFree" style={{ color: 'var(--cream,#f5e6c8)' }}>Gratuito</label>
            </div>
            <label style={M.lbl}>URL imagen</label>
            <input style={M.inp} name="image" defaultValue={ev?.image ?? ''} placeholder="/img/event.jpg" />
          </ModalShell>
        )
      })()}

      {/* ── Reward: Crear / Editar ── */}
      {rewardModal && (() => {
        const rw    = rewardModal !== 'create' ? rewardModal : null
        const isNew = rewardModal === 'create'
        return (
          <ModalShell title={isNew ? 'Nueva reward' : 'Editar reward'}
            onClose={() => setRewardModal(null)} error={modalError}
            onSubmit={isNew ? handleCreateReward : handleUpdateReward}>
            <label style={M.lbl}>Nombre</label>
            <input style={M.inp} name="name" defaultValue={rw?.name ?? ''} required />
            <label style={M.lbl}>Descripción</label>
            <input style={M.inp} name="description" defaultValue={rw?.description ?? ''} />
            <label style={M.lbl}>LP Cost</label>
            <input style={M.inp} name="lp_cost" type="number" min="0" defaultValue={rw?.lp_cost ?? ''} required />
            <label style={M.lbl}>Stock</label>
            <input style={M.inp} name="stock" type="number" min="0" defaultValue={rw?.stock ?? ''} />
            <div style={M.chk}>
              <input type="checkbox" name="available" id="rwAvail" defaultChecked={rw?.available ?? true} />
              <label htmlFor="rwAvail" style={{ color: 'var(--cream,#f5e6c8)' }}>Disponible</label>
            </div>
          </ModalShell>
        )
      })()}

      {/* ── Cliente: Editar ── */}
      {customerModal && (
        <ModalShell title="Editar cliente" onClose={() => setCustomerModal(null)}
          error={modalError} onSubmit={handleUpdateCustomer}>
          <p style={{ color: 'var(--cream,#f5e6c8)', opacity: .65, marginTop: 0, marginBottom: 14 }}>
            {customerModal.email}
          </p>
          <label style={M.lbl}>Nombre</label>
          <input style={M.inp} name="first_name" defaultValue={customerModal.first_name ?? ''} required />
          <label style={M.lbl}>Apellido</label>
          <input style={M.inp} name="last_name" defaultValue={customerModal.last_name ?? ''} />
          {permissions.canManageLoyalty && (
            <>
              <label style={M.lbl}>LP Balance</label>
              <input style={M.inp} name="loyalty_balance" type="number" min="0"
                defaultValue={customerModal.customers?.loyalty_balance ?? 0} />
            </>
          )}
        </ModalShell>
      )}

    </div>
  )
}
