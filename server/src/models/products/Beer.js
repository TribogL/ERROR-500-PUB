const Product = require('../base/Product')

class Beer extends Product {
  constructor(data) {
    super(data)
    this.style    = data.style
    this.abv      = data.abv
    this.brewery  = data.brewery
    this.onTap    = data.onTap ?? false
  }
  getCategory() { return 'Beers' }
  getAbvLabel() { return this.abv ? `${this.abv}% ABV` : null }
  toJSON() { return { ...super.toJSON(), style: this.style, abv: this.abv, brewery: this.brewery, onTap: this.onTap } }
}
module.exports = Beer
