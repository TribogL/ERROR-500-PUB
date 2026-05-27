/**
 * Product — Clase base abstracta
 * Factory Method Pattern: ProductFactory crea instancias de sus subclases
 */
class Product {
  constructor({ id, name, description, price, image, imagePixel,
                available, featured, stars, createdAt }) {
    if (new.target === Product) {
      throw new Error('Product es una clase abstracta — usa ProductFactory.create()')
    }
    this.id          = id
    this.name        = name
    this.description = description
    this.price       = price
    this.image       = image
    this.imagePixel  = imagePixel
    this.available   = available ?? true
    this.featured    = featured  ?? false
    this.stars       = stars     ?? 0
    this.createdAt   = createdAt
  }

  // Método que cada subclase debe implementar
  getCategory() { throw new Error('getCategory() debe implementarse en la subclase') }

  getDisplayPrice() {
    if (this.price === 0) return 'Free'
    return `$ ${this.price.toLocaleString('es-CO')}`
  }

  isAvailable() { return this.available }

  toJSON() {
    return {
      id: this.id, name: this.name, description: this.description,
      price: this.price, image: this.image, imagePixel: this.imagePixel,
      available: this.available, featured: this.featured,
      stars: this.stars, category: this.getCategory()
    }
  }
}

module.exports = Product
