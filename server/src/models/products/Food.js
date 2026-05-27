const Product = require('../base/Product')

class Food extends Product {
  constructor(data) {
    super(data)
    this.allergens   = data.allergens
    this.prepTimeMin = data.prepTimeMin
    this.vegetarian  = data.vegetarian ?? false
  }
  getCategory() { return 'Food' }
  toJSON() { return { ...super.toJSON(), allergens: this.allergens, prepTimeMin: this.prepTimeMin, vegetarian: this.vegetarian } }
}
module.exports = Food
