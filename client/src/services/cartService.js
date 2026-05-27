const CART_KEY = 'e500_cart'

function emit() {
  window.dispatchEvent(new Event('cart-updated'))
}

export const cartService = {
  getItems() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    } catch {
      return []
    }
  },

  _save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  },

  addProduct(product) {
    const items = this.getItems()
    const key   = product.cartKey ?? product.id
    const found = items.find(i => (i.cartKey ?? i.id) === key && i.type === 'product')
    if (found) {
      found.quantity += 1
    } else {
      items.push({ ...product, cartKey: key, type: 'product', quantity: 1 })
    }
    this._save(items)
    emit()
  },

  addTicket(ticket) {
    const items = this.getItems()
    const found = items.find(i => i.id === ticket.id && i.type === 'ticket')
    if (found) {
      found.quantity += 1
    } else {
      items.push({ ...ticket, type: 'ticket', quantity: 1 })
    }
    this._save(items)
    emit()
  },

  removeItem(cartKey) {
    const items = this.getItems().filter(i => (i.cartKey ?? i.id) !== cartKey)
    this._save(items)
    emit()
  },

  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0)
  },

  getTotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0)
  },

  clear() {
    localStorage.removeItem(CART_KEY)
    emit()
  }
}
