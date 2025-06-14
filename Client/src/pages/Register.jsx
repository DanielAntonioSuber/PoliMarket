import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    email: '',
    password: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMensaje('')
    setError('')

    try {
      const res = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
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
    <div style={styles.container}>
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
              placeholder="Nombre" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              name="apellido" 
              placeholder="Apellido" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              name="fecha_nacimiento" 
              type="date" 
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
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
              onChange={handleChange} 
              required 
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
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
    maxWidth: '400px',
    border: '2px solid #8B0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  titulo: {
    fontSize: '2.5em',
    marginBottom: '30px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    width: '100%'
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
    marginTop: '10px',
    width: '100%',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
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
    border: '1px solid #c3e6cb',
    width: '100%'
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
    border: '1px solid #f5c6cb',
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