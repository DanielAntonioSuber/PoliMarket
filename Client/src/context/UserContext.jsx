import { createContext, useContext, useEffect, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
    setCargando(false)
  }, [])

  async function login({ email, password }) {
    try {
      const res = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      setUsuario(data.usuario)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  async function register(nombre, email, password) {
    const nuevoUsuario = { nombre, email, rol: 'cliente' }
    setUsuario(nuevoUsuario)
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
  }

  const esAdmin = usuario?.rol === 'admin'

  return (
    <UserContext.Provider value={{ usuario, login, logout, register, esAdmin, cargando }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}