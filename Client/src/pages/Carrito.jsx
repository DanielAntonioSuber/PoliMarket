import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function Carrito() {
  const { carrito, total, actualizarCantidad, eliminarDelCarrito, limpiarCarrito } = useCart()
  const navigate = useNavigate()

  const handleComprar = () => {
    // Aquí iría la lógica para procesar la compra
    alert('¡Gracias por tu compra!')
    limpiarCarrito()
    navigate('/')
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
              </div>

              <div style={styles.controles}>
                <div style={styles.cantidad}>
                  <button 
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    style={styles.botonCantidad}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span style={styles.numeroCantidad}>{item.cantidad}</span>
                  <button 
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    style={styles.botonCantidad}
                  >
                    +
                  </button>
                </div>

                <div style={styles.subtotal}>
                  Subtotal: ${Number(item.precio * item.cantidad).toFixed(2)}
                </div>

                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  style={styles.botonEliminar}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.resumen}>
          <h2 style={styles.resumenTitulo}>Resumen de la compra</h2>
          <div style={styles.resumenItem}>
            <span>Subtotal:</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
          <div style={styles.resumenItem}>
            <span>Envío:</span>
            <span>Gratis</span>
          </div>
          <div style={styles.resumenItem}>
            <span>Total:</span>
            <span style={styles.total}>${Number(total).toFixed(2)}</span>
          </div>

          <button 
            onClick={handleComprar}
            style={styles.botonComprar}
          >
            Proceder al pago
          </button>

          <button 
            onClick={() => navigate('/')}
            style={styles.botonContinuar}
          >
            Continuar comprando
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
  mensaje: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px'
  },
  contenido: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '30px'
  },
  listaProductos: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  producto: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  imagen: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '5px'
  },
  detalles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  nombre: {
    margin: 0,
    color: '#003366'
  },
  descripcion: {
    color: '#666',
    fontSize: '0.9em'
  },
  precio: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: '1.1em'
  },
  controles: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px'
  },
  cantidad: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
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
  subtotal: {
    color: '#003366',
    fontWeight: 'bold'
  },
  botonEliminar: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em'
  },
  resumen: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: '20px'
  },
  resumenTitulo: {
    color: '#003366',
    marginTop: 0,
    marginBottom: '20px',
    textAlign: 'center'
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  total: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  botonComprar: {
    backgroundColor: '#ffd700',
    color: '#003366',
    border: 'none',
    padding: '15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '20px',
    fontSize: '1.1em',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#ffed4a',
      transform: 'scale(1.02)'
    }
  },
  botonContinuar: {
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '10px',
    fontSize: '1.1em',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#004080',
      transform: 'scale(1.02)'
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

export default Carrito 