import { useState } from 'react'
import { useCart } from '../context/CartContext'

function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCart()
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto, cantidad)
    setMostrarNotificacion(true)
    setTimeout(() => setMostrarNotificacion(false), 2000)
  }

  return (
    <div style={styles.card}>
      {producto.imagen && (
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          style={styles.imagen}
        />
      )}
      <div style={styles.contenido}>
        <h3 style={styles.titulo}>{producto.nombre}</h3>
        <p style={styles.descripcion}>{producto.descripcion}</p>
        <div style={styles.precio}>${Number(producto.precio).toFixed(2)}</div>
        
        <div style={styles.controles}>
          <div style={styles.cantidad}>
            <button 
              onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
              style={styles.botonCantidad}
              disabled={cantidad <= 1}
            >
              -
            </button>
            <span style={styles.numeroCantidad}>{cantidad}</span>
            <button 
              onClick={() => setCantidad(prev => prev + 1)}
              style={styles.botonCantidad}
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAgregarAlCarrito}
            style={styles.botonAgregar}
          >
            🛒 Agregar al carrito
          </button>
        </div>
      </div>

      {mostrarNotificacion && (
        <div style={styles.notificacion}>
          <span style={styles.notificacionTexto}>
            ✅ {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} agregada{cantidad === 1 ? '' : 's'} al carrito
          </span>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    width: '300px',
    position: 'relative',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    }
  },
  imagen: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  contenido: {
    padding: '15px'
  },
  titulo: {
    margin: '0 0 10px 0',
    fontSize: '1.2em',
    color: '#003366'
  },
  descripcion: {
    color: '#666',
    fontSize: '0.9em',
    marginBottom: '15px',
    minHeight: '40px'
  },
  precio: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: '15px'
  },
  controles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cantidad: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  botonCantidad: {
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    }
  },
  numeroCantidad: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center'
  },
  botonAgregar: {
    backgroundColor: '#ffd700',
    color: '#003366',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#ffed4a',
      transform: 'scale(1.02)'
    }
  },
  notificacion: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#003366',
    color: 'white',
    padding: '15px 25px',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    animation: 'slideIn 0.3s ease, fadeOut 0.3s ease 1.7s',
    zIndex: 1000
  },
  notificacionTexto: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
}

export default ProductCard