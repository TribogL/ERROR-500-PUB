/**
 * ReservationBuilder — Builder Pattern
 */
class ReservationBuilder {
  constructor() { this.reset() }

  reset() {
    this._reservation = {
      personId: null, guestName: null, guestDni: null,
      guestPhone: null, date: null, time: null,
      guests: 1, section: null, note: null, status: 'pending'
    }
    return this
  }

  setAuthUser(personId) {
    this._reservation.personId = personId
    return this
  }

  setGuest(name, dni, phone) {
    this._reservation.guestName  = name
    this._reservation.guestDni   = dni
    this._reservation.guestPhone = phone
    return this
  }

  setDateTime(date, time)  { this._reservation.date = date; this._reservation.time = time; return this }
  setGuests(n)             { this._reservation.guests = n; return this }
  setSection(section)      { this._reservation.section = section; return this }
  setNote(note)            { this._reservation.note = note; return this }

  build() {
    if (!this._reservation.date)    throw new Error('ReservationBuilder: falta fecha')
    if (!this._reservation.time)    throw new Error('ReservationBuilder: falta hora')
    if (!this._reservation.section) throw new Error('ReservationBuilder: falta sección')
    if (!this._reservation.personId && !this._reservation.guestPhone)
      throw new Error('ReservationBuilder: debe tener usuario o datos de invitado')
    const result = { ...this._reservation }
    this.reset()
    return result
  }
}

module.exports = ReservationBuilder
