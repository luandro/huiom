import React from 'react'
import { View, StyleSheet, TouchableHighlight, Text, Image } from 'react-native'
import colors from '../lib/colors'

export default ({ disabled, title, onPress, icon }) => {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 10,
      paddingHorizontal: 25,
      paddingVertical: 15,
      backgroundColor: disabled ? 'grey' : colors.color1,
      height: 50
    },
    icon: {
      height: 15,
      width: 15,
      alignSelf: 'center'
    },
    text: {
      color: colors.light
    }
  })
  return (
    <TouchableHighlight
      onPress={disabled ? () => {} : () => onPress()}
      style={[styles.button]}
      underlayColor={disabled ? 'grey' : colors.color3}
    >
      <View>
        {icon && <Image source={icon} style={styles.icon} />}
        {title && <Text style={styles.text}>{title}</Text>}
      </View>
    </TouchableHighlight>
  )
}
