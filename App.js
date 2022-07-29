import { useContext } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import AnimatedSplashScreen from "./src/components/inicio/AnimatedSplashScreen";
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import { AuthenticatedStack, AuthStack } from "./src/components/inicio/Stacks";

// Inicializar App y Auth
import './src/util/auth'


function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.email && <AuthStack />}
      {!!authCtx.email && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AnimatedSplashScreen image={require('./assets/splash.png')}>
        <MainScreen />
      </AnimatedSplashScreen>
    </>
  );
}

function MainScreen() {
  return (
    <AuthContextProvider>
      <Navigation />
    </AuthContextProvider>
  );
}
