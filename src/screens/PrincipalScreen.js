import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/styles';


export default function Principal() {
  const [activada, setActivada] = useState(true);
  
  function onPressHandler() {
    console.log("Apretaste.");
  }

  return (
    <View style={styles.container}>

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
    flex: 0.8,
    color: 'white'
  }
});
