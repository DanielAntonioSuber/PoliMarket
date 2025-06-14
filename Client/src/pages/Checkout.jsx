import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Ticket({ carrito, total, formData }) {
  const fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div style={styles.ticket}>
      <div style={styles.ticketHeader}>
        <h2 style={styles.ticketTitulo}>
          <span style={styles.tituloPoli}>Poli</span>
          <span style={styles.tituloMarket}>Market</span>
        </h2>
        <p style={styles.ticketFecha}>Fecha: {fecha}</p>
      </div>

      <div style={styles.ticketInfo}>
        <h3 style={styles.ticketSubtitulo}>Información del Cliente</h3>
        <p>Nombre: {formData.nombre} {formData.apellido}</p>
        <p>Email: {formData.email}</p>
        <p>Dirección: {formData.direccion}</p>
        <p>Ciudad: {formData.ciudad}</p>
        <p>Código Postal: {formData.codigoPostal}</p>
      </div>

      <div style={styles.ticketProductos}>
        <h3 style={styles.ticketSubtitulo}>Productos</h3>
        {carrito.map((item, index) => (
          <div key={index} style={styles.ticketItem}>
            <span>{item.nombre}</span>
            <span>x{item.cantidad}</span>
            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div style={styles.ticketTotal}>
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div style={styles.ticketFooter}>
        <p>¡Gracias por tu compra!</p>
        <p>Número de Ticket: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
      </div>
    </div>
  )
}

function Checkout() {
  const navigate = useNavigate()
  const { carrito, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    tarjeta: '',
    fechaVencimiento: '',
    cvv: ''
  })
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [mostrarTicket, setMostrarTicket] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Formatear fecha de vencimiento automáticamente
    if (name === 'fechaVencimiento') {
      let formattedValue = value.replace(/\D/g, '') // Eliminar caracteres no numéricos
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4)
      }
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validarFormulario = () => {
    // Verificar que todos los campos estén llenos
    const camposRequeridos = [
      'nombre', 'apellido', 'email', 'direccion', 
      'ciudad', 'codigoPostal', 'tarjeta', 
      'fechaVencimiento', 'cvv'
    ]

    for (const campo of camposRequeridos) {
      if (!formData[campo].trim()) {
        setMensaje({ texto: 'Por favor, complete todos los campos del formulario', tipo: 'error' })
        return false
      }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMensaje({ texto: 'Por favor, ingrese un email válido', tipo: 'error' })
      return false
    }

    // Validar formato de tarjeta (16 dígitos)
    const tarjetaRegex = /^\d{16}$/
    if (!tarjetaRegex.test(formData.tarjeta.replace(/\s/g, ''))) {
      setMensaje({ texto: 'El número de tarjeta debe tener 16 dígitos', tipo: 'error' })
      return false
    }

    // Validar formato de fecha (MM/YY)
    const fechaRegex = /^\d{2}\/\d{2}$/
    if (!fechaRegex.test(formData.fechaVencimiento)) {
      setMensaje({ texto: 'La fecha de vencimiento debe tener el formato MM/YY', tipo: 'error' })
      return false
    }

    // Validar CVV (3 o 4 dígitos)
    const cvvRegex = /^\d{3,4}$/
    if (!cvvRegex.test(formData.cvv)) {
      setMensaje({ texto: 'El CVV debe tener 3 o 4 dígitos', tipo: 'error' })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje({ texto: '', tipo: '' })

    if (!validarFormulario()) {
      return
    }

    // Simulamos el procesamiento del pago
    setMensaje({ texto: 'Procesando pago...', tipo: 'success' })
    
    // Esperamos 1.5 segundos para simular el procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Pago exitoso
    setMensaje({ texto: '¡Pago procesado con éxito!', tipo: 'success' })
    setMostrarTicket(true)
    clearCart()
    setTimeout(() => navigate('/'), 5000) // Aumentamos el tiempo para que puedan ver el ticket
  }

  // Verificar si carrito existe y tiene elementos
  if (!carrito || carrito.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.titulo}>Carrito Vacío</h2>
          <p style={styles.mensaje}>No hay productos en tu carrito</p>
          <button 
            onClick={() => navigate('/')} 
            style={styles.button}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    )
  }

  if (mostrarTicket) {
    return (
      <div style={styles.container}>
        <Ticket carrito={carrito} total={total} formData={formData} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>
          <span style={styles.tituloPoli}>Poli</span>
          <span style={styles.tituloMarket}>Market</span>
        </h2>
        <h3 style={styles.subtitulo}>Finalizar Compra</h3>

        <div style={styles.resumen}>
          <h4 style={styles.resumenTitulo}>Resumen del Pedido</h4>
          {carrito.map((item, index) => (
            <div key={index} style={styles.item}>
              <span>{item.nombre}</span>
              <span>Cantidad: {item.cantidad}</span>
              <span>${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.total}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.seccion}>
            <h4 style={styles.seccionTitulo}>Información Personal</h4>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.seccion}>
            <h4 style={styles.seccionTitulo}>Dirección de Envío</h4>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="codigoPostal"
                placeholder="Código Postal"
                value={formData.codigoPostal}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.seccion}>
            <h4 style={styles.seccionTitulo}>Información de Pago</h4>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="tarjeta"
                placeholder="Número de Tarjeta (16 dígitos)"
                value={formData.tarjeta}
                onChange={handleChange}
                required
                maxLength="16"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="fechaVencimiento"
                placeholder="MM/YY"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                required
                maxLength="5"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="cvv"
                placeholder="CVV (3-4 dígitos)"
                value={formData.cvv}
                onChange={handleChange}
                required
                maxLength="4"
                style={styles.input}
              />
            </div>
          </div>

          {mensaje.texto && (
            <p style={mensaje.tipo === 'error' ? styles.error : styles.success}>
              {mensaje.texto}
            </p>
          )}

          <button type="submit" style={styles.button}>
            Pagar ${total.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    border: '2px solid #8B0000'
  },
  titulo: {
    fontSize: '2.5em',
    marginBottom: '30px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px'
  },
  tituloPoli: {
    color: '#8B0000',
    fontWeight: 'bold'
  },
  tituloMarket: {
    color: '#B22222',
    fontWeight: 'bold'
  },
  subtitulo: {
    color: '#8B0000',
    fontSize: '1.8em',
    marginBottom: '25px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  seccion: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0'
  },
  seccionTitulo: {
    color: '#8B0000',
    marginBottom: '15px',
    fontSize: '1.2em',
    fontWeight: 'bold'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #8B0000',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    '&:focus': {
      borderColor: '#B22222',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  },
  button: {
    backgroundColor: '#8B0000',
    color: '#fff',
    padding: '15px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
  },
  error: {
    color: '#DC143C',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#f8d7da',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #f5c6cb'
  },
  success: {
    color: '#28a745',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#d4edda',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #c3e6cb'
  },
  resumen: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    border: '1px solid #e0e0e0'
  },
  resumenTitulo: {
    color: '#8B0000',
    marginBottom: '15px',
    fontSize: '1.2em',
    fontWeight: 'bold'
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0'
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    marginTop: '10px',
    borderTop: '2px solid #8B0000',
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  mensaje: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px'
  },
  ticket: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    border: '2px solid #8B0000',
    fontFamily: 'monospace'
  },
  ticketHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '2px dashed #8B0000',
    paddingBottom: '20px'
  },
  ticketTitulo: {
    fontSize: '2em',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px'
  },
  ticketFecha: {
    color: '#666',
    fontSize: '0.9em'
  },
  ticketInfo: {
    marginBottom: '30px',
    borderBottom: '1px dashed #8B0000',
    paddingBottom: '20px'
  },
  ticketSubtitulo: {
    color: '#8B0000',
    fontSize: '1.2em',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  ticketProductos: {
    marginBottom: '30px',
    borderBottom: '1px dashed #8B0000',
    paddingBottom: '20px'
  },
  ticketItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontSize: '0.9em'
  },
  ticketTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
    marginBottom: '30px',
    borderTop: '2px dashed #8B0000',
    borderBottom: '2px dashed #8B0000',
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  ticketFooter: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9em'
  }
}

export default Checkout 