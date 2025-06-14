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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Iniciar Sesión</h2>
      <input type="email" placeholder="Correo" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Entrar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '300px',
    margin: '30px auto'
  }
}

export default Login