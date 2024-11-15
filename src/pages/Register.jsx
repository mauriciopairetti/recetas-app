// Importaciones necesarias
import { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from '../config/firebase.js';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

import 'bulma/css/bulma.min.css';
import '../assets/style/App.css'

const countries = {
  Argentina: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Salta", "Tucumán"],
  Brazil: ["Sao Paulo", "Rio de Janeiro", "Bahia", "Minas Gerais", "Paraná", "Ceará"],
  Chile: ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco"]
};

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    country: '',
    province: '',
    postalCode: '',
    age: null,
    city: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      alert(`Bienvenido ${user.displayName}, ya tienes una cuenta registrada.`);
      navigate('/dashboard'); // Redirige al dashboard si el usuario ya está autenticado
    }
  }, [user, navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'birthDate') {
      const age = calculateAge(value);
      setFormData((prevData) => ({ ...prevData, age }));
    }

    if (name === 'postalCode') {
      const city = await getCityFromPostalCode(value);
      setFormData((prevData) => ({ ...prevData, city }));
    }
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getCityFromPostalCode = async (postalCode, country = 'AR') => {
    if (!postalCode || isNaN(postalCode)) {
      console.warn("Código postal no válido.");
      return 'Desconocida';
    }

    try {
      const response = await fetch(`https://api.zippopotam.us/${country}/${postalCode}`);
      if (!response.ok) {
        console.warn('Código postal no encontrado en la API.');
        return 'Desconocida';
      }

      const data = await response.json();
      const city = data.places?.[0]?.['place name'] || 'Desconocida';
      return city;

    } catch (error) {
      console.error("Error al obtener la ciudad:", error);
      return 'Desconocida';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password, firstName, lastName } = formData;
      if (user) {
        setError("El usuario ya está registrado");
        navigate('/dashboard');
        return;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: `${lastName} ${firstName}`
        });
        alert("Registro exitoso");
        navigate('/home');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container is-max-desktop">
      <h2 className="title is-3">Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input className="input" type="text" name="firstName" placeholder="Nombre" value={formData.firstName} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Apellido</label>
          <div className="control">
            <input className="input" type="text" name="lastName" placeholder="Apellido" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Fecha de nacimiento</label>
          <div className="control">
            <input className="input" type="date" name="birthDate" placeholder="Fecha de nacimiento" value={formData.birthDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">País</label>
          <div className="control">
            <div className="select">
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Selecciona un país</option>
                {Object.keys(countries).map(country => <option key={country} value={country}>{country}</option>)}
              </select>
            </div>
          </div>
        </div>

        {formData.country && (
          <div className="field">
            <label className="label">Provincia</label>
            <div className="control">
              <div className="select">
                <select name="province" value={formData.province} onChange={handleChange} required>
                  <option value="">Selecciona una provincia</option>
                  {countries[formData.country].map(province => <option key={province} value={province}>{province}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="field">
          <label className="label">Código Postal</label>
          <div className="control">
            <input className="input" type="number" name="postalCode" placeholder="Código postal" value={formData.postalCode} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Contraseña</label>
          <div className="control">
            <input className="input" type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" type="submit">Registrar</button>
          </div>
          <div className="control">
            <button className="button is-light" type="button" onClick={handleGoogleSignIn}>Registrarse con Google</button>
          </div>
        </div>

        {error && <p className="help is-danger">{error}</p>}
      </form>

      <button className="button is-text" onClick={() => navigate('/login')}>¿Ya tienes una cuenta? Inicia sesión</button>
    </div>
  );
};

export { Auth as Register };
