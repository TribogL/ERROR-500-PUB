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
      .select('*, persons(first_name, last_name, email)')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) return res.status(500).json({ success: false, error: error.message })
    res.json({ success: true, data })
  }

  async redeemPoints(req, res) {
    try {
      const { rewardId } = req.body
      let pointsToRedeem = req.body.points

      if (rewardId) {
        const { data: reward, error: re } = await supabase
          .from('loyalty_rewards')
          .select('lp_cost, stock, available')
          .eq('id', rewardId)
          .single()
        if (re || !reward) throw new Error('Reward no encontrada')
        if (!reward.available || reward.stock <= 0) throw new Error('Reward no disponible o sin stock')
        pointsToRedeem = reward.lp_cost
        await supabase
          .from('loyalty_rewards')
          .update({ stock: reward.stock - 1 })
          .eq('id', rewardId)
      }

      const newBalance = await LoyaltyService.redeemPoints(req.user.id, pointsToRedeem)
      res.json({ success: true, data: { balance: newBalance } })
    } catch (err) {
      console.error('[LoyaltyController.redeemPoints]', err)
      res.status(400).json({ success: false, error: err.message })
    }
  }
}

module.exports = new LoyaltyController()
