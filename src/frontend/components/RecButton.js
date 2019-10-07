import React from 'react'
import { StyleSheet, View, TouchableHighlight } from 'react-native'
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
      <View style={boxStyle} />
    </TouchableHighlight>
  )
}

var styles = StyleSheet.create({
  button: {
    padding: 20
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
    color: '#B81F00',
    height: 70,
    width: 70,
    backgroundColor: colors.color2
  }
})
