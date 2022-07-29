import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';

import { Colors } from '../constants/styles';


export default function Principal() {
  const [activada, setActivada] = useState(true);
  
  function onPressHandler() {
    setActivada(
      estadoActual => !estadoActual
    );
  }


  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscripcion, setSubscripcion] = useState(null);

  const _slow = () => {
    Gyroscope.setUpdateInterval(2000);
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
    const valorAbsoluto = Math.abs(data.x);

    if (valorAbsoluto > 5) {
      // console.log("X superó " + valorAbsoluto + "con: " + data.x);
      console.log("X superó 5 con: " + data.x);
      _unsubscribe();
    }
  }, [data]);

  // useEffect(() => {
  //   _subscribe();
  //   return () => _unsubscribe();
  // }, []);

  const { x, y, z } = data;

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
