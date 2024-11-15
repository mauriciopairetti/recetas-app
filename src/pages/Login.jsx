import { useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, googleProvider, signInWithPopup } from '../config/firebase.js';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import '../assets/style/App.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    
    useEffect(() => {
        if (user) {
            navigate('/'); // Redirige si el usuario ya está autenticado
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError(''); // Limpiamos el error si el inicio de sesión es exitoso
            navigate('/dashboard'); // Redirigir al dashboard después de iniciar sesión
        } catch (error) {
            // Dentro de handleSubmit o handleGoogleSignIn
            setError("Hubo un problema al procesar su solicitud. Intente nuevamente o use un método de inicio de sesión diferente.");

        }
    };




    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
            }));
            navigate('/dashboard');
        } catch (error) {
            setError("Error al iniciar sesión con Google. Inténtelo de nuevo.");
        }
    };


    return (
        <div className="container is-max-desktop">
            <div className="box" style={{ textAlign: 'center' }}>
                {user ? (
                    <div>
                        <h1 className="title">Welcome, {user.displayName || user.email}!</h1>
                        <p>Would you like to go to your dashboard or logout?</p>
                        <div className="buttons is-flex is-justify-content-center mt-5">
                            <button className="button is-primary" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </button>
                            <button className="button is-danger" onClick={() => auth.signOut()}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="login-page">
                        <h2 className="title">Iniciar sesión</h2>
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="field">
                                <label htmlFor="email" className="label">Email:</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="password" className="label">Contraseña:</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="buttons is-flex is-justify-content-center">
                                <button type="submit" className="button is-primary">Iniciar sesión</button>
                                <button type="button" onClick={handleGoogleSignIn} className="button is-link">
                                    Iniciar sesión con Google
                                </button>
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="button" onClick={() => navigate('/register')} className="button is-text mt-3">
                                ¿No tienes una cuenta? Regístrate
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export { Login };
