const express = require('express')
const router = express.Router()
const pool = require('../db')

// Ruta principal para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY nombre')
    res.json(result.rows)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
})

// Ruta para obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nombre')
    res.json(result.rows)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
})

// Ruta para obtener todas las marcas
router.get('/marcas', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT marca FROM productos WHERE marca IS NOT NULL ORDER BY marca')
    res.json(result.rows.map(row => row.marca))
  } catch (error) {
    console.error('Error al obtener marcas:', error)
    res.status(500).json({ error: 'Error al obtener marcas' })
  }
})

// Búsqueda por nombre o descripción
router.get('/buscar', async (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Falta parámetro de búsqueda' })
  }

  try {
    const result = await pool.query(
      `SELECT * FROM productos 
       WHERE LOWER(nombre) LIKE $1 
          OR LOWER(descripcion) LIKE $1`,
      [`%${q.toLowerCase()}%`]
    )

    res.json(result.rows)
  } catch (err) {
    console.error('Error al buscar productos:', err)
    res.status(500).json({ error: 'Error al buscar productos' })
  }
})

module.exports = router