import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_URL } from '../config'

function PerfilUsuario() {
  const { usuario: usuarioContexto, logout } = useUser()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(usuarioContexto)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsuario() {
      if (!usuarioContexto?.id) return;
      setCargando(true)
      setError('')
      try {
        const res = await fetch(`${API_URL}/api/users/me?id=${usuarioContexto.id}`)
        const data = await res.json()
        if (res.ok && data.usuario) {
          setUsuario(data.usuario)
        } else {
          setError(data.error || 'No se pudo obtener el usuario')
        }
      } catch (err) {
        setError('Error de conexión')
      } finally {
        setCargando(false)
      }
    }
    fetchUsuario()
  }, [usuarioContexto])

  if (cargando) {
    return <div style={{textAlign:'center',marginTop:40}}>Cargando datos del usuario...</div>
  }
  if (error) {
    return <div style={{color:'red',textAlign:'center',marginTop:40}}>{error}</div>
  }

  // Formatear fecha de nacimiento si existe y es válida
  let fechaNacimiento = '-'
  if (usuario.fecha_nacimiento) {
    const fecha = new Date(usuario.fecha_nacimiento)
    if (!isNaN(fecha)) {
      fechaNacimiento = fecha.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })
    } else {
      fechaNacimiento = usuario.fecha_nacimiento
    }
  }

  return (
    <div style={styles.contenedor}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Mi Perfil</h2>
        <div style={styles.info}><b>ID:</b> {usuario.id ?? '-'}</div>
        <div style={styles.info}><b>Nombre:</b> {usuario.nombre ?? '-'}</div>
        <div style={styles.info}><b>Apellido:</b> {usuario.apellido ?? '-'}</div>
        <div style={styles.info}><b>Email:</b> {usuario.email ?? '-'}</div>
        <div style={styles.info}><b>Fecha de nacimiento:</b> {fechaNacimiento}</div>
        <div style={styles.info}><b>Rol:</b> {usuario.rol ?? '-'}</div>
        <button style={styles.boton} onClick={logout}>Cerrar sesión</button>
        <button style={styles.botonSecundario} onClick={() => navigate(-1)}>Volver</button>
      </div>
    </div>
  )
}

const styles = {
  contenedor: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa',
    padding: '40px 10px',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    border: '2px solid #8B0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titulo: {
    color: '#8B0000',
    fontWeight: 'bold',
    marginBottom: '24px',
    fontSize: '2rem',
  },
  info: {
    color: '#003366',
    fontSize: '1.1em',
    marginBottom: '12px',
    width: '100%',
    textAlign: 'left',
  },
  boton: {
    backgroundColor: '#ffd700',
    color: '#003366',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '7px',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    marginTop: '18px',
    width: '100%',
    transition: 'all 0.3s ease',
  },
  botonSecundario: {
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '7px',
    fontWeight: 'bold',
    fontSize: '1em',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%',
    transition: 'all 0.3s ease',
  }
}

export default PerfilUsuario 