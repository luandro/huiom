import * as React from 'react'
import { Image } from 'react-native'
import FAB from 'react-native-action-button'

export default ({ action }) => (
  <FAB
    style={{
      position: 'absolute',
      bottom: -10,
      right: -10
    }}
    size={80}
    buttonColor='rgba(231,76,60,1)'
    onPress={action}
    renderIcon={active => (
      <Image
        source={require('../assets/speak.png')}
        style={{
          height: 50,
          width: 30,
          marginLeft: 7
        }}
      />
    )}
  />
)
