import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';

import { Colors } from '../constants/styles';


export default function Principal() {
  const [activada, setActivada] = useState(true);
  const [sonido, setSonido] = useState();
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const { x, y, z } = data;
  const [subscripcion, setSubscripcion] = useState(null);

  const _slow = async () => {
    // Gyroscope.setUpdateInterval(2000);
    sonido.unloadAsync();
  };

  const _fast = () => {
    Gyroscope.setUpdateInterval(100);
  };

  const _subscribe = () => {
    Gyroscope.setUpdateInterval(200);

    setSubscripcion(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscripcion && subscripcion.remove();
    setSubscripcion(null);
  };

  useEffect(() => {
    (
      async () => {
        const x = Math.abs(data.x);
        const y = Math.abs(data.y);

        if (x > 1) {
          console.log("Lo pusiste en vertical. Valor de x: " + data.x);
          _unsubscribe();

          const sound = new Audio.Sound();
          await sound.loadAsync(
            require('../../assets/elephant.mp3'),
            { isLooping: true }
          );
          setSonido(sound);
          await sound.playAsync();
        }
        else if (y > 1) {
          console.log("Lo pusiste en horizontal. Valor de y: " + data.y);
          _unsubscribe();
        }
        else if (data.z > 1) {
          console.log("Lo giraste hacia la izquierda. Valor de <: " + data.z);
          _unsubscribe();
        }
        else if (data.z < -1) {
          console.log("Lo giraste hacia la derecha. Valor de <: " + data.z);
          _unsubscribe();
        }
      }
    )();
  }, [data]);

  useEffect(() => {
    // _subscribe();
    return () => _unsubscribe();
  }, []);

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
        <Text style={styles.text}>Gyroscope:</Text>
        <Text style={styles.text}>
          x: {round(x)} y: {round(y)} z: {round(z)}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={subscripcion ? _unsubscribe : _subscribe} style={styles.button}>
            <Text>{subscripcion ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </View>

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
