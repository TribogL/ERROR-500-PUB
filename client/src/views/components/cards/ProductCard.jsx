import { useEffect, useState } from 'react'
import { cartService } from '../../../services/cartService.js'
import styles from './ProductCard.module.css'

const ACCENT = {
  beers:     'var(--gold)',
  cocktails: 'var(--copper)',
  food:      'var(--irish)',
  merch:     'var(--cream)',
}

export default function ProductCard({
  id, name, description, price, image, imagePixel, available, featured,
  stars = 0, category, style, abv, brewery, onTap, ingredients
}) {
  const [isPixelMode, setIsPixelMode] = useState(
    document.body.classList.contains('e500-pixel-mode')
  )

  useEffect(() => {
    const handler = () => setIsPixelMode(document.body.classList.contains('e500-pixel-mode'))
    window.addEventListener('e500-pixel-toggle', handler)
    return () => window.removeEventListener('e500-pixel-toggle', handler)
  }, [])

  console.log('ProductCard props:', { name, image, imagePixel, isPixelMode })

  const accent    = ACCENT[category?.toLowerCase()] ?? 'var(--gold)'
  const cardClass = [styles.card, !available ? styles.unavailable : ''].filter(Boolean).join(' ')
  const displayImage = !available
    ? '/img/Offline image.jpg'
    : (isPixelMode && imagePixel ? imagePixel : image)

  const tags = [
    style    && style,
    abv      && `${abv}% ABV`,
    brewery  && brewery,
    onTap    && 'En grifo',
    ingredients && ingredients,
  ].filter(Boolean)

  function handleAdd() {
    if (!available) return
    cartService.addProduct({ id, name, description, price, image, category })
  }

  return (
    <article className={cardClass} style={{ '--accent-bar': accent }}>
      {displayImage && (
        <div className={styles.imageWrap}>
          <img src={displayImage} alt={name} className={styles.img} loading="lazy" />
          {!available && <span className={styles.unavailableBadge}>No disponible</span>}
        </div>
      )}

      <div className={styles.body}>
        {(featured || !available) && (
          <div className={styles.badges}>
            {featured   && <span className={`${styles.badge} ${styles.badgeFeatured}`}>Destacado</span>}
            {!available && <span className={`${styles.badge} ${styles.badgeUnavailable}`}>No disponible</span>}
          </div>
        )}

        <h3 className={styles.name}>{name}</h3>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        )}

        {description && <p className={styles.desc}>{description}</p>}
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>
          {price === 0 ? 'Gratis' : `$ ${price.toLocaleString('es-CO')}`}
        </span>
        <div className={styles.footerRight}>
          <div className={styles.stars} aria-label={`${stars} de 5 estrellas`}>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < stars ? styles.starFull : styles.starEmpty}>★</span>
            ))}
          </div>
          <button
            type="button"
            className={styles.addBtn}
            disabled={!available}
            onClick={handleAdd}
          >
            + Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
