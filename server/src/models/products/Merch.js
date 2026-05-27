const Product = require('../base/Product')

class Merch extends Product {
  constructor(data) {
    super(data)
    this.sizes = data.sizes ?? []
  }
  getCategory() { return 'Merch' }
  getDisplayPrice() {
    if (this.sizes.length > 0) return `$ ${this.sizes[0].price.toLocaleString('es-CO')}`
    return super.getDisplayPrice()
  }
  toJSON() { return { ...super.toJSON(), sizes: this.sizes } }
}
module.exports = Merch
