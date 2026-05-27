export class OrderBuilder {
  constructor() { this.reset() }

  reset() {
    this._order = {
      personId:   null,
      items:      [],
      total:      0,
      lpRedeemed: 0,
      status:     'pending'
    }
    return this
  }

  setCustomer(personId) {
    this._order.personId = personId
    return this
  }

  addProduct(productId, quantity, unitPrice, sizeName = null) {
    this._order.items.push({
      itemType: 'product', productId,
      ticketId: null, quantity, unitPrice, sizeName
    })
    this._order.total += unitPrice * quantity
    return this
  }

  addTicket(ticketId, quantity, unitPrice) {
    this._order.items.push({
      itemType: 'ticket', ticketId,
      productId: null, quantity, unitPrice, sizeName: null
    })
    this._order.total += unitPrice * quantity
    return this
  }

  applyLoyaltyPoints(lpPoints, valuePerPoint = 1) {
    const discount = lpPoints * valuePerPoint
    this._order.lpRedeemed = lpPoints
    this._order.total = Math.max(0, this._order.total - discount)
    return this
  }

  build() {
    if (!this._order.personId)          throw new Error('OrderBuilder: falta personId')
    if (this._order.items.length === 0) throw new Error('OrderBuilder: la orden no tiene ítems')
    const result = { ...this._order, items: [...this._order.items] }
    this.reset()
    return result
  }
}
