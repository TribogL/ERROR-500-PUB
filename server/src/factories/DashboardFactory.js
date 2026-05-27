// Abstract Factory Pattern — Crea familias de configuraciones de dashboard según el rol

// --- Abstract Products ---

class DashboardConfig {
  getSections()           { throw new Error('getSections() debe implementarse') }
  getWelcomeMessage(name) { throw new Error('getWelcomeMessage() debe implementarse') }
  getPermissions()        { throw new Error('getPermissions() debe implementarse') }
}

// --- Concrete Products ---

class CustomerDashboardConfig extends DashboardConfig {
  getSections()           { return ['orders', 'reservations', 'loyalty', 'events'] }
  getWelcomeMessage(name) { return `Bienvenido de vuelta, ${name}!` }
  getPermissions()        {
    return {
      canViewOwnOrders:     true,
      canManageProducts:    false,
      canViewMetrics:       false,
      canManageStaff:       false,
      canManageReservations:false
    }
  }
}

class StaffDashboardConfig extends DashboardConfig {
  getSections()           { return ['reservations', 'orders', 'products', 'events'] }
  getWelcomeMessage(name) { return `Panel de Staff — ${name}` }
  getPermissions()        {
    return {
      canViewOwnOrders:      true,
      canManageProducts:     true,
      canViewMetrics:        false,
      canManageStaff:        false,
      canManageReservations: true
    }
  }
}

class AdminDashboardConfig extends DashboardConfig {
  getSections()           { return ['metrics', 'orders', 'reservations', 'customers', 'products', 'staff', 'events'] }
  getWelcomeMessage(name) { return `Panel Admin — ${name}` }
  getPermissions()        {
    return {
      canViewOwnOrders:      true,
      canManageProducts:     true,
      canViewMetrics:        true,
      canManageStaff:        true,
      canManageReservations: true
    }
  }
}

// --- Abstract Factory ---

class DashboardFactory {
  createConfig() { throw new Error('createConfig() debe implementarse') }

  static create(role) {
    switch (role) {
      case 'customer': return new CustomerDashboardFactory()
      case 'staff':    return new StaffDashboardFactory()
      case 'admin':    return new AdminDashboardFactory()
      default:         throw new Error(`Rol de dashboard desconocido: ${role}`)
    }
  }
}

// --- Concrete Factories ---

class CustomerDashboardFactory extends DashboardFactory {
  createConfig() { return new CustomerDashboardConfig() }
}

class StaffDashboardFactory extends DashboardFactory {
  createConfig() { return new StaffDashboardConfig() }
}

class AdminDashboardFactory extends DashboardFactory {
  createConfig() { return new AdminDashboardConfig() }
}

module.exports = {
  DashboardFactory,
  CustomerDashboardFactory,
  StaffDashboardFactory,
  AdminDashboardFactory
}
