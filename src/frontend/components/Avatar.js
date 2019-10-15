import React from 'react'
import { Image } from 'react-native'

export default ({ source, size }) => (
  <Image
    source={{ uri: source }}
    style={{
      backgroundColor: 'grey',
      height: size || 50,
      width: size || 50,
      borderRadius: 25
    }}
  />
)
