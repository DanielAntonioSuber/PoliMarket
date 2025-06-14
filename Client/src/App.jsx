import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'
import RutaProtegidaAdmin from './components/RutaProtegidaAdmin'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={<Cart />} />
        <Route
          path="/admin"
          element={
            <RutaProtegidaAdmin>
              <AdminDashboard />
            </RutaProtegidaAdmin>
          }
        />
      </Routes>
    </div>
  )
}

export default App
