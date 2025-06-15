-- Tabla: categorias
CREATE TABLE IF NOT EXISTS public.categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE public.categorias OWNER TO alvaro;

-- Tabla: colores
CREATE TABLE IF NOT EXISTS public.colores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE public.colores OWNER TO alvaro;

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'cliente'
);

ALTER TABLE public.usuarios OWNER TO alvaro;

-- Tabla: ordenes
CREATE TABLE IF NOT EXISTS public.ordenes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES public.usuarios(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total NUMERIC(10,2) NOT NULL
);

ALTER TABLE public.ordenes OWNER TO alvaro;

-- Tabla: productos
DROP TABLE IF EXISTS public.productos CASCADE;
CREATE TABLE public.productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    imagen VARCHAR(255),
    categoria_id INTEGER REFERENCES public.categorias(id),
    color_id INTEGER REFERENCES public.colores(id),
    marca VARCHAR(100),
    stock INTEGER DEFAULT 0
);

ALTER TABLE public.productos OWNER TO alvaro;

-- Tabla: orden_detalle
CREATE TABLE IF NOT EXISTS public.orden_detalle (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES public.ordenes(id),
    producto_id INTEGER REFERENCES public.productos(id),
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    cantidad INTEGER NOT NULL
);

ALTER TABLE public.orden_detalle OWNER TO alvaro;

-- Tabla: orden_productos
CREATE TABLE IF NOT EXISTS public.orden_productos (
    orden_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (orden_id, producto_id),
    FOREIGN KEY (orden_id) REFERENCES public.ordenes(id),
    FOREIGN KEY (producto_id) REFERENCES public.productos(id)
);

ALTER TABLE public.orden_productos OWNER TO alvaro;

-- Insertar categorías predefinidas
INSERT INTO public.categorias (nombre) VALUES 
('Ropa'),
('Vasos'),
('Accesorios')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar colores predefinidos
INSERT INTO public.colores (nombre) VALUES 
('Guinda'),
('Blanco'),
('Negro'),
('Azul'),
('Rosa')
ON CONFLICT (nombre) DO NOTHING;
