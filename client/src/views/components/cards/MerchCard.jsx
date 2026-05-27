import { useState } from 'react'
import { cartService } from '../../../services/cartService.js'
import styles from './MerchCard.module.css'

export default function MerchCard({ id, name, description, price, image, available, sizes = [] }) {
  const [selectedSize, setSelectedSize] = useState(sizes[0]?.name ?? sizes[0] ?? null)
  const cardClass    = [styles.card, !available ? styles.unavailable : ''].filter(Boolean).join(' ')
  const displayImage = !available ? '/img/Offline image.jpg' : image

  function handleAdd() {
    if (!available) return
    const sizeName = selectedSize
    const cartKey  = sizeName ? `${id}-${sizeName}` : id
    cartService.addProduct({
      id, name: sizeName ? `${name} (${sizeName})` : name,
      description, price, image, category: 'merch',
      cartKey, sizeName,
    })
  }

  return (
    <article className={cardClass}>
      {displayImage && (
        <div className={styles.imageWrap}>
          <img src={displayImage} alt={name} className={styles.img} loading="lazy" />
          {!available && <span className={styles.unavailableBadge}>No disponible</span>}
        </div>
      )}

      <div className={styles.body}>
        {!available && (
          <span className={styles.badge}>No disponible</span>
        )}

        <h3 className={styles.name}>{name}</h3>

        {description && <p className={styles.desc}>{description}</p>}

        {sizes.length > 0 && (
          <div className={styles.sizes}>
            {sizes.map(s => {
              const label = s.name ?? s
              return (
                <button
                  key={label}
                  type="button"
                  className={`${styles.sizeTag}${selectedSize === label ? ' ' + styles.sizeSelected : ''}`}
                  onClick={() => setSelectedSize(label)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>$ {price.toLocaleString('es-CO')}</span>
        <button
          type="button"
          className={styles.addBtn}
          disabled={!available}
          onClick={handleAdd}
        >
          + Agregar
        </button>
      </div>
    </article>
  )
}
