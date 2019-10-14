import React from 'react'
import { View } from 'react-native'
import colors from '../lib/colors'

export default ({ progress }) => (
  <View
    style={{
      width: '85%',
      backgroundColor: 'grey',
      height: 10,
      borderRadius: 5
    }}
  >
    <View
      style={{
        width: `${progress * 100}%`,
        backgroundColor: colors.color1,
        height: 10,
        borderTopStartRadius: 5,
        borderBottomStartRadius: 5
      }}
    />
  </View>
)
