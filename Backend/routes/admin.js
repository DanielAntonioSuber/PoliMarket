// 📄 routes/admin.js
const express = require('express')
const router = express.Router()
const pool = require('../db')

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

// ✅ Agregar nuevo producto
router.post('/productos', verificarAdmin, async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Faltan datos requeridos' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, imagen)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [nombre, descripcion, precio, imagen]
    )
    res.status(201).json({ id: result.rows[0].id })
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

// ✅ Actualizar un producto
router.put('/productos/:id', verificarAdmin, async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Faltan datos requeridos' })
  }

  try {
    const result = await pool.query(
      `UPDATE productos 
       SET nombre = $1, descripcion = $2, precio = $3, imagen = $4
       WHERE id = $5
       RETURNING *`,
      [nombre, descripcion, precio, imagen, req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
})

// ✅ Eliminar un producto
router.delete('/productos/:id', verificarAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING id',
      [req.params.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

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