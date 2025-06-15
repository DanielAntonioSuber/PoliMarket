const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: 'alvaro',
  host: 'localhost',
  database: 'dw',
  password: 'alvaro',
  port: 5432,
})

// Verificar la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err)
  } else {
    console.log('✅ Conexión exitosa a la base de datos')
    release()
  }
})

module.exports = pool