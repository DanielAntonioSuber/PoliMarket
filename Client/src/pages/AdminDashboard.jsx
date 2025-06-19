import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

function AdminDashboard() {
  const { usuario, esAdmin, cargando } = useUser()
  const navigate = useNavigate()

  const [ordenes, setOrdenes] = useState([])
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [colores, setColores] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    color_id: '',
    marca: '',
    stock: '',
    url_imagen: ''
  })
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    color: '',
    categoria: ''
  })

  const colorMap = {
    Rojo: '#FF0000',
    Azul: '#0000FF',
    Verde: '#008000',
    Negro: '#000000',
    Blanco: '#FFFFFF',
    Amarillo: '#FFFF00',
    Naranja: '#FFA500',
    Morado: '#800080',
    Rosa: '#FFC0CB',
    Gris: '#808080',
    Marrón: '#8B4513',
    Celeste: '#00BFFF',
    Violeta: '#EE82EE',
    // Agrega más si usas otros nombres
  };

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
        const resOrdenes = await fetch(`${API_URL}/api/admin/ordenes`, {
          headers: { rol: usuario.rol }
        })
        const dataOrdenes = await resOrdenes.json()
        if (resOrdenes.ok) {
          setOrdenes(dataOrdenes)
        }

        // Obtener productos
        const resProductos = await fetch(`${API_URL}/api/productos`)
        const dataProductos = await resProductos.json()
        if (resProductos.ok) {
          setProductos(dataProductos)
        }

        // Obtener categorías
        const resCategorias = await fetch(`${API_URL}/api/productos/categorias`)
        const dataCategorias = await resCategorias.json()
        if (resCategorias.ok) {
          setCategorias(dataCategorias)
        }

        // Obtener colores
        const resColores = await fetch(`${API_URL}/api/productos/colores`)
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
        ? `${API_URL}/api/admin/productos/${editandoId}`
        : `${API_URL}/api/admin/productos`
      
      // Crear FormData para enviar archivos
      const formData = new FormData()
      formData.append('nombre', form.nombre)
      formData.append('descripcion', form.descripcion || '')
      formData.append('precio', form.precio)
      formData.append('categoria_id', form.categoria_id)
      formData.append('color_id', form.color_id)
      formData.append('marca', form.marca)
      formData.append('stock', form.stock)
      formData.append('url_imagen', form.url_imagen)
      
      if (selectedFile) {
        formData.append('imagen', selectedFile)
      }
      
      const res = await fetch(url, {
        method: editandoId ? 'PUT' : 'POST',
        headers: {
          'rol': 'admin'
          // No incluir Content-Type para que el navegador lo establezca automáticamente con el boundary
        },
        body: formData
      })
      const data = await res.json()
      
      if (res.ok) {
        setMensaje(`✅ Producto ${editandoId ? 'actualizado' : 'agregado'} con éxito`)
        // Actualizar lista de productos
        const resProductos = await fetch(`${API_URL}/api/productos`)
        const dataProductos = await resProductos.json()
        setProductos(dataProductos)
        
        // Limpiar formulario
        limpiarFormulario()
      } else {
        setMensaje('❌ Error: ' + data.error)
      }
    } catch (err) {
      console.error('Error:', err)
      setMensaje('❌ Error al conectar con el servidor')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verificar que sea una imagen JPEG o PNG
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Por favor, selecciona una imagen en formato JPEG o PNG')
        e.target.value = null
        return
      }
      
      // Verificar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB')
        e.target.value = null
        return
      }
      
      // Crear URL para previsualización
      const imageUrl = URL.createObjectURL(file)
      setPreviewUrl(imageUrl)
      setSelectedFile(file)
    }
  }

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
      color_id: '',
      marca: '',
      stock: '',
      url_imagen: ''
    })
    setPreviewUrl(null)
    setSelectedFile(null)
    setEditandoId(null)
    setMostrarFormulario(false)
  }

  const handleEditar = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      categoria_id: producto.categoria_id || '',
      color_id: producto.color_id || '',
      marca: producto.marca || '',
      stock: producto.stock || '',
      url_imagen: producto.url_imagen || ''
    })
    setPreviewUrl(producto.url_imagen || null)
    setSelectedFile(null)
    setEditandoId(producto.id)
    setMostrarFormulario(true)
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/productos/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'rol': 'admin'
        }
      })

      if (res.ok) {
        setMensaje('✅ Producto eliminado con éxito')
        setProductos(productos.filter(p => p.id !== id))
      } else {
        const data = await res.json()
        setMensaje('❌ Error: ' + data.error)
      }
    } catch (err) {
      console.error('Error:', err)
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

  // Filtrado de productos en frontend
  const productosFiltrados = productos.filter(p => {
    const { precioMin, precioMax, color, categoria } = filtros
    let ok = true
    if (precioMin && Number(p.precio) < Number(precioMin)) ok = false
    if (precioMax && Number(p.precio) > Number(precioMax)) ok = false
    if (color && String(p.color_id) !== String(color)) ok = false
    if (categoria && String(p.categoria_id) !== String(categoria)) ok = false
    return ok
  })

  if (cargando) {
    return <div style={{ padding: '20px' }}>Cargando...</div>
  }

  if (!cargando && usuario && usuario.rol !== 'admin') {
    return <div style={{ padding: '20px' }}>No tienes permisos de administrador</div>
  }

  return (
    <div style={styles.contenedor}>
      <h1 style={{
        ...styles.titulo,
        fontFamily: 'Merriweather, serif',
        fontSize: '2.8rem',
        letterSpacing: '2px',
        fontWeight: 700
      }}>
        <span style={{...styles.tituloPoli, fontFamily: 'Merriweather, serif', fontSize: '2.8rem'}}>Poli</span>
        <span style={{...styles.tituloMarket, fontFamily: 'Merriweather, serif', fontSize: '2.8rem'}}>Market</span>
        <span style={styles.tituloAdmin}> - Panel de Administración</span>
      </h1>
      <p style={{
        ...styles.bienvenida,
        fontFamily: 'Merriweather, serif',
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '30px'
      }}>Bienvenido, {usuario?.nombre}</p>

      {/* Sección de Productos */}
      <div style={styles.seccion}>
        <div style={styles.header}>
          <h2 style={{ fontSize: '2.1rem', margin: 0 }}>📦 Productos</h2>
          <button 
            onClick={() => {
              setMostrarFormulario(!mostrarFormulario)
              if (!mostrarFormulario) {
                setEditandoId(null)
                setForm({
                  nombre: '',
                  descripcion: '',
                  precio: '',
                  categoria_id: '',
                  color_id: '',
                  marca: '',
                  stock: '',
                  url_imagen: ''
                })
                setSelectedFile(null)
                setPreviewUrl(null)
              }
            }}
            style={styles.botonAgregar}
          >
            {mostrarFormulario ? '❌ Cancelar' : '➕ Agregar Producto'}
          </button>
        </div>

        {/* Filtros de productos */}
        <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 18,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#f3f4f6',
            boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
            border: '2px solid #8B0000',
            borderRadius: 10,
            padding: '10px 14px',
            minWidth: 110,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <label style={{fontWeight: 'bold', fontSize: '1rem', marginBottom: 3}}>Precio mín:<br/>
              <input type="number" min="0" value={filtros.precioMin} onChange={e => setFiltros(f => ({...f, precioMin: e.target.value}))} style={{width: 70, fontSize: '1rem', padding: 5, borderRadius: 6, border: '1.5px solid #8B0000', marginTop: 2}} />
            </label>
          </div>
          <div style={{
            background: '#f3f4f6',
            boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
            border: '2px solid #8B0000',
            borderRadius: 10,
            padding: '10px 14px',
            minWidth: 110,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <label style={{fontWeight: 'bold', fontSize: '1rem', marginBottom: 3}}>Precio máx:<br/>
              <input type="number" min="0" value={filtros.precioMax} onChange={e => setFiltros(f => ({...f, precioMax: e.target.value}))} style={{width: 70, fontSize: '1rem', padding: 5, borderRadius: 6, border: '1.5px solid #8B0000', marginTop: 2}} />
            </label>
          </div>
          <div style={{
            background: '#f3f4f6',
            boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
            border: '2px solid #8B0000',
            borderRadius: 10,
            padding: '10px 14px',
            minWidth: 110,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <label style={{fontWeight: 'bold', fontSize: '1rem', marginBottom: 3}}>Color:<br/>
              <select value={filtros.color} onChange={e => setFiltros(f => ({...f, color: e.target.value}))} style={{width: 80, fontSize: '1rem', padding: 5, borderRadius: 6, border: '1.5px solid #8B0000', marginTop: 2}}>
                <option value="">Todos</option>
                {colores.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{
            background: '#f3f4f6',
            boxShadow: '0 2px 8px rgba(139,0,0,0.08)',
            border: '2px solid #8B0000',
            borderRadius: 10,
            padding: '10px 14px',
            minWidth: 110,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}>
            <label style={{fontWeight: 'bold', fontSize: '1rem', marginBottom: 3}}>Categoría:<br/>
              <select value={filtros.categoria} onChange={e => setFiltros(f => ({...f, categoria: e.target.value}))} style={{width: 80, fontSize: '1rem', padding: 5, borderRadius: 6, border: '1.5px solid #8B0000', marginTop: 2}}>
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </label>
          </div>
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
              {productosFiltrados.map(p => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.id}</td>
                  <td style={styles.td}>
                    {p.url_imagen && (
                      <img 
                        src={p.url_imagen} 
                        alt={p.nombre} 
                        style={styles.imagenMiniatura}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
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
                    {(() => {
                      const colorObj = colores.find(c => String(c.id) === String(p.color_id));
                      if (!colorObj) return 'Sin color';
                      return (
                        <span style={{ color: colorMap[colorObj.nombre] || '#000' }}>
                          {colorObj.nombre}
                        </span>
                      );
                    })()}
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
                categoria_id: '',
                color_id: '',
                marca: '',
                stock: '',
                url_imagen: ''
              })
              setSelectedFile(null)
              setPreviewUrl(null)
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
          <div style={styles.overlay} onClick={limpiarFormulario} />
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
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  style={styles.inputFile}
                />
                {previewUrl && (
                  <img src={previewUrl} alt="Previsualización" style={styles.previewImagen} />
                )}
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  value={form.url_imagen}
                  onChange={e => setForm({ ...form, url_imagen: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.botonesFormulario}>
                <button
                  type="button"
                  onClick={limpiarFormulario}
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
    alignItems: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#8B0000',
    fontFamily: 'Roboto, Arial, sans-serif',
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
    padding: '16px',
    textAlign: 'center',
    fontWeight: 'bolder',
    textTransform: 'uppercase',
    fontSize: '1rem',
    letterSpacing: '0.1em',
    textShadow: '1px 1px 4px rgba(0,0,0,0.15)',
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #e5e7eb',
    color: '#8B0000',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily: 'Roboto, Arial, sans-serif',
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
    padding: '12px 28px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    fontSize: '1.1rem',
    fontFamily: 'Montserrat, Arial, sans-serif',
    minWidth: '120px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  botonEliminar: {
    backgroundColor: 'transparent',
    color: '#dc2626',
    border: '2px solid #dc2626',
    padding: '12px 28px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    fontSize: '1.1rem',
    fontFamily: 'Montserrat, Arial, sans-serif',
    minWidth: '120px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  botonAgregar: {
    backgroundColor: 'transparent',
    color: '#8B0000',
    border: '2px solid #8B0000',
    padding: '18px 36px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    marginTop: '20px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(139, 0, 0, 0.1)',
    display: 'block',
    margin: '20px auto',
    fontFamily: 'Montserrat, Arial, sans-serif',
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
    padding: '14px 28px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    flex: 1,
    maxWidth: '200px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    fontFamily: 'Montserrat, Arial, sans-serif',
    ':hover': {
      backgroundColor: '#8B0000',
      color: 'white',
      transform: 'translateY(-2px)'
    }
  },
  botonGuardar: {
    backgroundColor: '#8B0000',
    color: 'white',
    padding: '14px 28px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    flex: 1,
    maxWidth: '200px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    fontFamily: 'Montserrat, Arial, sans-serif',
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
    padding: '32px',
    backgroundColor: '#8B0000',
    borderRadius: '18px',
    color: '#fff',
    minHeight: '80px',
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
  inputFile: {
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
    cursor: 'pointer',
    backgroundColor: 'white',
    ':focus': {
      outline: 'none',
      borderColor: '#8B0000',
      boxShadow: '0 0 0 3px rgba(139, 0, 0, 0.2)'
    }
  },
  previewImagen: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '2px solid #8B0000',
    margin: '10px auto',
    display: 'block'
  }
}

export default AdminDashboard
