const supabase = require('../../config/database')

class LoyaltyService {
  async getBalance(personId) {
    const { data, error } = await supabase
      .from('customers')
      .select('loyalty_balance')
      .eq('person_id', personId)
      .single()
    if (error) throw error
    return data.loyalty_balance
  }

  async addPoints(personId, points, reason = null) {
    const { data: customer, error: ce } = await supabase
      .from('customers')
      .select('loyalty_balance')
      .eq('person_id', personId)
      .single()
    if (ce) throw ce

    const newBalance = (customer.loyalty_balance || 0) + points

    const { data, error } = await supabase
      .from('customers')
      .update({ loyalty_balance: newBalance })
      .eq('person_id', personId)
      .select('loyalty_balance')
      .single()
    if (error) throw error

    await supabase.from('loyalty_transactions').insert({
      person_id: personId,
      points,
      type: 'earned',
      reason
    })

    return data.loyalty_balance
  }

  async redeemPoints(personId, points) {
    const balance = await this.getBalance(personId)
    if (balance < points) throw new Error('Puntos insuficientes')

    const { data, error } = await supabase
      .from('customers')
      .update({ loyalty_balance: balance - points })
      .eq('person_id', personId)
      .select('loyalty_balance')
      .single()
    if (error) throw error

    await supabase.from('loyalty_transactions').insert({
      person_id: personId,
      points: -points,
      type: 'redeemed',
      reason: 'Order discount'
    })

    return data.loyalty_balance
  }

  async getAllRewards() {
    const { data, error } = await supabase
      .from('loyalty_rewards').select('*').order('lp_cost', { ascending: true })
    if (error) throw error
    return data
  }

  async createReward(rewardData) {
    const { data, error } = await supabase
      .from('loyalty_rewards').insert(rewardData).select().single()
    if (error) throw error
    return data
  }

  async updateReward(id, rewardData) {
    const { data, error } = await supabase
      .from('loyalty_rewards').update(rewardData).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  async toggleReward(id) {
    const { data: cur, error: ce } = await supabase
      .from('loyalty_rewards').select('available').eq('id', id).single()
    if (ce) throw ce
    const { data, error } = await supabase
      .from('loyalty_rewards').update({ available: !cur.available }).eq('id', id).select().single()
    if (error) throw error
    return data
  }

  async getHistory(personId) {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('person_id', personId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
}

module.exports = new LoyaltyService()
