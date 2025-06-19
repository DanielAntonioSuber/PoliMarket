import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Login() {
  const { login } = useUser()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    
    const resultado = await login({ email, password })

    if (!resultado.success) {
      setError(resultado.error || 'Error al iniciar sesión')
    } else {
      navigate('/')
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
          <h3 style={styles.subtitulo}>Iniciar Sesión</h3>
          <div style={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input 
              type="password" 
              placeholder="Contraseña" 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Iniciar Sesión
          </button>
          {error && <p style={styles.error}>{error}</p>}
          <p style={styles.registro}>
            ¿No tienes cuenta?{' '}
            <a href="/register" style={styles.link}>
              Regístrate aquí
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
    padding: '20px',
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
    width: '100%',
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
    width: '100%'
  },
  registro: {
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

export default Login