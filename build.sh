#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

set -e

echo -e "${BLUE}Iniciando proceso de build...${NC}"

# Instalar dependencias del cliente
echo -e "${GREEN}Instalando dependencias del cliente...${NC}"
cd Client
npm install

# Build del cliente
echo -e "${GREEN}Construyendo el cliente...${NC}"
npm run build

# Volver al directorio raíz
cd ..

# Instalar dependencias del backend
echo -e "${GREEN}Instalando dependencias del backend...${NC}"
cd Backend
npm install

# Volver al directorio raíz
cd ..

# Instalar concurrently si no está instalado globalmente
if ! command -v concurrently &> /dev/null; then
  echo -e "${GREEN}Instalando 'concurrently' globalmente para desarrollo...${NC}"
  npm install -g concurrently
fi


echo -e "${BLUE}Build completado exitosamente!${NC}"
echo -e "${GREEN}Para iniciar ambos servidores en modo desarrollo (hot reload):${NC}"
echo -e "${GREEN}Para iniciar solo el backend (sirviendo el build de React):${NC}"
echo "cd Backend && npm start"
echo -e "${GREEN}El build de producción del cliente está en Client/dist${NC}" 