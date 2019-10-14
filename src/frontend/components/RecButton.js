import React from 'react'
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native'
import colors from '../lib/colors'

export default function RecButton ({ startRecording, stopRecording, active }) {
  var boxStyle = active ? styles.activeButton : styles.deactiveButton
  return (
    <TouchableHighlight
      underlayColor={'transparent'}
      style={styles.button}
      onPress={() => {
        if (!active) {
          startRecording()
        } else {
          stopRecording()
        }
      }}
    >
      <View style={boxStyle}>
        <Image
          source={
            active
              ? require('../assets/no_speak.png')
              : require('../assets/speak.png')
          }
          style={styles.icon}
        />
      </View>
    </TouchableHighlight>
  )
}

var styles = StyleSheet.create({
  button: {
    padding: 20
  },
  icon: {
    marginTop: 11,
    marginLeft: 5,
    height: 45,
    width: 26,
    alignSelf: 'center'
  },
  deactiveButton: {
    fontSize: 20,
    height: 70,
    width: 70,
    backgroundColor: colors.color1,
    borderRadius: 70
  },
  activeButton: {
    fontSize: 20,
    height: 70,
    width: 70,
    backgroundColor: colors.color2,
    borderRadius: 70
  }
})
