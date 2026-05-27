import { Routes, Route } from 'react-router-dom'
import Navbar         from './views/components/shared/Navbar.jsx'
import EasterEgg      from './views/components/shared/EasterEgg.jsx'
import ProtectedRoute from './views/components/shared/ProtectedRoute.jsx'
import Home           from './views/pages/Home.jsx'
import Products       from './views/pages/Products.jsx'
import Events         from './views/pages/Events.jsx'
import AboutUs        from './views/pages/AboutUs.jsx'
import Reserve        from './views/pages/Reserve.jsx'
import Login          from './views/pages/Login.jsx'
import Register       from './views/pages/Register.jsx'
import NotFound       from './views/pages/NotFound.jsx'
import PaymentDemo    from './views/pages/PaymentDemo.jsx'
import UserDashboard  from './views/pages/dashboards/UserDashboard.jsx'
import AdminDashboard from './views/pages/dashboards/AdminDashboard.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <EasterEgg />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Home />}     />
        <Route path="/products" element={<Products />} />
        <Route path="/events"   element={<Events />}   />
        <Route path="/about"    element={<AboutUs />}  />
        <Route path="/reserve"  element={<Reserve />}  />
        <Route path="/login"    element={<Login />}    />
        <Route path="/register"     element={<Register />}     />
        <Route path="/payment-demo" element={<PaymentDemo />}  />

        {/* Protected — auth required */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Admin — staff or admin level */}
        <Route element={<ProtectedRoute requireStaff />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
