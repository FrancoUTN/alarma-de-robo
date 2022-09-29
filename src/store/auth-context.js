import { createContext, useState } from 'react';

export const AuthContext = createContext({
  email: '',
  clave: '',
  activada: false,
  authenticate: (email, clave) => {},
  logout: () => {},
  activarODesactivar: () => {}
});

function AuthContextProvider({ children }) {
  const [email, setEmail] = useState();
  const [clave, setClave] = useState();
  const [activada, setActivada] = useState();

  function authenticate(email, clave) {
    setEmail(email);
    setClave(clave);
  }

  function logout() {
    setEmail(null);
  }

  function activarODesactivar() {
    setActivada(previousState => !previousState);
  }

  const value = {
    email: email,
    clave: clave,
    activada: activada,
    authenticate: authenticate,
    logout: logout,
    activarODesactivar: activarODesactivar
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
