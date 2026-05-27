import UserDashboard  from '../views/pages/dashboards/UserDashboard.jsx'
import AdminDashboard from '../views/pages/dashboards/AdminDashboard.jsx'

// --- Config products (Abstract Factory pattern) ---

class CustomerDashboardConfig {
  getSections()           { return ['orders', 'reservations', 'loyalty', 'rewards', 'events', 'settings'] }
  getWelcomeMessage()     { return 'Mi Panel' }
  getPermissions()        {
    return {
      canViewMetrics: false, canManageProducts: false, canManageStaff: false,
      canViewStaff: false,   canManageEvents: false,   canManageLoyalty: false,
      canDelete: false,      canEditAvailability: false,
    }
  }
}

// level1 — Bartender
class Level1DashboardConfig {
  getSections()           { return ['reservations', 'orders', 'loyalty', 'rewards'] }
  getWelcomeMessage()     { return 'Bartender Dashboard' }
  getPermissions()        {
    return {
      canViewMetrics: false, canManageProducts: false, canManageStaff: false,
      canViewStaff: false,   canManageEvents: false,   canManageLoyalty: true,
      canDelete: false,      canEditAvailability: true,
    }
  }
}

// level2 — Manager
class Level2DashboardConfig {
  getSections()           { return ['reservations', 'orders', 'loyalty', 'rewards', 'events', 'metrics', 'staff'] }
  getWelcomeMessage()     { return 'Manager Dashboard' }
  getPermissions()        {
    return {
      canViewMetrics: true,  canManageProducts: false, canManageStaff: false,
      canViewStaff: true,    canManageEvents: true,    canManageLoyalty: true,
      canDelete: false,      canEditAvailability: true,
    }
  }
}

// level3 — Admin
class Level3DashboardConfig {
  getSections()           { return ['metrics', 'orders', 'reservations', 'customers', 'loyalty', 'rewards', 'products', 'events', 'staff', 'settings'] }
  getWelcomeMessage()     { return 'Admin Dashboard' }
  getPermissions()        {
    return {
      canViewMetrics: true, canManageProducts: true, canManageStaff: true,
      canViewStaff: true,   canManageEvents: true,   canManageLoyalty: true,
      canDelete: true,      canEditAvailability: true,
    }
  }
}

// --- Abstract Factory ---

export class DashboardFactory {
  static create(level) {
    if (['level1', 'level2', 'level3', 'admin', 'staff'].includes(level)) return AdminDashboard
    return UserDashboard
  }

  static createConfig(level) {
    switch (level) {
      case 'level1': return new Level1DashboardConfig()
      case 'level2': return new Level2DashboardConfig()
      case 'level3': return new Level3DashboardConfig()
      // Legacy fallbacks
      case 'admin':  return new Level3DashboardConfig()
      case 'staff':  return new Level1DashboardConfig()
      default:       return new CustomerDashboardConfig()
    }
  }
}
