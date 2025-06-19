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
    mesVencimiento: '',
    añoVencimiento: '',
    cvv: ''
  })
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })
  const [mostrarTicket, setMostrarTicket] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Validar código postal (exactamente 5 dígitos)
    if (name === 'codigoPostal') {
      const soloNumeros = value.replace(/\D/g, '')
      if (soloNumeros.length <= 5) {
        setFormData(prev => ({
          ...prev,
          [name]: soloNumeros
        }))
      }
      return
    }

    // Validar mes de vencimiento (1-12)
    if (name === 'mesVencimiento') {
      const soloNumeros = value.replace(/\D/g, '')
      if (soloNumeros === '' || (parseInt(soloNumeros) >= 1 && parseInt(soloNumeros) <= 12)) {
        setFormData(prev => ({
          ...prev,
          [name]: soloNumeros
        }))
      }
      return
    }

    // Validar año de vencimiento (2025-2035)
    if (name === 'añoVencimiento') {
      const soloNumeros = value.replace(/\D/g, '')
      // Permitir escribir mientras se está escribiendo
      setFormData(prev => ({
        ...prev,
        [name]: soloNumeros
      }))
      return
    }

    // Validar nombre y apellido (solo letras)
    if (name === 'nombre' || name === 'apellido') {
      const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
      setFormData(prev => ({
        ...prev,
        [name]: soloLetras
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validarFormulario = () => {
    // Validar campos obligatorios
    const camposRequeridos = ['nombre', 'apellido', 'email', 'direccion', 'ciudad', 'codigoPostal', 'tarjeta', 'mesVencimiento', 'añoVencimiento', 'cvv']
    for (const campo of camposRequeridos) {
      if (!formData[campo]) {
        setMensaje({ texto: 'Todos los campos son obligatorios', tipo: 'error' })
        return false
      }
    }

    // Validar código postal (exactamente 5 dígitos)
    if (formData.codigoPostal.length !== 5) {
      setMensaje({ texto: 'El código postal debe tener 5 dígitos', tipo: 'error' })
      return false
    }

    // Validar mes de vencimiento (1-12)
    const mes = parseInt(formData.mesVencimiento)
    if (mes < 1 || mes > 12) {
      setMensaje({ texto: 'El mes debe estar entre 1 y 12', tipo: 'error' })
      return false
    }

    // Validar año de vencimiento (2025-2035)
    const año = parseInt(formData.añoVencimiento)
    if (año < 2025 || año > 2035) {
      setMensaje({ texto: 'Ingresa fecha válida', tipo: 'error' })
      return false
    }

    // Validar tarjeta vencida
    if (año === 2025 && parseInt(formData.mesVencimiento) <= 5) {
      setMensaje({ texto: 'Tarjeta vencida', tipo: 'error' })
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
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.seccion}>
            <h4 style={styles.seccionTitulo}>Información de Envío</h4>
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
                maxLength="5"
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
            <div style={styles.fechaVencimiento}>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  name="mesVencimiento"
                  placeholder="Mes"
                  value={formData.mesVencimiento}
                  onChange={handleChange}
                  required
                  maxLength="2"
                  style={styles.inputFecha}
                />
              </div>
              <div style={styles.inputGroup}>
                <input
                  type="text"
                  name="añoVencimiento"
                  placeholder="Año"
                  value={formData.añoVencimiento}
                  onChange={handleChange}
                  required
                  maxLength="4"
                  style={styles.inputFecha}
                />
              </div>
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
            Pagar ${(total >= 1000 ? total * 1.16 : (total * 1.16) + 50).toFixed(2)}
          </button>
        </form>
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
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '40px 10px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    border: '2px solid #8B0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
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
    gap: '30px',
    width: '100%'
  },
  seccion: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    maxWidth: '450px',
    margin: '0 auto',
  },
  seccionTitulo: {
    color: '#8B0000',
    marginBottom: '15px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputGroup: {
    marginBottom: '15px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    maxWidth: '350px',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #8B0000',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  fechaVencimiento: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputFecha: {
    width: '80px',
    minWidth: '60px',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #8B0000',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  resumen: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    marginBottom: '30px',
    width: '100%'
  },
  resumenTitulo: {
    color: '#8B0000',
    marginBottom: '15px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0',
    textAlign: 'center'
  },
  total: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  button: {
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
  error: {
    color: '#DC143C',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  success: {
    color: '#28a745',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    fontWeight: 'bold'
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
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0'
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

export default Checkout 