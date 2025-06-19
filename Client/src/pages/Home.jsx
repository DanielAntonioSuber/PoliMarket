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
  const [colores, setColores] = useState([])
  const [categorias, setCategorias] = useState([])
  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    color: '',
    categoria: ''
  })
  const location = useLocation()
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [busquedaTexto, setBusquedaTexto] = useState('')

  // Obtener productos, colores y categorías
  const obtenerProductos = async () => {
    setCargando(true)
    setError('')
    setProductos([])
    try {
      const res = await fetch(`${API_URL}/api/productos`)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setProductos(Array.isArray(data) ? data : [])
    } catch (err) {
      setProductos([])
      setError('No se pudieron cargar los productos')
    } finally {
      setCargando(false)
    }
  }
  const obtenerColores = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos/colores`)
      if (!res.ok) return
      const data = await res.json()
      setColores(Array.isArray(data) ? data : [])
    } catch {}
  }
  const obtenerCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos/categorias`)
      if (!res.ok) return
      const data = await res.json()
      setCategorias(Array.isArray(data) ? data : [])
    } catch {}
  }

  useEffect(() => {
    obtenerProductos()
    obtenerColores()
    obtenerCategorias()
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const q = query.get('q') || ''
    setBusquedaTexto(q)
  }, [location.search])

  // Filtrado de productos en frontend
  const productosFiltrados = productos.filter(p => {
    const { precioMin, precioMax, color, categoria } = filtros
    let ok = true
    if (precioMin && Number(p.precio) < Number(precioMin)) ok = false
    if (precioMax && Number(p.precio) > Number(precioMax)) ok = false
    if (color && String(p.color_id) !== String(color)) ok = false
    if (categoria && String(p.categoria_id) !== String(categoria)) ok = false
    if (busquedaTexto && !(
      p.nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(busquedaTexto.toLowerCase()))
    )) ok = false
    return ok
  })

  // Renderizado condicional
  if (cargando) {
    return (
      <div style={styles.contenedor}>
        <h1 style={{
          color: '#8B0000',
          fontSize: '3.2rem',
          fontWeight: 'bolder',
          marginBottom: '48px',
          textAlign: 'center',
          textTransform: 'uppercase',
          textShadow: '2px 2px 12px rgba(139, 0, 0, 0.25)',
          width: '100%',
          letterSpacing: '4px',
          fontFamily: 'Montserrat, Arial, sans-serif',
          padding: '48px 0 28px 0',
          lineHeight: 1.1
        }}>Bienvenido a PoliMarket 🛍️</h1>
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.contenedor}>
        <h1 style={{
          color: '#8B0000',
          fontSize: '3.2rem',
          fontWeight: 'bolder',
          marginBottom: '48px',
          textAlign: 'center',
          textTransform: 'uppercase',
          textShadow: '2px 2px 12px rgba(139, 0, 0, 0.25)',
          width: '100%',
          letterSpacing: '4px',
          fontFamily: 'Montserrat, Arial, sans-serif',
          padding: '48px 0 28px 0',
          lineHeight: 1.1
        }}>Bienvenido a PoliMarket 🛍️</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={styles.contenedor}>
      <h1 style={{
        color: '#8B0000',
        fontSize: '3.2rem',
        fontWeight: 'bolder',
        marginBottom: '48px',
        textAlign: 'center',
        textTransform: 'uppercase',
        textShadow: '2px 2px 12px rgba(139, 0, 0, 0.25)',
        width: '100%',
        letterSpacing: '4px',
        fontFamily: 'Montserrat, Arial, sans-serif',
        padding: '48px 0 28px 0',
        lineHeight: 1.1
      }}>
        Bienvenido a PoliMarket 🛍️
      </h1>
      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#f3f4f6',
          boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
          border: '2px solid #8B0000',
          borderRadius: 10,
          padding: '12px 16px',
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <label style={{fontWeight: 'bold', fontSize: '1.05rem', marginBottom: 4}}>Precio mín:<br/>
            <input type="number" min="0" value={filtros.precioMin} onChange={e => setFiltros(f => ({...f, precioMin: e.target.value}))} style={{width: 85, fontSize: '1.05rem', padding: 7, borderRadius: 7, border: '1.5px solid #8B0000', marginTop: 3}} />
          </label>
        </div>
        <div style={{
          background: '#f3f4f6',
          boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
          border: '2px solid #8B0000',
          borderRadius: 10,
          padding: '12px 16px',
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <label style={{fontWeight: 'bold', fontSize: '1.05rem', marginBottom: 4}}>Precio máx:<br/>
            <input type="number" min="0" value={filtros.precioMax} onChange={e => setFiltros(f => ({...f, precioMax: e.target.value}))} style={{width: 85, fontSize: '1.05rem', padding: 7, borderRadius: 7, border: '1.5px solid #8B0000', marginTop: 3}} />
          </label>
        </div>
        <div style={{
          background: '#f3f4f6',
          boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
          border: '2px solid #8B0000',
          borderRadius: 10,
          padding: '12px 16px',
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <label style={{fontWeight: 'bold', fontSize: '1.05rem', marginBottom: 4}}>Color:<br/>
            <select value={filtros.color} onChange={e => setFiltros(f => ({...f, color: e.target.value}))} style={{width: 95, fontSize: '1.05rem', padding: 7, borderRadius: 7, border: '1.5px solid #8B0000', marginTop: 3}}>
              <option value="">Todos</option>
              {colores.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{
          background: '#f3f4f6',
          boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
          border: '2px solid #8B0000',
          borderRadius: 10,
          padding: '12px 16px',
          minWidth: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <label style={{fontWeight: 'bold', fontSize: '1.05rem', marginBottom: 4}}>Categoría:<br/>
            <select value={filtros.categoria} onChange={e => setFiltros(f => ({...f, categoria: e.target.value}))} style={{width: 95, fontSize: '1.05rem', padding: 7, borderRadius: 7, border: '1.5px solid #8B0000', marginTop: 3}}>
              <option value="">Todas</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {Array.isArray(productosFiltrados) && productosFiltrados.length > 0 ? (
        <div style={styles.galeria}>
          {productosFiltrados.map(p => (
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