import { useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Vibration, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import { Camera, FlashMode } from 'expo-camera';

import { Colors } from '../constants/styles';
import Input from '../components/Auth/Input';
import { AuthContext } from '../store/auth-context';


export default function Principal() {
  const [alarmaActivada, setAlarmaActivada] = useState(false);
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
    if (!alarmaActivada) {
      setAlarmaActivada(true);
      _subscribe();
    }
    else if (enteredPassword == authCtx.clave) {
      setAlarmaActivada(false);
      subscripcion && _unsubscribe();
      setEnteredPassword('');
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
          style={styles.pressable}
          onPress={onLogoPressHandler}
        >
        {
          alarmaActivada ?
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
        alarmaActivada &&
        <View style={styles.inputContainer}>
          <Input
            label="Contraseña:"
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
    width: '70%',
    height: '80%',
    alignItems: 'center',
  },
  pressable: {
    width: '100%',
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.terciary,
    borderRadius: 15,
    marginBottom: 30,
  },
  imagen: {
    flex: 0.75
  },
  inputContainer: {
    justifyContent: 'center',
    width: '100%',
    height: 100,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary500,
    borderRadius: 8,
    padding: 20
  }
});
