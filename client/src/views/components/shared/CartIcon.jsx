import { useEffect, useState } from 'react'
import { cartService } from '../../../services/cartService.js'
import CartDrawer from './CartDrawer.jsx'
import styles from './CartIcon.module.css'

export default function CartIcon() {
  const [count, setCount] = useState(cartService.getCount())
  const [open,  setOpen]  = useState(false)

  useEffect(() => {
    function onUpdate() { setCount(cartService.getCount()) }
    window.addEventListener('cart-updated', onUpdate)
    return () => window.removeEventListener('cart-updated', onUpdate)
  }, [])

  return (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={() => setOpen(o => !o)}
        aria-label={`Carrito — ${count} ítems`}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0l2.083 7.89A2.25 2.25 0 009.354 15h8.393a2.25 2.25 0 002.183-1.703l1.27-5.082A1.125 1.125 0 0020.106 6.75H5.106m0 0L4.5 4.5"/>
          <circle cx="9" cy="19.5" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="18" cy="19.5" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
        {count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
      </button>

      {open && <CartDrawer onClose={() => setOpen(false)} />}
    </>
  )
}
