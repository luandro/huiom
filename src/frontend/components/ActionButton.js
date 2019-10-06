import * as React from 'react'
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
  />
)
