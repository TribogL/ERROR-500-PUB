import { useEffect, useRef, useState } from 'react'
import easterEggService from '../../../services/easterEggService.js'
import '../../../styles/easterEgg.css'

export default function EasterEgg() {
  const [glitchVisible, setGlitchVisible] = useState(false)
  const [active, setActive]               = useState(() => easterEggService.isActive())
  const timerRef = useRef(null)

  /* Oculta el glitch si el easter egg se desactiva desde settings */
  useEffect(() => {
    const handler = () => {
      setGlitchVisible(false)
      setActive(false)
    }
    window.addEventListener('e500-easter-egg-disabled', handler)
    return () => window.removeEventListener('e500-easter-egg-disabled', handler)
  }, [])

  /* Aplica pixel mode y audio cuando está activo */
  useEffect(() => {
    if (active) {
      document.body.classList.add('e500-pixel-mode')
      easterEggService.startAudio()
    }
    return () => {
      if (active) {
        document.body.classList.remove('e500-pixel-mode')
        easterEggService.stopAudio()
      }
    }
  }, [active])

  /* Engancha hover de 3s sobre el "500" del brand */
  useEffect(() => {
    if (active) return  /* en pixel mode no mostrar el popup */

    const target = document.querySelector('.nav-brand-code')
    if (!target) return

    function onEnter() {
      if (!easterEggService.isEnabled()) return
      timerRef.current = setTimeout(() => {
        if (!easterEggService.isEnabled()) return
        setGlitchVisible(true)
      }, 3000)
    }
    function onLeave() {
      clearTimeout(timerRef.current)
      setGlitchVisible(false)
    }

    target.addEventListener('mouseenter', onEnter)
    target.addEventListener('mouseleave', onLeave)

    return () => {
      clearTimeout(timerRef.current)
      target.removeEventListener('mouseenter', onEnter)
      target.removeEventListener('mouseleave', onLeave)
    }
  }, [active])

  function handleActivate() {
    easterEggService.activate()
    setActive(true)
    setGlitchVisible(false)
  }

  function handleDeactivate() {
    easterEggService.deactivate()
    setActive(false)
  }

  return (
    <>
      {/* ── Popup Glitch ── */}
      {glitchVisible && !active && (
        <div className="e500-overlay" onClick={() => setGlitchVisible(false)}>
          <div
            className="e500-glitch"
            onClick={e => { e.stopPropagation(); handleActivate() }}
            onMouseLeave={() => setGlitchVisible(false)}
          >
            <div className="e500-sprite" aria-hidden="true" />
            <p className="e500-glitch-label">[ GLITCH ]</p>
          </div>
        </div>
      )}

      {/* ── Botón OFF (solo en pixel mode) ── */}
      {active && (
        <button
          type="button"
          className="e500-off-btn"
          onClick={handleDeactivate}
        >
          [OFF]
        </button>
      )}
    </>
  )
}
