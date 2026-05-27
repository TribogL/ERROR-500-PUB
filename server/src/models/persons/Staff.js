const Person = require('../base/Person')

class Staff extends Person {
  constructor(data) {
    super(data)
    this.level      = data.level      // 'level1' | 'level2' | 'level3'
    this.department = data.department
    this.hiredAt    = data.hiredAt
    this.createdBy  = data.createdBy
  }
  getType()  { return 'staff' }
  isAdmin()  { return this.level === 'level3' }
  toJSON()   { return { ...super.toJSON(), level: this.level, department: this.department, hiredAt: this.hiredAt } }
}
module.exports = Staff
