const Person = require('../base/Person')

class Customer extends Person {
  constructor(data) {
    super(data)
    this.loyaltyBalance = data.loyaltyBalance ?? 0
    this.memberSince    = data.memberSince
  }
  getType()    { return 'customer' }
  getInitials(){ return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase() }
  toJSON()     { return { ...super.toJSON(), loyaltyBalance: this.loyaltyBalance, memberSince: this.memberSince } }
}
module.exports = Customer
