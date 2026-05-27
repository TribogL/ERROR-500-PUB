const Product = require('../base/Product')

class Cocktail extends Product {
  constructor(data) {
    super(data)
    this.ingredients    = data.ingredients
    this.alcoholContent = data.alcoholContent
  }
  getCategory() { return 'Cocktails' }
  toJSON() { return { ...super.toJSON(), ingredients: this.ingredients, alcoholContent: this.alcoholContent } }
}
module.exports = Cocktail
