import { useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOut } from '../config/firebase';
import { ProductContext } from '../context/ProductContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../component/Footer';
import { Loader } from '../component/Loader/Loader.jsx';
import { useAuth } from '../context/useAuth.jsx';
import PropTypes from 'prop-types';
// import '../assets/style/App.css';

import '../assets/style/Home.css';



import { useState } from 'react';

const Home = () => {
  const [user] = useAuthState(auth);
  const { user: contextUser } = useAuth();
  const navigate = useNavigate();
  const { products, loading } = useContext(ProductContext);

  // Obtener el nombre de usuario
  const displayName = contextUser?.displayName || user?.displayName;
  const nameParts = displayName ? displayName.split(" ") : [""];

  // Función de cierre de sesión
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/home');
  };

  return (
    <div className="home-page">
      <Header user={user} displayName={nameParts[0]} onLogout={handleLogout} navigate={navigate} />
      <main className="section">
        <h1 className="title">BIENVENIDOS</h1>
        {loading ? (
          <Loader /> // Mostrar el loader si loading es true
        ) : (
          <RecipeGrid recipes={products} />
        )}
      </main>
      <Footer />
    </div>
  );
};

const Header = ({ user, displayName, onLogout, navigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="navbar-start">
        <img src="/public/LOGO-01.png" alt="Logo" className="logo" />
        <h2 className="header-title">RECETAS CASERAS</h2>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="buttons">
            <span className="material-symbols-outlined tune-icon" onClick={() => navigate('/')}>
              FILTRAR
            </span>
            <div className="dropdown is-right is-hoverable">
              <button
                className="button is-light"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <strong>Hola, {displayName}!</strong>
              </button>
              {menuOpen && (
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    <a className="dropdown-item" onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </a>
                    <a className="dropdown-item" onClick={onLogout}>
                      Cerrar sesión
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            className="button is-primary"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
};




Header.propTypes = {
  user: PropTypes.object,
  displayName: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired
};


const RecipeGrid = ({ recipes }) => (
  <div className="recipe-grid columns is-multiline">
    {recipes.map((recipe) => (
      <div key={recipe.id} className="recipe-card column is-one-quarter">
        <div className="card">
          <div className="card-image">
            <figure className="image is-4by3">
              <img src={recipe.image} alt={recipe.name} />
            </figure>
          </div>
          <div className="card-content">
            <h3 className="title is-5">{recipe.name}</h3>
            <p className="content">{recipe.description}</p>
            <div className="icons">
              <i className='bx bx-like'></i>
              <i className='bx bx-tag-alt bx-rotate-90'></i>
              <i className='bx bx-heart'></i>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);



RecipeGrid.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};


export { Home };
