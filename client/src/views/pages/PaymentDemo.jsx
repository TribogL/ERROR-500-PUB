import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function PaymentDemo() {
  return (
    <main className={styles.page}>
      <div className={styles.terminal}>

        <div className={styles.termBar}>
          <span className={styles.dotRed}    />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen}  />
          <span className={styles.termTitle}>payment-gateway.exe</span>
        </div>

        <div className={styles.termBody}>
          <p className={styles.termLine}>&gt; Initializing payment module...</p>
          <p className={styles.termLine}>&gt; Connecting to payment provider...</p>
          <p className={`${styles.termLine} ${styles.errorMsg}`}>
            &gt; ERROR 503: Payment Service Unavailable
          </p>
          <p className={styles.termLine}>&nbsp;</p>
          <p className={styles.termLine}>&gt; This is a demo version.</p>
          <p className={styles.termLine}>&gt; Drinkeable Base v0.1.0-alpha</p>
          <p className={styles.termLine}>&nbsp;</p>
          <p className={styles.termLine}>&gt; Payment gateway not implemented yet.</p>
          <p className={styles.termLine}>&gt; Please wait for more foam expansions 🍺</p>
          <p className={styles.termLine}>&nbsp;</p>
          <p className={styles.termLine}>&gt; Your order has been saved as &quot;pending&quot;</p>
          <p className={styles.termLine}>&gt; A bartender will assist you shortly.</p>
          <p className={styles.termLine}>
            &gt;&nbsp;<span className={styles.cursor}>_</span>
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/products" className={styles.btnHome}>Back to bar</Link>
          <Link to="/dashboard" className={styles.btnBack}>Ver mi pedido</Link>
        </div>

      </div>
    </main>
  )
}
