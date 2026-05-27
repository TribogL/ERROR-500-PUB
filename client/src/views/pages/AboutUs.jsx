import styles from './AboutUs.module.css'

const STATS = [
  { value: '2026', label: 'Fundado'            },
  { value: '500+', label: 'Cervezas servidas'  },
  { value: '20+',  label: 'Eventos realizados' },
  { value: '7',    label: 'Días a la semana'   },
]

const VALUES = [
  { icon: '◎', title: 'Open source',         text: 'La barra siempre está abierta. Sin gatekeeping.'                                       },
  { icon: '⟳', title: 'Zero downtime',       text: 'Operamos los 7 días, como un buen servidor.'                                           },
  { icon: '⌥', title: 'No bugs, solo features', text: 'Lo que otros llaman problemas, nosotros los llamamos sabores especiales.'            },
]

const TEAM = [
  { name: 'Julian Forero',   role: 'Fundador & CEO',                     initials: 'JF' },
  { name: 'Zephyr Hexbyte',  role: 'Head of Drinks',                     initials: 'ZX' },
  { name: 'Nova Voltaire',   role: 'Events Manager',                     initials: 'NV' },
  { name: 'Rune Glitchwood', role: 'Head of Security',                   initials: 'RG' },
  { name: 'Claude',          role: 'Creative & Organized Digital Assistant', initials: 'CL', avatarColor: 'var(--copper)' },
]

export default function AboutUs() {
  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.orb1} aria-hidden="true" />
        <div className={styles.orb2} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Nuestra historia</p>
          <h1 className={styles.heroTitle}>
            Error 500<br />Internal Server Bar
          </h1>
          <p className={styles.heroLead}>
            Nació en 2026 de una idea simple: un espacio donde la comunidad tech
            pudiera desconectarse del teclado y conectarse entre personas,
            con buena cerveza de por medio.
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className={styles.statsStrip}>
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Story ── */}
      <section className={styles.storySection}>
        <div className={styles.storyText}>
          <h2 className={styles.sectionTitle}>La historia</h2>
          <p>
            Empezamos como un pop-up en una hackathon y terminamos abriendo
            nuestro local en el corazón del barrio tech. Hoy somos el punto de
            encuentro favorito de devs, diseñadores y founders de la ciudad.
          </p>
          <p>
            Lo que empezó con tres amigos y un proyector prestado, hoy es
            un bar con carta curada, eventos semanales y la comunidad más nerd
            de la escena. Si compila y sabe bien, lo ponemos en la carta.
          </p>
        </div>
        <div className={styles.storyImages}>
          <div className={styles.storyImg}
            style={{ backgroundImage: "url('/img/Arcade Nigth.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className={`${styles.storyImg} ${styles.storyImgSmall}`}
            style={{ backgroundImage: "url('/img/Synthwave Night.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection}>
        <h2 className={styles.sectionTitle}>Nuestros valores</h2>
        <div className={styles.valuesGrid}>
          {VALUES.map(v => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueName}>{v.title}</h3>
              <p className={styles.valueText}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>El equipo</h2>
        <div className={styles.teamGrid}>
          {TEAM.map(m => (
            <div key={m.name} className={styles.teamCard}>
              <div
                className={styles.teamAvatar}
                style={m.avatarColor ? { background: m.avatarColor } : undefined}
              >
                {m.initials}
              </div>
              <p className={styles.teamName}>{m.name}</p>
              <p className={styles.teamRole}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={styles.gallerySection}>
        <h2 className={styles.sectionTitle}>Galería</h2>
        <div className={styles.galleryGrid}>
          <div className={`${styles.galleryItem} ${styles.galleryFeatured}`}
            style={{ backgroundImage: "url('/img/Bug & Brew.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className={styles.galleryItem}
            style={{ backgroundImage: "url('/img/Error 404 Party.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className={styles.galleryItem}
            style={{ backgroundImage: "url('/img/Imperial Stout.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className={styles.galleryItem}
            style={{ backgroundImage: "url('/img/Runtime Error.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className={styles.galleryItem}
            style={{ backgroundImage: "url('/img/Debug Board.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      </section>

      {/* ── Location ── */}
      <section className={styles.locationSection}>
        <div className={styles.mapPlaceholder}>
          <span className={styles.mapIcon}>◈</span>
          <p>Calle 10 # 43B-15, El Poblado, Medellín</p>
        </div>
        <div className={styles.locationInfo}>
          <h2 className={styles.sectionTitle}>Encuéntranos</h2>
          <address className={styles.address}>
            <p>Calle 10 # 43B-15, El Poblado, Medellín</p>
            <p>Lunes a viernes: 4pm — 2am</p>
            <p>Sábados y domingos: 12pm — 3am</p>
            <a href="mailto:hola@error500.bar" className={styles.email}>
              hola@error500.bar
            </a>
          </address>
        </div>
      </section>
    </main>
  )
}
