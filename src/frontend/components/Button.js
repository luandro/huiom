import React from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native'
import colors from '../lib/colors'

export default ({ disabled, title, onPress }) => {
  return (
    <TouchableHighlight onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: colors.color1,
    height: 50
  },
  text: {
    color: colors.light
  }
})
