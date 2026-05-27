const SONGS = [
  '500 PUB DUNGEON Portal 1.mp3',
  '500 PUB DUNGEON Portal 2.mp3',
  'ERROR 500 404 Pub Dance 1.mp3',
  'ERROR 500 404 Pub Dance 2.mp3',
  'ERROR 500 Kernel Panic Ale 1.mp3',
  'ERROR 500 Kernel Panic Ale 2.mp3',
  'ERROR 500 Midnight Debug Session 1.mp3',
  'ERROR 500 Midnight Debug Session 2.mp3',
  'ERROR 500 Neon Nights 1.mp3',
  'ERROR 500 Neon Nights 2.mp3',
  'ERROR 500 Server Crash Anthem 1.mp3',
  'ERROR 500 Server Crash Anthem 2.mp3',
  'ERROR 500 The Bug Is Awake 1.mp3',
  'ERROR 500 The Bug Is Awake 2.mp3',
  'ERROR 500 The Hidden Tavern Below 1.mp3',
  'ERROR 500 The Hidden Tavern Below 2.mp3',
]

const KEY_ACTIVE   = 'e500_pixelmode'
const KEY_INDEX    = 'e500_song_index'
const KEY_START    = 'e500_song_start'
const KEY_ENABLED  = 'e500_enabled'

const easterEggService = {
  _audio: null,

  isActive() {
    return !!localStorage.getItem(KEY_ACTIVE)
  },

  isEnabled() {
    return localStorage.getItem(KEY_ENABLED) !== '0'
  },

  setEnabled(val) {
    localStorage.setItem(KEY_ENABLED, val ? '1' : '0')
  },

  activate() {
    const idx = Math.floor(Math.random() * SONGS.length)
    localStorage.setItem(KEY_ACTIVE, '1')
    localStorage.setItem(KEY_INDEX, String(idx))
    localStorage.setItem(KEY_START, String(Date.now()))
    document.body.classList.add('e500-pixel-mode')
    window.dispatchEvent(new Event('e500-pixel-toggle'))
  },

  deactivate() {
    this.stopAudio()
    localStorage.removeItem(KEY_ACTIVE)
    localStorage.removeItem(KEY_INDEX)
    localStorage.removeItem(KEY_START)
    document.body.classList.remove('e500-pixel-mode')
    window.dispatchEvent(new Event('e500-pixel-toggle'))
  },

  startAudio() {
    const idx   = parseInt(localStorage.getItem(KEY_INDEX) ?? '0', 10)
    const start = parseInt(localStorage.getItem(KEY_START) ?? '0', 10)
    const song  = SONGS[idx % SONGS.length]

    this._audio = new Audio(`/audio/${song}`)

    this._audio.addEventListener('loadedmetadata', () => {
      const elapsed = (Date.now() - start) / 1000
      this._audio.currentTime = this._audio.duration
        ? elapsed % this._audio.duration
        : 0
      this._audio.play().catch(() => {})
    })

    this._audio.addEventListener('ended', () => { this._nextSong() })
    this._audio.addEventListener('error', () => { this._nextSong() })
  },

  stopAudio() {
    if (this._audio) {
      this._audio.pause()
      this._audio.src = ''
      this._audio = null
    }
  },

  _nextSong() {
    const current = parseInt(localStorage.getItem(KEY_INDEX) ?? '-1', 10)
    let next
    do {
      next = Math.floor(Math.random() * SONGS.length)
    } while (next === current && SONGS.length > 1)
    localStorage.setItem(KEY_INDEX, String(next))
    localStorage.setItem(KEY_START, String(Date.now()))
    if (this._audio) {
      this._audio.src = `/audio/${SONGS[next]}`
      this._audio.load()
      this._audio.play().catch(() => {})
    }
  },
}

export default easterEggService
