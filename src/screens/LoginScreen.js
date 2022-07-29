import { useContext, useState } from 'react';

import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import login from '../util/authentication';

function LoginScreen({ navigation }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const usuario = await login(email, password);

      authCtx.authenticate(usuario.email);
    }
    catch (error) {
      console.log(error);
      navigation.navigate({
        name: 'MiModal',
        params: { mensajeError: 'Falló la autenticación. Intenta nuevamente'}
      });

      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Accediendo..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
