//esta ruta detecta si es admin o no para que pueda mostrarse en la navbar, si no es admin no se muestra.
import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function RutaProtegidaAdmin({ children }) {
  const { usuario } = useUser()

  if (!usuario) {
    return <Navigate to="/login" />
  }

  if (usuario.rol !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default RutaProtegidaAdmin