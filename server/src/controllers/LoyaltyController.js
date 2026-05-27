const LoyaltyService = require('../services/LoyaltyService')
const supabase       = require('../../config/database')

class LoyaltyController {
  async getBalance(req, res) {
    try {
      const balance = await LoyaltyService.getBalance(req.user.id)
      res.json({ success: true, data: { balance } })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getHistory(req, res) {
    try {
      const history = await LoyaltyService.getHistory(req.user.id)
      res.json({ success: true, data: history })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  // Staff: add points to any customer
  async addPoints(req, res) {
    try {
      const { userId, points, description } = req.body

      if (!userId) return res.status(400).json({ success: false, error: 'userId is required' })

      const newBalance = await LoyaltyService.addPoints(
        userId,
        points,
        description || 'Ajuste manual por admin'
      )
      res.json({ success: true, data: { balance: newBalance } })
    } catch (err) {
      console.error('[LoyaltyController.addPoints]', err)
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async getRewards(req, res) {
    try {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .order('lp_cost', { ascending: true })
      if (error) throw error
      res.json({ success: true, data })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getAllRewards(req, res) {
    try {
      const rewards = await LoyaltyService.getAllRewards()
      res.json({ success: true, data: rewards })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async createReward(req, res) {
    try {
      const reward = await LoyaltyService.createReward(req.body)
      res.status(201).json({ success: true, data: reward })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async updateReward(req, res) {
    try {
      const reward = await LoyaltyService.updateReward(req.params.id, req.body)
      res.json({ success: true, data: reward })
    } catch (err) {
      res.status(400).json({ success: false, error: err.message })
    }
  }

  async toggleReward(req, res) {
    try {
      const reward = await LoyaltyService.toggleReward(req.params.id)
      res.json({ success: true, data: reward })
    } catch (err) {
      res.status(500).json({ success: false, error: err.message })
    }
  }

  async getAllHistory(req, res) {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*, persons!loyalty_transactions_person_id_fkey(first_name, last_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return res.status(500).json({ success: false, error: error.message })
    res.json({ success: true, data })
  }

  async redeemPoints(req, res) {
    try {
      const { rewardId } = req.body
      const personId = req.user.id

      // 1. Obtener el reward
      const { data: reward, error: re } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('id', rewardId)
        .single()
      if (re || !reward) return res.status(404).json({ success: false, error: 'Reward not found' })

      // 2. Verificar disponibilidad y stock
      if (!reward.available || reward.stock <= 0)
        return res.status(400).json({ success: false, error: 'Reward not available' })

      // 3. Verificar balance del usuario
      const { data: customer } = await supabase
        .from('customers')
        .select('loyalty_balance')
        .eq('person_id', personId)
        .single()

      if (!customer || customer.loyalty_balance < reward.lp_cost)
        return res.status(400).json({ success: false, error: 'Insufficient LP balance' })

      // 4. Descontar stock del reward
      await supabase
        .from('loyalty_rewards')
        .update({ stock: reward.stock - 1 })
        .eq('id', rewardId)

      // 5. Crear redemption record
      await supabase
        .from('reward_redemptions')
        .insert({ person_id: personId, reward_id: rewardId, status: 'pending' })

      // 6. Crear loyalty_transaction con puntos negativos
      // El trigger update_loyalty_balance actualizará el balance automáticamente
      const { data: transaction, error: te } = await supabase
        .from('loyalty_transactions')
        .insert({
          person_id:   personId,
          reward_id:   rewardId,
          points:      -reward.lp_cost,
          type:        'redeemed',
          description: `Canje: ${reward.name}`,
        })
        .select()
        .single()

      if (te) throw te

      res.json({ success: true, data: transaction })
    } catch (err) {
      console.error('[LoyaltyController.redeemPoints]', err)
      res.status(500).json({ success: false, error: err.message })
    }
  }
}

module.exports = new LoyaltyController()
