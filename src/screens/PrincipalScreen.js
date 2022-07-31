import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import { Camera, FlashMode } from 'expo-camera';

import { Colors } from '../constants/styles';


export default function Principal() {
  const [logoActivada, setLogoActivada] = useState(true);
  const [alarmaActivada, setAlarmaActivada] = useState(true);
  const [data, setData] = useState({x: 0, y: 0});
  const [subscripcion, setSubscripcion] = useState(null);
  const [estaHorizontal, setEstaHorizontal] = useState(true);

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
    _subscribe();
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
      // if (!logoActivada) {
      //   setLogoActivada(true);
      // }

      setLogoActivada(estadoActual => !estadoActual);
      setAlarmaActivada(true);
      
      subscripcion ? _unsubscribe() : _subscribe();
    }
  }

  function apagarAlarma() {
  }

  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>Accelerometer:</Text>
        <Text style={styles.text}>
          x: {round(data.x)} y: {round(data.y)}
        </Text>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity
              onPress={subscripcion ? _unsubscribe : _subscribe}
              style={styles.button}
          >
            <Text>{subscripcion ? 'Activada' : 'Desactivada'}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={apagarAlarma}
            style={[styles.button, styles.middleButton]}
          >
            <Text>Apagar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {
        hasPermission && flashActivo &&
        <Camera style={styles.camera} flashMode={FlashMode.torch}/>
      }

      <Pressable
        style={styles.pressable}
        onPress={onLogoPressHandler}
      >
      {
        logoActivada ?
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pressable: {
    flex: .4,
    width: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.terciary,
    borderRadius: 5
  },
  imagen: {
    flex: 0.8
  },

  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
