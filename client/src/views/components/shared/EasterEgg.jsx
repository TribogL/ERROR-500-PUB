import { useEffect, useState } from 'react'
import easterEggService from '../../../services/easterEggService.js'
import '../../../styles/easterEgg.css'

export default function EasterEgg() {
  const [glitchVisible, setGlitchVisible] = useState(false)
  const [active, setActive]               = useState(() => easterEggService.isActive())
  const [btnShift, setBtnShift]           = useState(false)

  /* Restaurar audio si el pixel mode ya estaba activo al montar */
  useEffect(() => {
    if (easterEggService.isActive()) {
      document.body.classList.add('e500-pixel-mode')
      easterEggService.startAudio()
    }
    return () => { easterEggService.stopAudio() }
  }, [])

  /* Desplaza el botón [OFF] cuando el CartDrawer está abierto */
  useEffect(() => {
    const onOpen  = () => setBtnShift(true)
    const onClose = () => setBtnShift(false)
    window.addEventListener('cart-opened', onOpen)
    window.addEventListener('cart-closed', onClose)
    return () => {
      window.removeEventListener('cart-opened', onOpen)
      window.removeEventListener('cart-closed', onClose)
    }
  }, [])

  /* Oculta el glitch si el easter egg hover se deshabilita desde settings */
  useEffect(() => {
    const handler = () => {
      setGlitchVisible(false)
      // pixel mode no se toca — el usuario usa el botón [OFF] flotante para eso
    }
    window.addEventListener('e500-easter-egg-disabled', handler)
    return () => window.removeEventListener('e500-easter-egg-disabled', handler)
  }, [])

  /* Detectar hover sobre el "500" del navbar — reintenta hasta encontrar el elemento */
  useEffect(() => {
    let retryId = null

    const attach = () => {
      // Intentar con .nav-brand-code primero, fallback a .nav-brand
      let target = document.querySelector('.nav-brand-code')
      if (!target) target = document.querySelector('.nav-brand')

      if (!target) {
        retryId = setTimeout(attach, 200)
        return
      }

      console.log('[EasterEgg] attaching to:', target)

      let hoverTimer = null

      const onEnter = () => {
        if (!easterEggService.isEnabled()) return
        if (easterEggService.isActive()) return
        console.log('[EasterEgg] hover start')
        hoverTimer = setTimeout(() => {
          if (!easterEggService.isEnabled()) return
          if (easterEggService.isActive()) return
          console.log('[EasterEgg] glitch show!')
          setGlitchVisible(true)
        }, 3000)
      }

      const onLeave = () => {
        if (hoverTimer) { clearTimeout(hoverTimer); hoverTimer = null }
        setGlitchVisible(false)
      }

      target.addEventListener('mouseenter', onEnter)
      target.addEventListener('mouseleave', onLeave)
      target.addEventListener('pointerenter', onEnter)
      target.addEventListener('pointerleave', onLeave)

      cleanup = () => {
        if (hoverTimer) clearTimeout(hoverTimer)
        target.removeEventListener('mouseenter', onEnter)
        target.removeEventListener('mouseleave', onLeave)
        target.removeEventListener('pointerenter', onEnter)
        target.removeEventListener('pointerleave', onLeave)
      }
    }

    let cleanup = null
    attach()

    return () => {
      if (retryId) clearTimeout(retryId)
      if (cleanup) cleanup()
    }
  }, [])

  const handleActivate = () => {
    setGlitchVisible(false)
    setActive(true)
    easterEggService.activate()
    easterEggService.startAudio()
  }

  const handleDeactivate = () => {
    setActive(false)
    easterEggService.deactivate()   // stopAudio() + localStorage + body class + event
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
          className={`e500-off-btn${btnShift ? ' cart-open' : ''}`}
          onClick={handleDeactivate}
        >
          [OFF]
        </button>
      )}
    </>
  )
}
