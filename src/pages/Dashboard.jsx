import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { getProducts, AddProduct, UpdateProduct, DeleteProduct } from '../util/store.js';
import { getProducts, } from '../util/store.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOut } from '../config/firebase';
import { Footer } from '../component/Footer';
import { Loader } from '../component/Loader/Loader.jsx';
import { ProductContext } from '../context/ProductContext';
import PropTypes from 'prop-types';

import '../assets/style/App.css';



const Dashboard = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const { products, loading, addProduct, updateProduct, deleteProduct } = useContext(ProductContext);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', image: '' });
    const [editingProduct, setEditingProduct] = useState(null);


    // Obtener displayName
     const displayName = user?.displayName || "Invitado";
    // const displayName = contextUser?.displayName || user?.displayName;
    //const nameParts = displayName ? displayName.split(" ") : [""];




    const handleLogout = async () => {
        await signOut(auth);
        navigate('/home');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = () => {
        addProduct(newProduct);
        setNewProduct({ name: '', description: '', image: '' });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({ name: product.name, description: product.description, image: product.image });
    };

    const handleUpdateProduct = () => {
        updateProduct(editingProduct.id, newProduct);
        setEditingProduct(null);
        setNewProduct({ name: '', description: '', image: '' });
    };
    const handleDeleteProduct = async (id) => {
        await deleteProduct(id);
        setNewProduct(await getProducts());
    };
    return (
        <div className="dashboard-page">
            <Header user={user} displayName={displayName} onLogout={handleLogout} navigate={navigate} />
            <main className="section">
                <h1 className="title">Product Dashboard</h1>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="columns is-centered">
                            <div className="column is-half">
                                <h2 className="subtitle">Add / Edit Product</h2>
                                <div className="field">
                                    <label className="label">Name</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="name"
                                            value={newProduct.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Description</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="description"
                                            value={newProduct.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Image URL</label>
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            name="image"
                                            value={newProduct.image}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="field is-grouped">
                                    {editingProduct ? (
                                        <>
                                            <button className="button is-primary" onClick={handleUpdateProduct}>
                                                Update Product
                                            </button>
                                            <button className="button is-light" onClick={() => setEditingProduct(null)}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button className="button is-primary" onClick={handleAddProduct}>
                                            Add Product
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="columns is-multiline">
                            {products.map((product) => (
                                <div key={product.id} className="column is-one-quarter">
                                    <div className="card">
                                        <div className="card-image">
                                            <figure className="image is-4by3">
                                                <img src={product.image} alt={product.name} />
                                            </figure>
                                        </div>
                                        <div className="card-content">
                                            <h3 className="title is-5">{product.name}</h3>
                                            <p className="content">{product.description}</p>
                                        </div>
                                        <footer className="card-footer">
                                            <button className="card-footer-item button is-info" onClick={() => handleEditProduct(product)}>
                                                Edit
                                            </button>
                                            <button className="card-footer-item button is-danger" onClick={() => handleDeleteProduct(product.id)}>
                                                Delete
                                            </button>
                                        </footer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};


const Header = ({ user, displayName, onLogout, navigate }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header navbar">
            <div className="navbar-start">
                <img src="/public/LOGO-01.png" alt="Logo" className="logo" />
                <h2 className="header-title">RECETAS CASERAS</h2>
            </div>

            <div className="navbar-end">
                {user ? (
                    <div className="navbar-item has-dropdown is-hoverable">
                        <button
                            className="button is-light"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <strong>Hola, {displayName}!</strong>
                        </button>
                        {menuOpen && (
                            <div className="navbar-dropdown is-right">
                                <a className="navbar-item" onClick={() => navigate('/')}>
                                    Ir a Home
                                </a>

                                {/* <hr className="navbar-divider" /> */}

                            </div>
                        )}
                    </div>
                ) : (
                    <button className="button is-primary" onClick={() => navigate('/login')}>
                        Iniciar sesión
                    </button>
                )}
            </div>
        </header>
    );
};


Header.propTypes = {
    user: PropTypes.object,
    onLogout: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
};

export { Dashboard };
