const Customer = require('../models/persons/Customer')
const Staff    = require('../models/persons/Staff')

/**
 * PersonFactory — Factory Method
 */
class PersonFactory {
  static create(type, data) {
    switch (type.toLowerCase()) {
      case 'customer': return new Customer(data)
      case 'staff':
      case 'admin':    return new Staff(data)
      default:
        throw new Error(`Tipo de persona desconocido: ${type}`)
    }
  }

  static fromDB(personRow, customerRow = null, staffRow = null) {
    const base = {
      id: personRow.id, firstName: personRow.first_name,
      lastName: personRow.last_name, email: personRow.email,
      createdAt: personRow.created_at
    }
    if (staffRow) {
      return PersonFactory.create('staff', {
        ...base, level: staffRow.level,
        department: staffRow.department, hiredAt: staffRow.hired_at,
        createdBy: staffRow.created_by
      })
    }
    return PersonFactory.create('customer', {
      ...base,
      loyaltyBalance: customerRow?.loyalty_balance ?? 0,
      memberSince: customerRow?.member_since
    })
  }
}

module.exports = PersonFactory
