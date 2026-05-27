import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartService } from '../../../services/cartService.js'
import { authService }  from '../../../services/authService.js'
import { api }          from '../../../services/api.js'
import { OrderBuilder } from '../../../builders/OrderBuilder.js'
import styles from './CartDrawer.module.css'

export default function CartDrawer({ onClose }) {
  const navigate = useNavigate()
  const [items,   setItems]   = useState(cartService.getItems())
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    window.dispatchEvent(new Event('cart-opened'))
    return () => window.dispatchEvent(new Event('cart-closed'))
  }, [])

  useEffect(() => {
    function onUpdate() { setItems(cartService.getItems()) }
    window.addEventListener('cart-updated', onUpdate)
    return () => window.removeEventListener('cart-updated', onUpdate)
  }, [])

  // Close drawer on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const total = cartService.getTotal()

  async function handleConfirm() {
    setError(null)
    const session = await authService.getSession()
    if (!session) {
      onClose()
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      const userId  = session.user.id
      const builder = new OrderBuilder()
      builder.setCustomer(userId)

      items.forEach(item => {
        if (item.type === 'ticket') {
          builder.addTicket(item.id, item.quantity, item.price)
        } else {
          builder.addProduct(item.id, item.quantity, item.price, item.sizeName ?? null)
        }
      })

      const order = builder.build()
      await api.post('/orders', order)
      cartService.clear()
      onClose()
      navigate('/payment-demo')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.drawer} role="dialog" aria-label="Carrito de compras" aria-modal="true">

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Carrito</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◯</span>
            <span>El carrito está vacío</span>
          </div>
        ) : (
          <ul className={styles.items}>
            {items.map(item => {
              const key = item.cartKey ?? item.id
              return (
                <li key={key} className={styles.item}>
                  {item.image
                    ? <img src={item.image} alt={item.name} className={styles.itemImg} />
                    : <div className={styles.itemImgPlaceholder} />
                  }
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>
                      x{item.quantity}
                      {item.type === 'ticket' && ' · Entrada'}
                    </p>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemPrice}>
                      $ {(item.price * item.quantity).toLocaleString('es-CO')}
                    </span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => cartService.removeItem(key)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>$ {total.toLocaleString('es-CO')}</span>
          </div>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <button
            type="button"
            className={styles.confirmBtn}
            disabled={items.length === 0 || loading}
            onClick={handleConfirm}
          >
            {loading ? 'Procesando…' : 'Confirmar pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}
