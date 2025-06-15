#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando proceso de build...${NC}"

# Instalar dependencias del cliente
echo -e "${GREEN}Instalando dependencias del cliente...${NC}"
cd Client
npm install
if [ $? -ne 0 ]; then
    echo "Error al instalar dependencias del cliente"
    exit 1
fi

# Build del cliente
echo -e "${GREEN}Construyendo el cliente...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo "Error al construir el cliente"
    exit 1
fi

# Volver al directorio raíz
cd ..

# Instalar dependencias del servidor
echo -e "${GREEN}Instalando dependencias del servidor...${NC}"
cd Server
npm install
if [ $? -ne 0 ]; then
    echo "Error al instalar dependencias del servidor"
    exit 1
fi

# Volver al directorio raíz
cd ..

echo -e "${BLUE}Build completado exitosamente!${NC}"
echo -e "${GREEN}Para iniciar el servidor:${NC}"
echo "cd Server && npm start"
echo -e "${GREEN}Para iniciar el cliente:${NC}"
echo "cd Client && npm start" 