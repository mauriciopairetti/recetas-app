
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProductProvider } from '../context/ProductContext';  // Importa ProductProvider
import { Register } from '../pages/Register';
import { Login } from '../pages/Login';
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { PrivateRoute } from '../component/PrivateRoute/PrivateRoute';

const App = () => {
    return (
        <AuthProvider>
            <ProductProvider> {/* Envolvemos la aplicación en ProductProvider */}
                <Router>
                    <Routes>
                        {/* rutas públicas */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/" element={<Navigate to="/home" />} />

                        {/* rutas privadas */}
                        <Route path="/dashboard" element={
                            <PrivateRoute url={"/login"}>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                    </Routes>
                </Router>
            </ProductProvider>
        </AuthProvider>
    );
};

export { App };
