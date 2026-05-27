import { useEffect, useState } from 'react'
import { useSearchParams }     from 'react-router-dom'
import { api }         from '../../services/api.js'
import { CardFactory } from '../../factories/CardFactory.jsx'
import styles          from './Products.module.css'

const CATEGORIES = ['Todos', 'Beers', 'Cocktails', 'Food', 'Merch', 'Tickets']

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [tickets,  setTickets]  = useState([])
  const [filter,   setFilter]   = useState('Todos')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && CATEGORIES.includes(tab)) setFilter(tab)
  }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/tickets'),
    ])
      .then(([{ data: prods }, { data: tix }]) => {
        setProducts(prods)
        setTickets(tix)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const isTickets = filter === 'Tickets'

  const visible = isTickets
    ? tickets
    : filter === 'Todos'
      ? products
      : products.filter(p => p.category === filter)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Carta</h1>
        <p className={styles.subtitle}>Todo lo que necesitas para depurar una noche larga.</p>
      </header>

      <nav className={styles.tabsContainer} aria-label="Filtrar por categoría">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            className={`${styles.tabBtn}${filter === cat ? ' ' + styles.active : ''}`}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      {loading && <p className={styles.loading}>Cargando productos…</p>}
      {error   && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && (
        <section className={styles.grid}>
          {visible.length === 0 ? (
            <p className={styles.noResults}>
              No hay {isTickets ? 'tickets' : 'productos'} disponibles.
            </p>
          ) : isTickets ? (
            tickets.map(t =>
              CardFactory.create('ticket', {
                id:          t.id,
                name:        t.name,
                description: t.description,
                price:       t.price,
                image:       t.image,
                spots:       t.spots_available,
                available:   t.available,
              })
            )
          ) : (
            visible.map(p =>
              CardFactory.create(p.category?.toLowerCase() ?? 'food', p)
            )
          )}
        </section>
      )}
    </main>
  )
}
