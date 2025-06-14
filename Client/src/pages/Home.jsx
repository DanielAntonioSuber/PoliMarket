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

    try {
      const res = await fetch('http://localhost:3001/api/productos')
      const data = await res.json()
      setProductos(data)
    } catch (err) {
      console.error('Error al obtener productos:', err)
      setError('No se pudieron cargar los productos')
    } finally {
      setCargando(false)
    }
  }

  const buscarProductos = async (termino) => {
    setCargando(true)
    setError('')
    try {
      const res = await fetch(`http://localhost:3001/api/productos/buscar?q=${encodeURIComponent(termino)}`)
      const data = await res.json()
      setProductos(data)
    } catch (err) {
      console.error('Error al buscar productos:', err)
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

  return (
    <div style={styles.contenedor}>
      <h1>Bienvenido a PoliMarket 🛍️</h1>
      {cargando ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={styles.galeria}>
          {productos.map(p => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
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