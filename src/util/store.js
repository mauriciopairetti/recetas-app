// store.js
import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Referencia a la colección de productos en Firestore
const productsCollectionRef = collection(db, 'products');

// Función para obtener todos los productos
export const getProducts = async () => {
  const snapshot = await getDocs(productsCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Función para agregar un nuevo producto
export const AddProduct = async (product) => {
  return await addDoc(productsCollectionRef, product);
};

// Función para actualizar un producto existente
export const UpdateProduct = async (id, updatedProduct) => {
  const productDoc = doc(db, 'products', id);
  return await updateDoc(productDoc, updatedProduct);
};

// Función para eliminar un producto
export const DeleteProduct = async (id) => {
  const productDoc = doc(db, 'products', id);
  return await deleteDoc(productDoc);
};
