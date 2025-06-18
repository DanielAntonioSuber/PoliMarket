const { BlobServiceClient } = require('@azure/storage-blob')
require('dotenv').config()

// Configuración de Azure Blob Storage
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_CONTAINER_NAME || 'product-images'

if (!connectionString) {
  console.error('❌ Error: AZURE_STORAGE_CONNECTION_STRING no está configurada en las variables de entorno')
  process.exit(1)
}

// Crear cliente de Blob Service
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
const containerClient = blobServiceClient.getContainerClient(containerName)

// Función para subir imagen a Azure Blob Storage
async function uploadImageToAzure(fileBuffer, fileName) {
  try {
    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const uniqueFileName = `${timestamp}-${fileName}`
    
    // Obtener cliente del blob
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName)
    
    // Subir el archivo
    const uploadResult = await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: 'image/jpeg'
      }
    })
    
    // Retornar la URL del archivo subido
    return {
      url: blockBlobClient.url,
      fileName: uniqueFileName
    }
  } catch (error) {
    console.error('❌ Error al subir imagen a Azure:', error)
    throw new Error('Error al subir imagen a Azure Blob Storage')
  }
}

// Función para eliminar imagen de Azure Blob Storage
async function deleteImageFromAzure(fileName) {
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    await blockBlobClient.delete()
    console.log(`✅ Imagen eliminada de Azure: ${fileName}`)
  } catch (error) {
    console.error('❌ Error al eliminar imagen de Azure:', error)
    // No lanzar error para no interrumpir el flujo principal
  }
}

// Función para extraer el nombre del archivo de una URL de Azure
function extractFileNameFromUrl(url) {
  try {
    const urlParts = url.split('/')
    return urlParts[urlParts.length - 1]
  } catch (error) {
    console.error('❌ Error al extraer nombre de archivo de URL:', error)
    return null
  }
}

module.exports = {
  uploadImageToAzure,
  deleteImageFromAzure,
  extractFileNameFromUrl
} 