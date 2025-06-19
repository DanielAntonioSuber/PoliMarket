// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

function Home() {
  const { carrito } = useCart()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')

  const obtenerProductos = async () => {
    setCargando(true)
    setError('')
    setProductos([]) // Resetear productos a array vacío

    try {
      const res = await fetch(`${API_URL}/api/productos`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      
      // Asegurarse de que data sea un array
      if (Array.isArray(data)) {
        setProductos(data)
      } else {
        console.error('La respuesta no es un array:', data)
        setProductos([])
        setError('Error en el formato de los datos')
      }
    } catch (err) {
      console.error('Error al obtener productos:', err)
      setProductos([])
      setError('No se pudieron cargar los productos')
    } finally {
      setCargando(false)
    }
  }

  const buscarProductos = async (termino) => {
    setCargando(true)
    setError('')
    setProductos([]) // Resetear productos a array vacío

    try {
      const res = await fetch(`${API_URL}/api/productos/buscar?q=${encodeURIComponent(termino)}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      // Asegurarse de que data sea un array
      if (Array.isArray(data)) {
        setProductos(data)
      } else {
        console.error('La respuesta no es un array:', data)
        setProductos([])
        setError('Error en el formato de los datos')
      }
    } catch (err) {
      console.error('Error al buscar productos:', err)
      setProductos([])
      setError('No se pudieron buscar productos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const busqueda = query.get('q')

    if (busqueda) {
      buscarProductos(busqueda)
    } else {
      obtenerProductos()
    }
  }, [location.search])

  // Renderizado condicional
  if (cargando) {
    return (
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Bienvenido a PoliMarket 🛍️</h1>
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Bienvenido a PoliMarket 🛍️</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={styles.contenedor}>
      <h1 style={styles.titulo}>Bienvenido a PoliMarket 🛍️</h1>
      {Array.isArray(productos) && productos.length > 0 ? (
        <div style={styles.galeria}>
          {productos.map(p => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </div>
  )
}

const styles = {
  contenedor: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#8B0000',
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  titulo: {
    color: '#8B0000',
    fontSize: '2rem',
    fontWeight: 'bolder',
    marginBottom: '24px',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: '2px 2px 8px rgba(139, 0, 0, 0.3)',
    width: '100%',
    letterSpacing: '2px',
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  boton: {
    fontSize: '1.2rem',
    padding: '14px 28px',
    fontWeight: 'bold',
    fontFamily: 'Montserrat, Arial, sans-serif',
    borderRadius: '8px',
    backgroundColor: '#8B0000',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '10px 0',
    transition: 'all 0.2s',
  },
  galeria: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '20px',
    justifyContent: 'center'
  },
  producto: {
    border: '3px solid #8B0000',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(139,0,0,0.10)',
    padding: '18px',
    margin: '16px',
    backgroundColor: '#fff',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
 
}

export default Home