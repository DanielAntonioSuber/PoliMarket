import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState } from 'react'

function Navbar() {
  const { usuario, logout } = useUser()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  const manejarBusqueda = (e) => {
    e.preventDefault()
    if (busqueda.trim()) {
      navigate(`/?q=${encodeURIComponent(busqueda.trim())}`)
      setBusqueda('')
    }
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <div style={styles.logo}>
          <span style={styles.logoText}>Poli</span>
          <span style={styles.logoMarket}>Market</span>
        </div>
        <div style={styles.ipnBadge}>IPN</div>
      </div>
      <form onSubmit={manejarBusqueda} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>🔍</button>
      </form>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/carrito" style={styles.link}>Carrito</Link>

        {usuario ? (
          <>
            {usuario.rol === 'admin' && <Link to="/admin" style={styles.link}>Dashboard</Link>}
            <span style={styles.nombre} onClick={() => navigate('/perfil')}>
              Hola, {usuario.nombre}
            </span>
            <button onClick={logout} style={styles.logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Iniciar Sesión</Link>
            <Link to="/register" style={styles.link}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    backgroundColor: '#003366',
    padding: '32px 32px',
    minHeight: '90px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logo: {
    fontSize: '2.1em',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  logoText: {
    fontWeight: 'bold',
    color: '#fff'
  },
  logoMarket: {
    fontWeight: 'bold',
    color: '#ffd700' // Dorado IPN
  },
  ipnBadge: {
    backgroundColor: '#ffd700',
    color: '#003366',
    padding: '5px 14px',
    borderRadius: '7px',
    fontSize: '1em',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    fontSize: '1.08em',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1em',
    transition: 'color 0.3s ease',
  },
  nombre: {
    fontWeight: 'bold',
    color: '#ffd700',
    fontSize: '1em',
    cursor: 'pointer',
    position: 'relative',
  },
  logout: {
    backgroundColor: '#ffd700',
    color: '#003366',
    border: 'none',
    padding: '7px 14px',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '1em',
    transition: 'all 0.3s ease',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: '1',
    maxWidth: '600px',
    margin: '0 30px'
  },
  searchInput: {
    padding: '11px 16px',
    borderRadius: '7px',
    border: 'none',
    fontSize: '1.08em',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  searchButton: {
    padding: '11px 16px',
    borderRadius: '7px',
    border: 'none',
    backgroundColor: '#ffd700',
    color: '#003366',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.08em',
    transition: 'all 0.3s ease',
  },
}

export default Navbar