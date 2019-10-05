import * as React from 'react'
import FAB from 'react-native-action-button'

export default () => (
  <FAB
    style={{
      position: 'absolute',
      bottom: 40,
      right: 40
    }}
    buttonColor='rgba(231,76,60,1)'
    onPress={() => {
      console.log('hi')
    }}
  />
)
