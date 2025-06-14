import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { usuario, esAdmin, cargando } = useUser()
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState([])
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [colores, setColores] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    categoria_id: '',
    color_id: '',
    marca: '',
    stock: ''
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

        // Obtener categorías
        const resCategorias = await fetch('http://localhost:3001/api/productos/categorias')
        const dataCategorias = await resCategorias.json()
        if (resCategorias.ok) {
          setCategorias(dataCategorias)
        }

        // Obtener colores
        const resColores = await fetch('http://localhost:3001/api/productos/colores')
        const dataColores = await resColores.json()
        if (resColores.ok) {
          setColores(dataColores)
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
      
      // Asegurarse de que categoria_id y color_id sean números
      const formData = {
        ...form,
        categoria_id: parseInt(form.categoria_id),
        color_id: parseInt(form.color_id)
      }
      
      const res = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          rol: usuario.rol
        },
        body: JSON.stringify(formData)
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
          imagen: '',
          categoria_id: '',
          color_id: '',
          marca: '',
          stock: ''
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
      imagen: producto.imagen || '',
      categoria_id: producto.categoria_id || '',
      color_id: producto.color_id || '',
      marca: producto.marca || '',
      stock: producto.stock || ''
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }))
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

      {/* Sección de Productos */}
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
                  imagen: '',
                  categoria_id: '',
                  color_id: '',
                  marca: '',
                  stock: ''
                })
              }
            }}
            style={styles.botonAgregar}
          >
            {mostrarFormulario ? '❌ Cancelar' : '➕ Agregar Producto'}
          </button>
        </div>

        {/* Tabla de Productos */}
        <div style={styles.tabla}>
          <table>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Imagen</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Color</th>
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
                    {categorias.find(c => c.id === p.categoria_id)?.nombre || 'Sin categoría'}
                  </td>
                  <td style={styles.td}>
                    {colores.find(c => c.id === p.color_id)?.nombre || 'Sin color'}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEditar(p)}
                      style={styles.botonEditar}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      style={styles.botonEliminar}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botón Agregar Producto */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setMostrarFormulario(true)
              setEditandoId(null)
              setForm({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: '',
                categoria_id: '',
                color_id: '',
                marca: '',
                stock: ''
              })
            }}
            className="inline-flex items-center px-6 py-3 border-2 border-[#8B0000] text-[#8B0000] rounded-lg hover:bg-[#8B0000] hover:text-white transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl"
          >
            ➕ Agregar Nuevo Producto
          </button>
        </div>
      </div>

      {/* Formulario de Producto */}
      {mostrarFormulario && (
        <>
          <div style={styles.overlay} onClick={() => setMostrarFormulario(false)} />
          <div style={styles.formulario}>
            <h3 style={styles.tituloFormulario}>
              {editandoId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </h3>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '90%', maxWidth: '400px' }}>
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
                  rows="1"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={form.precio}
                  onChange={e => setForm({ ...form, precio: e.target.value })}
                  required
                  style={styles.input}
                />
                <select
                  value={form.categoria_id}
                  onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                  required
                  style={styles.select}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={form.color_id}
                  onChange={e => setForm({ ...form, color_id: e.target.value })}
                  style={styles.select}
                >
                  <option value="">Seleccione un color</option>
                  {colores.map(color => (
                    <option key={color.id} value={color.id}>
                      {color.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="URL de imagen"
                  value={form.imagen}
                  onChange={e => setForm({ ...form, imagen: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.botonesFormulario}>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false)
                    setEditandoId(null)
                    setForm({
                      nombre: '',
                      descripcion: '',
                      precio: '',
                      imagen: '',
                      categoria_id: '',
                      color_id: '',
                      marca: '',
                      stock: ''
                    })
                  }}
                  style={styles.botonCancelar}
                >
                  ❌ Cancelar
                </button>
                <button type="submit" style={styles.botonGuardar}>
                  {editandoId ? '💾 Actualizar' : '💾 Guardar'} Producto
                </button>
              </div>
              {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
            </form>
          </div>
        </>
      )}

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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  titulo: {
    color: '#8B0000',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: '2px 2px 4px rgba(139, 0, 0, 0.2)',
    width: '100%'
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 4px 6px rgba(139, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  th: {
    backgroundColor: '#8B0000',
    color: 'white',
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    letterSpacing: '0.05em'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    color: '#374151',
    textAlign: 'center'
  },
  imagenMiniatura: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '2px solid #8B0000',
    margin: '0 auto',
    display: 'block'
  },
  botonEditar: {
    backgroundColor: 'transparent',
    color: '#8B0000',
    border: '2px solid #8B0000',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    ':hover': {
      backgroundColor: '#8B0000',
      color: 'white'
    }
  },
  botonEliminar: {
    backgroundColor: 'transparent',
    color: '#dc2626',
    border: '2px solid #dc2626',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    ':hover': {
      backgroundColor: '#dc2626',
      color: 'white'
    }
  },
  botonAgregar: {
    backgroundColor: 'transparent',
    color: '#8B0000',
    border: '2px solid #8B0000',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(139, 0, 0, 0.1)',
    display: 'block',
    margin: '20px auto',
    ':hover': {
      backgroundColor: '#8B0000',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(139, 0, 0, 0.2)'
    }
  },
  formulario: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    width: '90%',
    maxWidth: '500px',
    border: '2px solid #8B0000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tituloFormulario: {
    color: '#8B0000',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '1.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadow: '2px 2px 4px rgba(139, 0, 0, 0.2)',
    borderBottom: '3px solid #8B0000',
    paddingBottom: '8px',
    width: '100%'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '2px solid #8B0000',
    borderRadius: '6px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    height: '40px',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#8B0000',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '2px solid #8B0000',
    borderRadius: '6px',
    fontSize: '0.95rem',
    minHeight: '40px',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    ':focus': {
      outline: 'none',
      borderColor: '#8B0000',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '2px solid #8B0000',
    borderRadius: '6px',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    height: '40px',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    cursor: 'pointer',
    ':focus': {
      outline: 'none',
      borderColor: '#8B0000',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  },
  botonesFormulario: {
    display: 'flex',
    gap: '8px',
    marginTop: '15px',
    width: '100%',
    justifyContent: 'center'
  },
  botonCancelar: {
    backgroundColor: 'transparent',
    color: '#8B0000',
    border: '2px solid #8B0000',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    flex: 1,
    maxWidth: '200px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    ':hover': {
      backgroundColor: '#8B0000',
      color: 'white',
      transform: 'translateY(-2px)'
    }
  },
  botonGuardar: {
    backgroundColor: '#8B0000',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    flex: 1,
    maxWidth: '200px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    ':hover': {
      backgroundColor: '#6B0000',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
  },
  mensaje: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
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
  }
}

export default AdminDashboard
