// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useLocation } from 'react-router-dom'

function Home() {
  const { carrito } = useCart()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()

  const obtenerProductos = async () => {
    setCargando(true)
    setError('')
    setProductos([]) // Resetear productos a array vacío

    try {
      const res = await fetch('http://localhost:3001/api/productos')
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
      const res = await fetch(`http://localhost:3001/api/productos/buscar?q=${encodeURIComponent(termino)}`)
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
        <h1>Bienvenido a PoliMarket 🛍️</h1>
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.contenedor}>
        <h1>Bienvenido a PoliMarket 🛍️</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={styles.contenedor}>
      <h1>Bienvenido a PoliMarket 🛍️</h1>
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  galeria: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '20px',
    justifyContent: 'center'
  }
}

export default Home