import { useState } from 'react'
import styles from './Reserve.module.css'

const DAYS   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function toLocalMidnight(year, month, day) {
  return new Date(year, month, day)
}

export default function DatePicker({ value, onChange }) {
  const today = toLocalMidnight(
    new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
  )

  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  function prevMonth() {
    if (isCurrentMonth) return
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day) {
    const d = toLocalMidnight(viewYear, viewMonth, day)
    if (d < today) return
    const iso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(iso)
  }

  // Grid cells: empty slots then day numbers
  const firstWeekday  = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate()

  const selected = value ? toLocalMidnight(
    Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10))
  ) : null

  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <button
          type="button"
          className={styles.calNav}
          onClick={prevMonth}
          disabled={isCurrentMonth}
          aria-label="Mes anterior"
        >
          ←
        </button>
        <span className={styles.calMonth}>{MONTHS[viewMonth]} {viewYear}</span>
        <button
          type="button"
          className={styles.calNav}
          onClick={nextMonth}
          aria-label="Mes siguiente"
        >
          →
        </button>
      </div>

      <div className={styles.calWeekdays}>
        {DAYS.map(d => <span key={d} className={styles.calWeekday}>{d}</span>)}
      </div>

      <div className={styles.calGrid}>
        {cells.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />
          const d = toLocalMidnight(viewYear, viewMonth, day)
          const isPast       = d < today
          const isSelected   = selected && d.getTime() === selected.getTime()
          const isToday      = d.getTime() === today.getTime()
          let cls = styles.calDay
          if (isPast)     cls += ' ' + styles.calDayPast
          if (isSelected) cls += ' ' + styles.calDaySelected
          if (isToday && !isSelected) cls += ' ' + styles.calDayToday
          return (
            <button
              key={day}
              type="button"
              className={cls}
              disabled={isPast}
              onClick={() => selectDay(day)}
              aria-label={`${day} de ${MONTHS[viewMonth]} de ${viewYear}`}
              aria-pressed={isSelected}
            >
              {day}
            </button>
          )
        })}
      </div>

      {value && (
        <p className={styles.calSelected}>
          {selected?.toLocaleDateString('es-CO', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
      )}
    </div>
  )
}
