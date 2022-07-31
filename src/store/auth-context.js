import { createContext, useState } from 'react';

export const AuthContext = createContext({
  email: '',
  clave: '',
  authenticate: (email, clave) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [email, setEmail] = useState();
  const [clave, setClave] = useState();

  function authenticate(email, clave) {
    setEmail(email);
    setClave(clave);
  }

  function logout() {
    setEmail(null);
  }

  const value = {
    email: email,
    clave: clave,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
