// src/context/ProductContext.js
import { createContext, useState, useEffect } from 'react';
import { getProducts, AddProduct, UpdateProduct, DeleteProduct } from '../util/store.js';

export const ProductContext = createContext();

// eslint-disable-next-line react/prop-types
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const cachedProducts = localStorage.getItem('products');
      
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
        setLoading(false);
      } else {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        localStorage.setItem('products', JSON.stringify(fetchedProducts));
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para agregar un producto
  const addProduct = async (newProduct) => {
    await AddProduct(newProduct);  // Llamada a la función de Firestore para agregar el producto
    const updatedProducts = await getProducts();  // Obtener productos actualizados
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  // Función para actualizar un producto
  const updateProduct = async (id, updatedData) => {
    await UpdateProduct(id, updatedData);  // Llamada a la función de Firestore para actualizar el producto
    const updatedProducts = await getProducts();  // Obtener productos actualizados
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  // Función para eliminar un producto
  const deleteProduct = async (id) => {
    await DeleteProduct(id);  // Llamada a la función de Firestore para eliminar el producto
    const updatedProducts = await getProducts();  // Obtener productos actualizados
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

