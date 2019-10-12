import * as React from 'react'
import { Image } from 'react-native'
import FAB from 'react-native-action-button'

export default ({ action }) => (
  <FAB
    style={{
      position: 'absolute',
      bottom: 5,
      right: 5
    }}
    buttonColor='rgba(231,76,60,1)'
    onPress={action}
    renderIcon={active => (
      <Image
        source={require('../assets/speak.png')}
        style={{
          height: 40,
          width: 24,
          marginLeft: 7
        }}
      />
    )}
  />
)
