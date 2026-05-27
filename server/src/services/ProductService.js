const supabase       = require('../../config/database')
const ProductFactory = require('../factories/ProductFactory')

async function resolveProductType(product) {
  // Map snake_case DB fields to camelCase expected by Product base constructor
  const base = { ...product, imagePixel: product.image_pixel }

  const [beer, cocktail, food, merch] = await Promise.all([
    supabase.from('beers').select('*').eq('product_id', product.id).maybeSingle(),
    supabase.from('cocktails').select('*').eq('product_id', product.id).maybeSingle(),
    supabase.from('food').select('*').eq('product_id', product.id).maybeSingle(),
    supabase.from('merch').select('*, product_sizes(*)').eq('product_id', product.id).maybeSingle(),
  ])

  if (beer.data)     return ProductFactory.create('beer',     { ...base, ...beer.data,     id: product.id })
  if (cocktail.data) return ProductFactory.create('cocktail', { ...base, ...cocktail.data, id: product.id })
  if (food.data)     return ProductFactory.create('food',     { ...base, ...food.data,     id: product.id })
  if (merch.data)    return ProductFactory.create('merch',    {
    ...base,
    ...merch.data,
    id:    product.id,
    sizes: merch.data.product_sizes ?? [],
  })

  return ProductFactory.create('beer', base)
}

class ProductService {
  async getAll() {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
    if (error) throw error

    return Promise.all(products.map(resolveProductType))
  }

  async getById(id) {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error

    return resolveProductType(product)
  }

  async create(type, productData, specificData) {
    const { data: product, error: pe } = await supabase
      .from('products').insert(productData).select().single()
    if (pe) throw pe

    const table = { beer: 'beers', cocktail: 'cocktails', food: 'food', merch: 'merch' }[type]
    if (table) {
      const { error: se } = await supabase
        .from(table).insert({ product_id: product.id, ...specificData })
      if (se) throw se
    }
    return ProductFactory.create(type, { ...product, ...specificData })
  }

  async delete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  }

  async toggleAvailability(id) {
    const product = await this.getById(id)
    const { error } = await supabase
      .from('products').update({ available: !product.available }).eq('id', id)
    if (error) throw error
    return !product.available
  }
}

module.exports = new ProductService()
