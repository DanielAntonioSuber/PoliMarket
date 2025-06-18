# Configuración de Azure Blob Storage para PoliMarket

## Requisitos Previos

1. Una cuenta de Azure con una cuenta de almacenamiento
2. Node.js y npm instalados
3. Las dependencias del proyecto instaladas

## Pasos para Configurar Azure Blob Storage

### 1. Crear una cuenta de almacenamiento en Azure

1. Ve al [Portal de Azure](https://portal.azure.com)
2. Crea una nueva cuenta de almacenamiento o usa una existente
3. Anota el nombre de la cuenta de almacenamiento

### 2. Obtener la cadena de conexión

1. En tu cuenta de almacenamiento, ve a "Claves de acceso"
2. Copia la "Cadena de conexión" (connection string)
3. La cadena se ve así:
   ```
   DefaultEndpointsProtocol=https;AccountName=tu_cuenta;AccountKey=tu_clave;EndpointSuffix=core.windows.net
   ```

### 3. Crear un contenedor

1. En tu cuenta de almacenamiento, ve a "Contenedores"
2. Crea un nuevo contenedor llamado `product-images`
3. Configura el nivel de acceso público como "Blob" para que las imágenes sean accesibles públicamente

### 4. Configurar las variables de entorno

1. Copia el archivo `env.example` a `.env`:
   ```bash
   cp env.example .env
   ```

2. Edita el archivo `.env` y configura:
   ```env
   AZURE_STORAGE_CONNECTION_STRING=tu_cadena_de_conexion_aqui
   AZURE_CONTAINER_NAME=product-images
   ```

### 5. Instalar dependencias

```bash
npm install
```

### 6. Verificar la configuración

1. Inicia el servidor:
   ```bash
   npm run dev
   ```

2. Si todo está configurado correctamente, verás:
   ```
   ✅ Servidor corriendo en http://localhost:3001
   ```

3. Si hay errores, verifica:
   - La cadena de conexión es correcta
   - El contenedor existe
   - Las variables de entorno están configuradas

## Funcionalidades Implementadas

- ✅ Subida de imágenes JPEG a Azure Blob Storage
- ✅ Generación automática de nombres únicos para archivos
- ✅ Eliminación automática de imágenes antiguas al actualizar
- ✅ Validación de tipo de archivo (solo JPEG)
- ✅ Límite de tamaño de archivo (5MB)
- ✅ Manejo de errores y mensajes informativos

## Estructura de Archivos

- `azure-storage.js` - Configuración y funciones de Azure Blob Storage
- `routes/admin.js` - Rutas modificadas para usar Azure Blob Storage
- `Client/src/pages/AdminDashboard.jsx` - Frontend modificado para enviar archivos

## Notas Importantes

- Las imágenes se almacenan con nombres únicos basados en timestamp
- Solo se aceptan archivos JPEG
- El tamaño máximo de archivo es 5MB
- Las imágenes se eliminan automáticamente de Azure cuando se elimina o actualiza un producto
- Las URLs de las imágenes son públicas y accesibles directamente desde Azure 