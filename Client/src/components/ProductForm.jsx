import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        categoria_id: '',
        color_id: '',
        marca: '',
        stock: ''
    });
    const [categorias, setCategorias] = useState([]);
    const [colores, setColores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar categorías
                const categoriasResponse = await axios.get('/api/productos/categorias');
                setCategorias(categoriasResponse.data);

                // Cargar colores
                const coloresResponse = await axios.get('/api/productos/colores');
                setColores(coloresResponse.data);

                // Si hay datos iniciales, cargar el producto completo
                if (initialData.id) {
                    const productoResponse = await axios.get(`/api/productos/${initialData.id}`);
                    const productoData = productoResponse.data;
                    
                    setFormData({
                        ...productoData,
                        categoria_id: productoData.categoria_id ? Number(productoData.categoria_id) : '',
                        color_id: productoData.color_id ? Number(productoData.color_id) : ''
                    });
                }
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('Error al cargar los datos: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [initialData.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (loading) {
        return <div className="text-center py-4">Cargando...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows="3"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <select
                    name="color_id"
                    value={formData.color_id}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                    <option value="">Seleccione un color</option>
                    {colores.map(color => (
                        <option key={color.id} value={color.id}>
                            {color.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <input
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    min="0"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">URL de la imagen</label>
                <input
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => onSubmit(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    {initialData.id ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm; 