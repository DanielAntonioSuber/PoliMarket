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
            <span style={styles.nombre}>Hola, {usuario.nombre}</span>
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
    backgroundColor: '#003366', // Azul IPN
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logo: {
    fontSize: '1.6em',
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
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
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.8em',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#ffd700'
    }
  },
  nombre: {
    fontWeight: 'bold',
    color: '#ffd700'
  },
  logout: {
    backgroundColor: '#ffd700',
    color: '#003366',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#fff',
      transform: 'scale(1.05)'
    }
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    flex: '1',
    maxWidth: '500px',
    margin: '0 20px'
  },
  searchInput: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '1em',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    '&:focus': {
      outline: '2px solid #ffd700'
    }
  },
  searchButton: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#ffd700',
    color: '#003366',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#fff',
      transform: 'scale(1.05)'
    }
  }
}

export default Navbar