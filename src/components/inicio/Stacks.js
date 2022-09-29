import { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from '../../constants/styles';
import LoginScreen from '../../screens/LoginScreen';
import PrincipalScreen from '../../screens/PrincipalScreen';
import ModalScreen from "../../screens/ModalScreen";
import IconButton from '../ui/IconButton';
import { AuthContext } from '../../store/auth-context';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Inicio de sesión' }}/>
      <Stack.Group screenOptions={{
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.error500 },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: Colors.error100 },
        }}
      >
        <Stack.Screen name="MiModal" component={ModalScreen} options={{ title: 'Error' }}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

export function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Principal"
        component={PrincipalScreen}
        options={{
          title: 'Alarma',
          headerRight: ({ tintColor }) => {
            if (!authCtx.activada) {
              return (
                <IconButton
                  icon="log-out-outline"
                  color={tintColor}
                  size={26}
                  onPress={authCtx.logout}
                />
              );
            }
          },
        }}
      />
    </Stack.Navigator>
  );
}