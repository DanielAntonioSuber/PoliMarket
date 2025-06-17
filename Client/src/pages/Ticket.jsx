import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaShoppingBag, FaHome } from 'react-icons/fa';

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrden = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/ordenes/${id}`);
        setOrden(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar la orden');
        setLoading(false);
      }
    };

    fetchOrden();
  }, [id]);

  const calcularSubtotal = () => {
    if (!orden?.productos) return 0;
    return orden.productos.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const iva = Math.round(subtotal * 0.16); // 16% de IVA
    const envio = subtotal >= 1000 ? 0 : 50; // Envío gratis si total >= 1000, sino $50
    return subtotal + iva + envio;
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!orden) return <div className="error">No se encontró la orden</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <FaCheckCircle style={styles.icon} />
          <h1 style={styles.titulo}>¡Compra Exitosa!</h1>
        </div>

        <div style={styles.seccion}>
          <h2 style={styles.subtitulo}>Detalles de la Orden</h2>
          <p style={styles.texto}>Número de Orden: #{orden.id}</p>
          <p style={styles.texto}>Fecha: {new Date(orden.fecha_creacion).toLocaleDateString()}</p>
          <p style={styles.texto}>Estado: {orden.estado}</p>
        </div>

        <div style={styles.seccion}>
          <h2 style={styles.subtitulo}>Productos</h2>
          {orden.productos.map((producto) => (
            <div key={producto.id} style={styles.producto}>
              <div style={styles.productoInfo}>
                <h3 style={styles.productoNombre}>{producto.nombre}</h3>
                <p style={styles.productoDetalle}>
                  Cantidad: {producto.cantidad} x ${producto.precio.toLocaleString()}
                </p>
              </div>
              <p style={styles.productoPrecio}>
                ${(producto.precio * producto.cantidad).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div style={styles.seccion}>
          <h2 style={styles.subtitulo}>Total Final</h2>
          <div style={styles.resumenItem}>
            <span style={styles.total}>Total Final (IVA 16% + Envío):</span>
            <span style={styles.total}>${calcularTotal().toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.botones}>
          <button 
            style={styles.boton} 
            onClick={() => navigate('/')}
          >
            <FaHome /> Volver al Inicio
          </button>
          <button 
            style={styles.boton} 
            onClick={() => navigate('/productos')}
          >
            <FaShoppingBag /> Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 15px rgba(139, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    border: '2px solid #8B0000'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  icon: {
    fontSize: '60px',
    color: '#28a745',
    marginBottom: '20px'
  },
  titulo: {
    fontSize: '2.5em',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px'
  },
  seccion: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    marginBottom: '20px'
  },
  subtitulo: {
    color: '#8B0000',
    fontSize: '1.5em',
    marginBottom: '15px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  texto: {
    fontSize: '1.1em',
    marginBottom: '10px',
    textAlign: 'center'
  },
  producto: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0'
  },
  productoInfo: {
    flex: 1
  },
  productoNombre: {
    fontSize: '1.1em',
    marginBottom: '5px',
    color: '#333'
  },
  productoDetalle: {
    fontSize: '0.9em',
    color: '#666'
  },
  productoPrecio: {
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#8B0000'
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '1.1em'
  },
  total: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: '1.2em'
  },
  botones: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '30px'
  },
  boton: {
    backgroundColor: '#8B0000',
    color: '#fff',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#B22222',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(139, 0, 0, 0.2)'
    }
  }
};

export default Ticket; 