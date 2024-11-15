import { createContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { auth } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';


export const AuthContext = createContext(null);


//  eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? user : null);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
