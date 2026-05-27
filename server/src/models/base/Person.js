/**
 * Person — Clase base abstracta
 * Factory Method Pattern: PersonFactory crea Customer o Staff
 */
class Person {
  constructor({ id, firstName, lastName, email, createdAt }) {
    if (new.target === Person) {
      throw new Error('Person es una clase abstracta — usa PersonFactory.create()')
    }
    this.id        = id
    this.firstName = firstName
    this.lastName  = lastName
    this.email     = email
    this.createdAt = createdAt
  }

  getFullName() { return `${this.firstName} ${this.lastName}` }
  getType()     { throw new Error('getType() debe implementarse en la subclase') }

  toJSON() {
    return {
      id: this.id, firstName: this.firstName,
      lastName: this.lastName, email: this.email,
      type: this.getType()
    }
  }
}

module.exports = Person
