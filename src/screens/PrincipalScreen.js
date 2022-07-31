import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';
import { Camera, FlashMode } from 'expo-camera';

import { Colors } from '../constants/styles';


export default function Principal() {
  const [activada, setActivada] = useState(true);
  const [sonido, setSonido] = useState();
  const [data, setData] = useState({x: 0, y: 0});
  const [subscripcion, setSubscripcion] = useState(null);
  const [estaHorizontal, setEstaHorizontal] = useState(true);

  // Cámara
  const [hasPermission, setHasPermission] = useState(null);

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
    (
      async () => {
        // const x = Math.abs(data.x);
        const x = data.x;
        const y = Math.abs(data.y);

        if (x > 0.9) {
          console.log("Lo giraste hacia la izquierda. Valor de x: " + data.x);
          // estaHorizontal && setEstaHorizontal(false);
          _unsubscribe();

          const sound = new Audio.Sound();
          await sound.loadAsync(
            require('../../assets/1.mp3'),
            { isLooping: true }
          );
          setSonido(sound);
          await sound.playAsync();
        }
        else if (x < -0.9) {
          console.log("Lo giraste hacia la derecha. Valor de x: " + data.x);
          // estaHorizontal && setEstaHorizontal(false);
          _unsubscribe();

          const sound = new Audio.Sound();
          await sound.loadAsync(
            require('../../assets/2.mp3'),
            { isLooping: true }
          );
          setSonido(sound);
          await sound.playAsync();
        }
        else if (y > 0.9) { // (Math.abs)
          console.log("Lo pusiste vertical. Valor de y: " + data.y);
          estaHorizontal && setEstaHorizontal(false);
          _unsubscribe();

          const sound = new Audio.Sound();
          await sound.loadAsync(
            require('../../assets/3.mp3'),
            { isLooping: true }
          );
          setSonido(sound);
          await sound.playAsync();
        }
        else if (y < 0.1 && !estaHorizontal) {
          console.log("Volviste a ponerlo horizontal. Valor de x: " + data.x);
          setEstaHorizontal(true);
          _unsubscribe();

          const sound = new Audio.Sound();
          await sound.loadAsync(
            require('../../assets/4.mp3'),
            { isLooping: true }
          );
          setSonido(sound);
          await sound.playAsync();
        }
      }
    )();
  }, [data]);

  const _subscribe = () => {
    // sonido && sonido.unloadAsync();

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

  function onPressHandler() {
    setActivada(
      estadoActual => !estadoActual
    );
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
          <TouchableOpacity
              onPress={subscripcion ? _unsubscribe : _subscribe}
              style={styles.button}
          >
            <Text>{subscripcion ? 'Activada' : 'Desactivada'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => sonido && sonido.unloadAsync()}
            style={[styles.button, styles.middleButton]}
          >
            <Text>Silenciar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {
        hasPermission &&
        <Camera style={styles.camera} flashMode={FlashMode.torch}/>
      }

      <Pressable
        style={styles.pressable}
        onPress={onPressHandler}
      >
      {
        activada ?
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
