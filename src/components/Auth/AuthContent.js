import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FloatingAction } from "react-native-floating-action";

import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';
import { useNavigation } from '@react-navigation/native';

function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false
  });

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const valoresAccion = {
    icon: require("../../../assets/arrow.png"),
    color: Colors.terciary,
    textColor: Colors.terciary
  };

  const acciones = [
    {
      text: "Administrador",
      name: "admin",
      ...valoresAccion
    },
    {
      text: "Invitado",
      name: "invitado",
      ...valoresAccion
    },
    {
      text: "Usuario",
      name: "usuario",
      ...valoresAccion
    },
    {
      text: "Anónimo",
      name: "anonimo",
      ...valoresAccion
    },
    {
      text: "Tester",
      name: "tester",
      ...valoresAccion
    },
  ];

  function submitHandler(credentials) {
    let { email, password } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length >= 6;

    if ( !emailIsValid || !passwordIsValid ) {      
      navigation.navigate({
        name: 'MiModal',
        params: { mensajeError: 'Datos inválidos.'}
      });

      setCredentialsInvalid({
        email: !emailIsValid,
        password: !passwordIsValid
      });

      return;
    }

    onAuthenticate({ email, password });
  }

  function onPressItemHandler(name) {
    switch (name) {
      case 'admin':
        setCorreo('admin@admin.com');
        setClave('111111');
        break;
      case 'invitado':
        setCorreo('invitado@invitado.com');
        setClave('222222');
        break;
      case 'usuario':
        setCorreo('usuario@usuario.com');
        setClave('333333');
        break;
      case 'anonimo':
        setCorreo('anonimo@anonimo.com');
        setClave('444444');
        break;
      case 'tester':
        setCorreo('tester@tester.com');
        setClave('555555');
        break;
    }
  }

  return (
    <>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
          correo={correo}
          clave={clave}
        />
      </View>
      <View style={styles.accesosContainer}>
        <Text style={styles.accesosTexto}>
          Acceso rápido:
        </Text>
        <FloatingAction
          actions={acciones}
          color={Colors.primary800}
          distanceToEdge={{vertical:20,horizontal:20}}
          onPressItem={name => onPressItemHandler(name)}
        />
      </View>
    </>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 4,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
  accesosContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.primary500,
    marginTop: 150,
    marginBottom: 30,
    marginHorizontal: 32,
    padding: 30,
    height: 96,
    borderRadius: 4,
  },
  accesosTexto: {
    fontSize: 20,
    color: 'white'
  }
});
