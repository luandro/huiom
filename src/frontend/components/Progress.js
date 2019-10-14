import React from 'react'
import { ProgressComponent } from 'react-native-track-player'
import { View, Text } from 'react-native'
import ProgressBar from './ProgressBar'

export default class Player extends ProgressComponent {
  render () {
    return (
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '75%',
            justifyContent: 'space-between'
          }
        ]}
      >
        <ProgressBar
          style={{ flex: 1 }}
          progress={this.getProgress()}
          buffered={this.getBufferedProgress()}
        />
        <View style={{ flexDirection: 'column', width: 30, paddingLeft: 6 }}>
          <Text>{Math.floor(this.state.position)}s</Text>
          <Text>{this.props.duration}s</Text>
        </View>
      </View>
    )
  }
}
