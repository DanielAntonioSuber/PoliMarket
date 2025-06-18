// 📄 routes/admin.js
const express = require('express')
const router = express.Router()
const pool = require('../db')
const multer = require('multer')
const { uploadImageToAzure, deleteImageFromAzure, extractFileNameFromUrl } = require('../azure-storage')

// Configurar multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes JPEG
    if (file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos JPEG'), false)
    }
  }
})

// Middleware para verificar si es admin
const verificarAdmin = (req, res, next) => {
  if (req.headers.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos de administrador' })
  }
  next()
}

// ✅ Obtener órdenes desde orden_detalle con nombre completo del cliente
router.get('/ordenes', verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, o.fecha, o.total,
             u.nombre || ' ' || u.apellido AS cliente,
             json_agg(json_build_object(
               'producto', od.nombre,
               'cantidad', od.cantidad,
               'precio', od.precio
             )) AS productos
      FROM ordenes o
      JOIN usuarios u ON o.usuario_id = u.id
      JOIN orden_detalle od ON od.orden_id = o.id
      GROUP BY o.id, u.nombre, u.apellido, o.fecha, o.total
      ORDER BY o.fecha DESC
    `)
    res.json(result.rows)
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
})

// ✅ Agregar nuevo producto con imagen en Azure Blob Storage
router.post('/productos', verificarAdmin, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, categoria_id } = req.body
  const imagen = req.file

  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos: nombre, precio y categoría son obligatorios' })
  }

  try {
    let url_imagen = null
    let imagenFileName = null

    // Si se subió una imagen, guardarla en Azure Blob Storage
    if (imagen) {
      const uploadResult = await uploadImageToAzure(imagen.buffer, imagen.originalname)
      url_imagen = uploadResult.url
      imagenFileName = uploadResult.fileName
    }

    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, url_imagen, categoria_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, descripcion, precio, url_imagen, categoria_id]
    )

    // Obtener el producto creado con su categoría
    const productoCreado = await pool.query(`
      SELECT p.*, c.nombre as categoria 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = $1
    `, [result.rows[0].id])

    res.status(201).json({ ...productoCreado.rows[0] })
  } catch (error) {
    console.error('Error al agregar producto:', error)
    res.status(500).json({ error: 'Error al guardar el producto' })
  }
})

// ✅ Obtener un producto específico
router.get('/productos/:id', verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [req.params.id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Error al obtener producto:', error)
    res.status(500).json({ error: 'Error al obtener el producto' })
  }
})

// ✅ Actualizar un producto con imagen en Azure Blob Storage
router.put('/productos/:id', verificarAdmin, upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio, categoria_id } = req.body
  const imagen = req.file

  if (!nombre || !precio || !categoria_id) {
    return res.status(400).json({ error: 'Faltan datos requeridos: nombre, precio y categoría son obligatorios' })
  }

  try {
    // Obtener el producto actual para verificar si tiene imagen
    const productoActual = await pool.query(
      'SELECT url_imagen FROM productos WHERE id = $1',
      [req.params.id]
    )

    if (productoActual.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    let url_imagen = productoActual.rows[0].url_imagen
    let imagenFileName = null

    // Si se subió una nueva imagen
    if (imagen) {
      // Eliminar la imagen anterior de Azure si existe
      if (url_imagen) {
        const fileName = extractFileNameFromUrl(url_imagen)
        if (fileName) {
          await deleteImageFromAzure(fileName)
        }
      }

      // Subir la nueva imagen
      const uploadResult = await uploadImageToAzure(imagen.buffer, imagen.originalname)
      url_imagen = uploadResult.url
      imagenFileName = uploadResult.fileName
    }

    const result = await pool.query(
      `UPDATE productos 
       SET nombre = $1, descripcion = $2, precio = $3, url_imagen = $4, categoria_id = $5
       WHERE id = $6
       RETURNING *`,
      [nombre, descripcion, precio, url_imagen, categoria_id, req.params.id]
    )

    // Obtener el producto actualizado con su categoría
    const productoActualizado = await pool.query(`
      SELECT p.*, c.nombre as categoria 
      FROM productos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = $1
    `, [req.params.id])

    res.json(productoActualizado.rows[0])
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
})

// ✅ Eliminar un producto
router.delete('/productos/:id', verificarAdmin, async (req, res) => {
  try {
    // Obtener la imagen del producto antes de eliminarlo
    const producto = await pool.query(
      'SELECT url_imagen FROM productos WHERE id = $1',
      [req.params.id]
    )

    if (producto.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    // Eliminar la imagen de Azure si existe
    if (producto.rows[0].url_imagen) {
      const fileName = extractFileNameFromUrl(producto.rows[0].url_imagen)
      if (fileName) {
        await deleteImageFromAzure(fileName)
      }
    }

    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING id',
      [req.params.id]
    )

    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
})

// ✅ Obtener todos los productos (vista admin)
router.get('/productos', verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY nombre')
    res.json(result.rows)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
})

module.exports = router