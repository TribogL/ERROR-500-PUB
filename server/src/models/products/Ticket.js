// Ticket NO hereda de Product — es independiente
class Ticket {
  constructor({ id, eventId, name, description, price, image,
                available, spotsAvailable, createdAt }) {
    this.id             = id
    this.eventId        = eventId
    this.name           = name
    this.description    = description
    this.price          = price ?? 0
    this.image          = image
    this.available      = available ?? true
    this.spotsAvailable = spotsAvailable ?? 0
    this.createdAt      = createdAt
  }
  getCategory()     { return 'Tickets' }
  isSoldOut()       { return this.spotsAvailable <= 0 || !this.available }
  getDisplayPrice() { return this.price === 0 ? 'Free entry' : `$ ${this.price.toLocaleString('es-CO')}` }
  toJSON()          { return { ...this } }
}
module.exports = Ticket
