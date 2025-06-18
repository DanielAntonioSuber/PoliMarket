import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import { API_URL } from '../config'

const ProductList = () => {
    const [productos, setProductos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Cargando productos...');
            const response = await axios.get(`${API_URL}/api/productos`);
            console.log('Productos cargados:', response.data);
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar productos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (productData) => {
        try {
            if (productData === null) {
                setShowForm(false);
                setEditingProduct(null);
                return;
            }

            if (editingProduct) {
                console.log('Actualizando producto:', productData);
                await axios.put(`${API_URL}/api/productos/${editingProduct.id}`, productData);
            } else {
                console.log('Creando nuevo producto:', productData);
                await axios.post(`${API_URL}/api/productos`, productData);
            }
            setShowForm(false);
            setEditingProduct(null);
            await loadProductos(); // Recargar productos después de la actualización
        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert('Error al guardar el producto: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        console.log('Editando producto:', product);
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await axios.delete(`${API_URL}/api/productos/${id}`);
                await loadProductos(); // Recargar productos después de eliminar
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                alert('Error al eliminar el producto: ' + error.message);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-4">Cargando productos...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Productos</h1>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowForm(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Nuevo Producto
                </button>
            </div>

            {showForm && (
                <div className="mb-8">
                    <ProductForm
                        onSubmit={handleSubmit}
                        initialData={editingProduct}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productos.map((producto) => (
                    <div key={producto.id} className="border rounded-lg p-4 shadow-sm">
                        <img
                            src={producto.url_imagen || producto.imagen}
                            alt={producto.nombre}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
                        <p className="text-gray-600 mb-2">{producto.descripcion}</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold">${producto.precio}</span>
                            <span className="text-sm text-gray-500">Stock: {producto.stock}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                Categoría: {producto.categoria || 'Sin categoría'}
                            </span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                Color: {producto.color || 'Sin color'}
                            </span>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleEdit(producto)}
                                className="text-indigo-600 hover:text-indigo-800"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(producto.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList; 