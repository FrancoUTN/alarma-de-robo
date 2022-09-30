import { useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Vibration, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import { Camera, FlashMode } from 'expo-camera';

import { Colors } from '../constants/styles';
import Input from '../components/Auth/Input';
import { AuthContext } from '../store/auth-context';


export default function Principal() {
  const [data, setData] = useState({x: 0, y: 0});
  const [subscripcion, setSubscripcion] = useState(null);
  const [estaHorizontal, setEstaHorizontal] = useState(true);
  const [enteredPassword, setEnteredPassword] = useState('');
  const authCtx = useContext(AuthContext);

  // Cámara
  const [hasPermission, setHasPermission] = useState(null);
  const [flashActivo, setFlashActivo] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  useEffect(() => {
    // _subscribe();
    return () => _unsubscribe();
  }, []);
  
  useEffect(() => {
    const x = data.x;
    const y = Math.abs(data.y);

    if (x > 0.9) {
      dispararAlarma(require('../../assets/1.mp3'));
    }
    else if (x < -0.9) {
      dispararAlarma(require('../../assets/2.mp3'));
    }
    else if (y > 0.9) {
      dispararAlarma(require('../../assets/3.mp3'), true);

      estaHorizontal && setEstaHorizontal(false);
    }
    else if (y < 0.1 && !estaHorizontal) {
      dispararAlarma(require('../../assets/4.mp3'), false, true);

      setEstaHorizontal(true);
    }
  }, [data]);

  async function dispararAlarma(audio, flashea, vibra) {
    _unsubscribe();

    if (authCtx.activada) {
      const sound = new Audio.Sound();
      await sound.loadAsync(
        audio,
        { isLooping: true }
      );

      flashea && setFlashActivo(true);
      vibra && Vibration.vibrate(5000);

      setTimeout(() => {
        sound.unloadAsync();
        flashea && setFlashActivo(false);
          _subscribe();
      }, 5000);
      await sound.playAsync();
    }
  }

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(200);

    setSubscripcion(
      Accelerometer.addListener(
        AccelerometerData => setData(AccelerometerData)
      )
    );
  };

  const _unsubscribe = () => {
    subscripcion && subscripcion.remove();
    setSubscripcion(null);
  };

  function onLogoPressHandler() {
    if (!authCtx.activada) {
      authCtx.activarODesactivar();
      _subscribe();
    }
    else if (enteredPassword == authCtx.clave) {
      authCtx.activarODesactivar();
      subscripcion && _unsubscribe();
      setEnteredPassword('');
    }
    else {
      dispararAlarma(require('../../assets/5.mp3'), true, true);
    }
  }

  function updateInputValueHandler(enteredValue) {
      setEnteredPassword(enteredValue);
  }

  return (
    <View style={styles.container}>
      {
        hasPermission && flashActivo &&
        <Camera style={styles.camera} flashMode={FlashMode.torch}/>
      }
      <View style={styles.pressableContainer}>
        <Pressable
          style={[styles.pressable, authCtx.activada ? styles.pressableSuccess : styles.pressableWarning]}
          onPress={onLogoPressHandler}
        >
        {
          authCtx.activada ?
            <Image
              style={styles.imagen}
              source={require('../../assets/trusted.png')}
              resizeMode='contain'
            />
          :
            <Image
              style={styles.imagen}
              source={require('../../assets/burglar.png')}
              resizeMode='contain'
            />
        }
        </Pressable>
      {
        authCtx.activada &&
        <View style={styles.inputContainer}>
          <Input
            label="Para desactivarla, ingrese su contraseña:"
            onUpdateValue={updateInputValueHandler}
            secure
            value={enteredPassword}
          />
        </View>
      }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  pressableContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  pressable: {
    // width: '100%',
    flex: 1,
    // height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableWarning: {
    backgroundColor: '#E98A15',
  },
  pressableSuccess: {
    backgroundColor: '#317B22',
  },
  imagen: {
    flex: 0.75
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 80,
    backgroundColor: Colors.primary500,
    paddingBottom: 20
  }
});
