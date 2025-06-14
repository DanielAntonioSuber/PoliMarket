import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { usuario, esAdmin, cargando } = useUser()
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState([])
  const [productos, setProductos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: ''
  })
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  useEffect(() => {
    if (!cargando) {
      if (!usuario) {
        navigate('/')
      } else if (usuario.rol !== 'admin') {
        navigate('/')
      }
    }
  }, [cargando, usuario, navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener órdenes
        const resOrdenes = await fetch('http://localhost:3001/api/admin/ordenes', {
          headers: { rol: usuario.rol }
        })
        const dataOrdenes = await resOrdenes.json()
        if (resOrdenes.ok) {
          setOrdenes(dataOrdenes)
        }

        // Obtener productos
        const resProductos = await fetch('http://localhost:3001/api/productos')
        const dataProductos = await resProductos.json()
        if (resProductos.ok) {
          setProductos(dataProductos)
        }
      } catch (err) {
        console.error('❌ Error al obtener datos:', err)
      }
    }

    if (esAdmin) {
      fetchData()
    }
  }, [esAdmin, usuario])

  const handleSubmit = async e => {
    e.preventDefault()
    setMensaje('')
    try {
      const url = editandoId 
        ? `http://localhost:3001/api/admin/productos/${editandoId}`
        : 'http://localhost:3001/api/admin/productos'
      
      const res = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          rol: usuario.rol
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      
      if (res.ok) {
        setMensaje(`✅ Producto ${editandoId ? 'actualizado' : 'agregado'} con éxito`)
        // Actualizar lista de productos
        const resProductos = await fetch('http://localhost:3001/api/productos')
        const dataProductos = await resProductos.json()
        setProductos(dataProductos)
        
        // Limpiar formulario
        setForm({
          nombre: '',
          descripcion: '',
          precio: '',
          imagen: ''
        })
        setEditandoId(null)
        setMostrarFormulario(false)
      } else {
        setMensaje('❌ Error: ' + data.error)
      }
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor')
    }
  }

  const handleEditar = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      imagen: producto.imagen || ''
    })
    setEditandoId(producto.id)
    setMostrarFormulario(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      const res = await fetch(`http://localhost:3001/api/admin/productos/${id}`, {
        method: 'DELETE',
        headers: { rol: usuario.rol }
      })

      if (res.ok) {
        setMensaje('✅ Producto eliminado con éxito')
        setProductos(productos.filter(p => p.id !== id))
      } else {
        const data = await res.json()
        setMensaje('❌ Error: ' + data.error)
      }
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor')
    }
  }

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando...</div>
  }

  if (!cargando && usuario && usuario.rol !== 'admin') {
    return <div style={{ padding: '20px' }}>No tienes permisos de administrador</div>
  }

  return (
    <div style={styles.contenedor}>
      <h1 style={styles.titulo}>
        <span style={styles.tituloPoli}>Poli</span>
        <span style={styles.tituloMarket}>Market</span>
        <span style={styles.tituloAdmin}> - Panel de Administración</span>
      </h1>
      <p style={styles.bienvenida}>Bienvenido, {usuario?.nombre}</p>

      <div style={styles.seccion}>
        <div style={styles.header}>
          <h2>📦 Productos</h2>
          <button 
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario)
              if (!mostrarFormulario) {
                setEditandoId(null)
                setForm({
                  nombre: '',
                  descripcion: '',
                  precio: '',
                  imagen: ''
                })
              }
            }}
            style={styles.botonAgregar}
          >
            {mostrarFormulario ? '❌ Cancelar' : '➕ Agregar Producto'}
          </button>
        </div>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} style={styles.formulario}>
            <h3 style={{ color: '#8B0000', marginBottom: '20px', textAlign: 'center' }}>
              {editandoId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </h3>
            <input 
              type="text" 
              placeholder="Nombre" 
              value={form.nombre} 
              onChange={e => setForm({ ...form, nombre: e.target.value })} 
              required 
              style={styles.input}
            />
            <textarea 
              placeholder="Descripción" 
              value={form.descripcion} 
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              style={styles.textarea}
            />
            <input 
              type="number" 
              placeholder="Precio" 
              value={form.precio} 
              onChange={e => setForm({ ...form, precio: e.target.value })} 
              required 
              style={styles.input}
            />
            <input 
              type="text" 
              placeholder="URL de imagen" 
              value={form.imagen} 
              onChange={e => setForm({ ...form, imagen: e.target.value })} 
              style={styles.input}
            />
            <button type="submit" style={styles.botonGuardar}>
              {editandoId ? 'Actualizar' : 'Guardar'} Producto
            </button>
            {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
          </form>
        )}

        <div style={styles.tabla}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Imagen</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.id}</td>
                  <td style={styles.td}>
                    {p.imagen && (
                      <img 
                        src={p.imagen} 
                        alt={p.nombre} 
                        style={styles.imagenMiniatura}
                      />
                    )}
                  </td>
                  <td style={styles.td}>{p.nombre}</td>
                  <td style={styles.td}>{p.descripcion}</td>
                  <td style={styles.td}>${Number(p.precio).toFixed(2)}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEditar(p)}
                      style={styles.botonEditar}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleEliminar(p.id)}
                      style={styles.botonEliminar}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.seccion}>
        <h2>📋 Pedidos recientes</h2>
        {ordenes.length === 0 ? (
          <p>No hay pedidos recientes</p>
        ) : (
          ordenes.map(o => (
            <div key={o.id} style={styles.orden}>
              <h3>🧾 Orden #{o.id}</h3>
              <p><strong>Cliente:</strong> {o.cliente}</p>
              <p><strong>Fecha:</strong> {new Date(o.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${Number(o.total || 0).toFixed(2)}</p>

              <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.th}>Producto</th>
                    <th style={styles.th}>Cantidad</th>
                    <th style={styles.th}>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {o.productos.map((p, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{p.producto}</td>
                      <td style={styles.td}>{p.cantidad}</td>
                      <td style={styles.td}>${Number(p.precio).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  contenedor: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#fff',
    minHeight: '100vh'
  },
  seccion: {
    marginBottom: '40px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#8B0000',
    borderRadius: '10px',
    color: '#fff'
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '600px',
    margin: '25px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    border: '2px solid #8B0000'
  },
  textarea: {
    minHeight: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #8B0000',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
    '&:focus': {
      outline: 'none',
      borderColor: '#B22222',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  },
  tabla: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  th: {
    backgroundColor: '#8B0000',
    color: '#fff',
    padding: '15px',
    textAlign: 'left',
    borderBottom: '2px solid #B22222',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    verticalAlign: 'middle',
    fontSize: '15px'
  },
  imagenMiniatura: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '2px solid #8B0000'
  },
  botonAgregar: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
  },
  botonGuardar: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
  },
  botonEditar: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)'
    }
  },
  botonEliminar: {
    backgroundColor: '#B22222',
    color: '#fff',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#DC143C',
      transform: 'translateY(-2px)'
    }
  },
  mensaje: {
    padding: '15px',
    borderRadius: '8px',
    marginTop: '15px',
    backgroundColor: '#8B0000',
    color: '#fff',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  orden: {
    border: '2px solid #8B0000',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '25px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(139, 0, 0, 0.1)'
  },
  titulo: {
    fontSize: '2.5em',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#8B0000',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  },
  tituloPoli: {
    color: '#8B0000',
    fontWeight: 'bold'
  },
  tituloMarket: {
    color: '#B22222',
    fontWeight: 'bold'
  },
  tituloAdmin: {
    color: '#8B0000',
    fontSize: '0.8em',
    marginLeft: '15px',
    fontStyle: 'italic'
  },
  bienvenida: {
    color: '#8B0000',
    marginBottom: '25px',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #8B0000',
    fontSize: '16px',
    width: '100%',
    transition: 'all 0.3s ease',
    '&:focus': {
      outline: 'none',
      borderColor: '#B22222',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  }
}

export default AdminDashboard
