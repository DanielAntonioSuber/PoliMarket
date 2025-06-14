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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Registro</h2>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input name="apellido" placeholder="Apellido" onChange={handleChange} required />
      <input name="fecha_nacimiento" type="date" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Registrarse</button>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
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

export default Register