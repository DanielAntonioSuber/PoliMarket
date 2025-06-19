// 📄 Cart.jsx (actualizado con Finalizar compra)
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const { carrito, total, actualizarCantidad, eliminarDelCarrito, limpiarCarrito } = useCart()
  const { usuario } = useUser()
  const navigate = useNavigate()

  const handleComprar = () => {
    if (!usuario) {
      alert('Debes iniciar sesión para finalizar la compra.')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (carrito.length === 0) {
    return (
      <div style={styles.contenedor}>
        <h1 style={styles.titulo}>Tu carrito está vacío</h1>
        <p style={styles.mensaje}>Agrega algunos productos para comenzar a comprar</p>
        <button 
          onClick={() => navigate('/')}
          style={styles.botonContinuar}
        >
          Continuar comprando
        </button>
      </div>
    )
  }

  return (
    <div style={styles.contenedor}>
      <h1 style={styles.titulo}>🛒 Carrito de Compras</h1>

      <div style={styles.contenido}>
        <div style={styles.listaProductos}>
          {carrito.map(item => (
            <div key={item.id} style={styles.producto}>
              {item.imagen && (
                <img 
                  src={item.imagen} 
                  alt={item.nombre} 
                  style={styles.imagen}
                />
              )}
              <div style={styles.detalles}>
                <h3 style={styles.nombre}>{item.nombre}</h3>
                <p style={styles.descripcion}>{item.descripcion}</p>
                <div style={styles.precio}>
                  ${Number(item.precio).toFixed(2)}
                </div>
                <div style={styles.controles}>
                  <button 
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    style={styles.botonCantidad}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span style={styles.cantidad}>{item.cantidad}</span>
                  <button 
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    style={styles.botonCantidad}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => eliminarDelCarrito(item.id)}
                    style={styles.botonEliminar}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.resumen}>
          <h2 style={styles.resumenTitulo}>Resumen de la Compra</h2>
          <div style={styles.resumenItem}>
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={styles.resumenItem}>
            <span>IVA (16%):</span>
            <span>${(total * 0.16).toFixed(2)}</span>
          </div>
          <div style={styles.resumenItem}>
            <span>Envío:</span>
            <span>{total >= 1000 ? 'Gratis' : '$50.00'}</span>
          </div>
          <div style={styles.resumenItem}>
            <span>Total:</span>
            <span style={styles.total}>${(total >= 1000 ? total * 1.16 : (total * 1.16) + 50).toFixed(2)}</span>
          </div>
          <button 
            onClick={handleComprar}
            style={styles.botonComprar}
          >
            Proceder al Pago
          </button>
        </div>
      </div>
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
  contenido: {
    display: 'flex',
    gap: '30px',
    flexDirection: 'column'
  },
  listaProductos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  producto: {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  imagen: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  detalles: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  nombre: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#333'
  },
  descripcion: {
    color: '#666',
    fontSize: '0.9em'
  },
  precio: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#8B0000'
  },
  controles: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px'
  },
  botonCantidad: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    }
  },
  cantidad: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center'
  },
  botonEliminar: {
    backgroundColor: '#DC143C',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em'
  },
  resumen: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  resumenTitulo: {
    color: '#8B0000',
    marginBottom: '20px',
    fontSize: '1.5em'
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  total: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  botonComprar: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    width: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
  },
  mensaje: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px'
  },
  botonContinuar: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    display: 'block',
    margin: '0 auto',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
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
}

export default Cart