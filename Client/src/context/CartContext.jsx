import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])
  const [total, setTotal] = useState(0)

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito')
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado))
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
    // Calcular total
    const nuevoTotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    setTotal(nuevoTotal)
  }, [carrito])

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      // Buscar si el producto ya está en el carrito
      const productoExistente = prevCarrito.find(item => item.id === producto.id)

      if (productoExistente) {
        // Si existe, actualizar la cantidad
        return prevCarrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      } else {
        // Si no existe, agregar nuevo item
        return [...prevCarrito, { ...producto, cantidad }]
      }
    })
  }

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return

    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    )
  }

  const eliminarDelCarrito = (productoId) => {
    setCarrito(prevCarrito =>
      prevCarrito.filter(item => item.id !== productoId)
    )
  }

  const limpiarCarrito = () => {
    setCarrito([])
  }

  const obtenerCantidadTotal = () => {
    return carrito.reduce((sum, item) => sum + item.cantidad, 0)
  }

  return (
    <CartContext.Provider value={{
      carrito,
      total,
      agregarAlCarrito,
      actualizarCantidad,
      eliminarDelCarrito,
      limpiarCarrito,
      obtenerCantidadTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}