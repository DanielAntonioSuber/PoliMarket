const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Cargar variables de entorno desde el archivo .env
const envPath = path.resolve(__dirname, '.env')
console.log('Buscando archivo .env en:', envPath)
dotenv.config({ path: envPath })

// Verificar que las variables de entorno se cargaron
console.log('Variables de entorno cargadas:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : 'no definida',
  DB_PORT: process.env.DB_PORT
})

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

async function initDb() {
  try {
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'db.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // Ejecutar el script SQL
    await pool.query(sql)
    console.log('✅ Base de datos inicializada correctamente')
    
    // Obtener IDs de categorías
    const categorias = await pool.query('SELECT id, nombre FROM categorias')
    const categoriaMap = {}
    categorias.rows.forEach(cat => {
      categoriaMap[cat.nombre] = cat.id
    })
    
    // Insertar productos de ejemplo
    const productos = [
      {
        nombre: 'Smartphone XYZ',
        descripcion: 'Último modelo con cámara de alta resolución',
        precio: 8999.99,
        url_imagen: 'https://example.com/smartphone.jpg',
        categoria_id: categoriaMap['Electrónica'],
        marca: 'TechBrand',
        stock: 50
      },
      {
        nombre: 'Camiseta Casual',
        descripcion: 'Camiseta 100% algodón',
        precio: 299.99,
        url_imagen: 'https://example.com/camiseta.jpg',
        categoria_id: categoriaMap['Ropa'],
        marca: 'FashionCo',
        stock: 100
      },
      {
        nombre: 'Lámpara LED',
        descripcion: 'Lámpara moderna con control de intensidad',
        precio: 499.99,
        url_imagen: 'https://example.com/lampara.jpg',
        categoria_id: categoriaMap['Hogar'],
        marca: 'HomeStyle',
        stock: 30
      },
      {
        nombre: 'Balón de Fútbol',
        descripcion: 'Balón profesional talla 5',
        precio: 399.99,
        url_imagen: 'https://example.com/balon.jpg',
        categoria_id: categoriaMap['Deportes'],
        marca: 'SportPro',
        stock: 75
      },
      {
        nombre: 'Novela Bestseller',
        descripcion: 'La novela más vendida del año',
        precio: 199.99,
        url_imagen: 'https://example.com/libro.jpg',
        categoria_id: categoriaMap['Libros'],
        marca: 'Editorial XYZ',
        stock: 200
      },
      {
        nombre: 'Set de Construcción',
        descripcion: 'Juego de construcción para niños',
        precio: 599.99,
        url_imagen: 'https://example.com/juguete.jpg',
        categoria_id: categoriaMap['Juguetes'],
        marca: 'ToyWorld',
        stock: 40
      }
    ]

    for (const producto of productos) {
      await pool.query(
        `INSERT INTO productos (nombre, descripcion, precio, url_imagen, categoria_id, marca, stock)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          producto.nombre,
          producto.descripcion,
          producto.precio,
          producto.url_imagen,
          producto.categoria_id,
          producto.marca,
          producto.stock
        ]
      )
    }
    console.log('✅ Productos de ejemplo agregados')

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error)
  } finally {
    await pool.end()
  }
}

initDb() 