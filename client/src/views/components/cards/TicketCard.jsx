import { cartService } from '../../../services/cartService.js'
import styles from './TicketCard.module.css'

export default function TicketCard({
  id, name, description, price, image,
  eventName, eventDate, available,
  spots = null, maxSpots = null,
  onBuy,
}) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null

  let spotsClass = styles.spotsOk
  let spotsLabel = spots !== null ? `${spots} cupos` : null
  if (spots !== null) {
    if (spots === 0) {
      spotsClass = styles.spotsNone
      spotsLabel = 'Agotado'
    } else if (maxSpots !== null && spots / maxSpots < 0.2) {
      spotsClass = styles.spotsLow
      spotsLabel = `${spots} cupos restantes`
    }
  }

  const soldOut = !available || spots === 0

  return (
    <article className={styles.card}>
      {image && (
        <div className={styles.imageWrap}>
          <img src={image} alt={name} className={styles.img} loading="lazy" />
        </div>
      )}

      <div className={styles.body}>
        {soldOut && (
          <span className={styles.badge}>Agotado</span>
        )}

        <h3 className={styles.name}>{name}</h3>

        {eventName && <p className={styles.eventName}>{eventName}</p>}

        {(formattedDate || spotsLabel) && (
          <div className={styles.ticketInfo}>
            {formattedDate && <span className={styles.date}>{formattedDate}</span>}
            {spotsLabel    && <span className={spotsClass}>{spotsLabel}</span>}
          </div>
        )}

        {description && <p className={styles.desc}>{description}</p>}
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>
          {price === 0 ? 'Entrada libre' : `$ ${price?.toLocaleString('es-CO')}`}
        </span>
      </div>

      <button
        type="button"
        className={styles.eventBtn}
        disabled={soldOut}
        onClick={() => {
          if (!soldOut) cartService.addTicket({ id, name, description, price, image, spots })
          onBuy?.(id)
        }}
      >
        {soldOut ? 'Agotado' : price === 0 ? 'Apartar cupo' : 'Comprar entrada'}
      </button>
    </article>
  )
}
