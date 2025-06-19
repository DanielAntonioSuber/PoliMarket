import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dia: '',
    mes: '',
    año: '',
    email: '',
    password: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    
    // Validaciones específicas para cada campo
    if (name === 'nombre' || name === 'apellido') {
      // Solo permite letras y espacios
      const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
      setForm(prev => ({ ...prev, [name]: soloLetras }))
      return
    }

    if (name === 'dia') {
      // Solo permite números y valida rango 1-31
      const soloNumeros = value.replace(/\D/g, '')
      if (soloNumeros === '' || (parseInt(soloNumeros) >= 1 && parseInt(soloNumeros) <= 31)) {
        setForm(prev => ({ ...prev, [name]: soloNumeros }))
      }
      return
    }

    if (name === 'mes') {
      // Solo permite números y valida rango 1-12
      const soloNumeros = value.replace(/\D/g, '')
      if (soloNumeros === '' || (parseInt(soloNumeros) >= 1 && parseInt(soloNumeros) <= 12)) {
        setForm(prev => ({ ...prev, [name]: soloNumeros }))
      }
      return
    }

    if (name === 'año') {
      // Solo permite números y valida rango 1900-2025
      const soloNumeros = value.replace(/\D/g, '')
      // Permitir escribir mientras se está escribiendo
      setForm(prev => ({ ...prev, [name]: soloNumeros }))
      return
    }

    if (name === 'email') {
      // Permitir escribir el correo y validar al enviar
      setForm(prev => ({ ...prev, [name]: value }))
      return
    }

    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMensaje('')
    setError('')

    // Validaciones antes de enviar
    if (!form.nombre || !form.apellido || !form.dia || !form.mes || !form.año || !form.email || !form.password) {
      setError('Todos los campos son obligatorios')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(form.email)) {
      setError('El correo electrónico debe tener un formato válido con al menos 2 caracteres después del punto')
      return
    }

    // Validar fecha de nacimiento
    const dia = parseInt(form.dia)
    const mes = parseInt(form.mes)
    const año = parseInt(form.año)

    if (dia < 1 || dia > 31) {
      setError('El día debe estar entre 1 y 31')
      return
    }
    if (mes < 1 || mes > 12) {
      setError('El mes debe estar entre 1 y 12')
      return
    }
    if (año < 1900 || año > 2025) {
      setError('Ingresa fecha válida')
      return
    }

    // Construir la fecha en formato YYYY-MM-DD
    const fecha_nacimiento = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          fecha_nacimiento,
          email: form.email,
          password: form.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrar usuario')
      } else {
        setMensaje('¡Registro exitoso! Redirigiendo...')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      console.error(err)
      setError('Error de conexión con el servidor')
    }
  }

  return (
    <div style={styles.contenedor}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>
          <span style={styles.tituloPoli}>Poli</span>
          <span style={styles.tituloMarket}>Market</span>
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.subtitulo}>Crear Cuenta</h3>
          
          <div style={styles.inputGroup}>
            <input 
              name="nombre" 
              placeholder="Nombre (solo letras)" 
              value={form.nombre}
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              name="apellido" 
              placeholder="Apellido (solo letras)" 
              value={form.apellido}
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.fechaNacimiento}>
            <div style={styles.inputGroup}>
              <input 
                name="dia" 
                type="text"
                placeholder="Día (1-31)" 
                value={form.dia}
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <input 
                name="mes" 
                type="text"
                placeholder="Mes (1-12)" 
                value={form.mes}
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <input 
                name="año" 
                type="text"
                placeholder="Año (1900-2025)" 
                value={form.año}
                onChange={handleChange} 
                required 
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              value={form.email}
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña" 
              value={form.password}
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.boton}>
            Registrarse
          </button>

          {mensaje && <p style={styles.success}>{mensaje}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.login}>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" style={styles.link}>
              Inicia sesión aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

const styles = {
  contenedor: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#8B0000',
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    border: '2px solid #8B0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
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
    fontWeight: 'bold',
    width: '100%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '320px'
  },
  inputGroup: {
    position: 'relative',
    width: '100%'
  },
  fechaNacimiento: {
    display: 'flex',
    gap: '10px',
    width: '100%'
  },
  input: {
    width: '100%',
    padding: '15px',
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
  success: {
    color: '#28a745',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%'
  },
  error: {
    color: '#DC143C',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%'
  },
  login: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    width: '100%'
  },
  link: {
    color: '#8B0000',
    textDecoration: 'none',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}

export default Register