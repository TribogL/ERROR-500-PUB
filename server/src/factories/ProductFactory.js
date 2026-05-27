const Beer     = require('../models/products/Beer')
const Cocktail = require('../models/products/Cocktail')
const Food     = require('../models/products/Food')
const Merch    = require('../models/products/Merch')
const Ticket   = require('../models/products/Ticket')

/**
 * ProductFactory — Factory Method
 * Crea la instancia correcta según el tipo de producto
 */
class ProductFactory {
  static create(type, data) {
    switch (type.toLowerCase()) {
      case 'beer':     return new Beer(data)
      case 'cocktail': return new Cocktail(data)
      case 'food':     return new Food(data)
      case 'merch':    return new Merch(data)
      case 'ticket':   return new Ticket(data)
      default:
        throw new Error(`Tipo de producto desconocido: ${type}`)
    }
  }

  // Crea a partir de una fila de DB con sus joins
  static fromDB(row) {
    if (row.beers     && row.beers.id)     return ProductFactory.create('beer',     { ...row, ...row.beers })
    if (row.cocktails && row.cocktails.id) return ProductFactory.create('cocktail', { ...row, ...row.cocktails })
    if (row.food      && row.food.id)      return ProductFactory.create('food',     { ...row, ...row.food })
    if (row.merch     && row.merch.id)     return ProductFactory.create('merch',    { ...row, ...row.merch, sizes: row.merch?.product_sizes ?? [] })
    throw new Error('No se pudo determinar el tipo de producto desde la DB')
  }
}

module.exports = ProductFactory
