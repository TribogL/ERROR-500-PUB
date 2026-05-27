const supabase     = require('../../config/database')
const OrderBuilder = require('../builders/OrderBuilder')

class OrderService {
  getBuilder() { return new OrderBuilder() }

  async create(orderData) {
    const { items, ...orderFields } = orderData

    const { data: order, error: oe } = await supabase
      .from('orders')
      .insert({
        person_id:   orderFields.personId,
        status:      orderFields.status || 'pending',
        total:       orderFields.total,
        lp_redeemed: orderFields.lpRedeemed || 0
      })
      .select()
      .single()

    if (oe) {
      console.error('[OrderService.create] order error:', oe)
      throw oe
    }

    const itemRows = items.map(item => ({
      order_id:   order.id,
      item_type:  item.itemType,
      product_id: item.productId || null,
      ticket_id:  item.ticketId  || null,
      quantity:   item.quantity,
      unit_price: item.unitPrice,
      size_name:  item.sizeName  || null
    }))

    const { error: ie } = await supabase
      .from('order_items')
      .insert(itemRows)

    if (ie) {
      console.error('[OrderService.create] items error:', ie)
      throw ie
    }

    for (const item of items) {
      if (item.itemType === 'ticket') {
        const { data: success, error: re } = await supabase
          .rpc('purchase_ticket', { p_ticket_id: item.ticketId, p_quantity: item.quantity })
        if (re)       console.error('[OrderService] purchase_ticket error:', re)
        if (!success) console.warn('[OrderService] No spots available for ticket:', item.ticketId)
      }
    }

    return order
  }

  async getByPerson(personId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, order_items(*)`)
      .eq('person_id', personId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
}

module.exports = new OrderService()
