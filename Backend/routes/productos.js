const express = require('express')
const router = express.Router()
const pool = require('../db')

// Obtener todos los productos con sus categorías y colores
router.get('/', async (req, res) => {
    try {
        console.log('Obteniendo todos los productos...');
        const result = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre, co.nombre as color_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN colores co ON p.color_id = co.id
            ORDER BY p.id DESC
        `);
        console.log('Productos encontrados:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
})

// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categorias ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// Crear una nueva categoría
router.post('/categorias', async (req, res) => {
    const { nombre } = req.body;
    
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una categoría
router.put('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }

    try {
        const result = await pool.query(
            'UPDATE categorias SET nombre = $1 WHERE id = $2 RETURNING *',
            [nombre, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar una categoría
router.delete('/categorias/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si hay productos usando esta categoría
        const productosResult = await pool.query(
            'SELECT COUNT(*) FROM productos WHERE categoria_id = $1',
            [id]
        );

        if (productosResult.rows[0].count > 0) {
            return res.status(400).json({ 
                error: 'No se puede eliminar la categoría porque hay productos asociados a ella' 
            });
        }

        const result = await pool.query(
            'DELETE FROM categorias WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los colores
router.get('/colores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM colores ORDER BY nombre');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener colores:', error);
        res.status(500).json({ error: 'Error al obtener colores' });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio, url_imagen, categoria_id, color_id, marca, stock } = req.body;
    
    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ error: 'Faltan datos requeridos: nombre, precio y categoría son obligatorios' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, url_imagen, categoria_id, color_id, marca, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [nombre, descripcion, precio, url_imagen, categoria_id, color_id, marca, stock]
        );

        // Obtener el producto creado con sus relaciones
        const productoCreado = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre, co.nombre as color_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN colores co ON p.color_id = co.id
            WHERE p.id = $1
        `, [result.rows[0].id]);

        res.status(201).json(productoCreado.rows[0]);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre, co.nombre as color_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN colores co ON p.color_id = co.id
            WHERE p.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, url_imagen, categoria_id, color_id, marca, stock } = req.body;
    
    if (!nombre || !precio || !categoria_id) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const result = await pool.query(`
            UPDATE productos 
            SET nombre = $1, descripcion = $2, precio = $3, url_imagen = $4, 
                categoria_id = $5, color_id = $6, marca = $7, stock = $8
            WHERE id = $9
            RETURNING *
        `, [nombre, descripcion, precio, url_imagen, categoria_id, color_id, marca, stock, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Obtener el producto actualizado con sus relaciones
        const updatedProduct = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre, co.nombre as color_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN colores co ON p.color_id = co.id
            WHERE p.id = $1
        `, [id]);

        res.json(updatedProduct.rows[0]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todas las marcas
router.get('/marcas', async (req, res) => {
    try {
        const result = await pool.query('SELECT DISTINCT marca FROM productos WHERE marca IS NOT NULL ORDER BY marca');
        res.json(result.rows.map(row => row.marca));
    } catch (error) {
        console.error('Error al obtener marcas:', error);
        res.status(500).json({ error: 'Error al obtener marcas' });
    }
});

// Búsqueda por nombre o descripción
router.get('/buscar', async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json([]);
    }

    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre as categoria_nombre, co.nombre as color_nombre
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN colores co ON p.color_id = co.id
            WHERE p.nombre ILIKE $1 OR p.descripcion ILIKE $1
            ORDER BY p.id DESC
        `, [`%${q}%`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({ error: 'Error al buscar productos' });
    }
});

module.exports = router