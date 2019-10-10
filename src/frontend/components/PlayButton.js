import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native'
import {
  useTrackPlayerEvents,
  TrackPlayerEvents,
  useTrackPlayerProgress
} from 'react-native-track-player'
import colors from '../lib/colors'

// Subscribing to the following events inside MyComponent
const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR
]

export default ({ play, stop, size, circular, isPlaying }) => {
  const [playerState, setState] = useState(null)
  useTrackPlayerEvents(events, event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occured while playing the current track.')
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setState(event.state)
    }
  })
  // const isPlaying = playerState === 3
  const styles = StyleSheet.create({
    activePlayButton: {
      backgroundColor: 'black',
      height: size || 70,
      width: size || 70
    },
    circular: {
      // padding: 10,
      height: 50,
      width: 50,
      paddingLeft: isPlaying ? 0 : 5,
      backgroundColor: colors.color1,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center'
    },
    playButton: {
      height: 0,
      width: 0,
      borderStyle: 'solid',
      borderTopWidth: size - size / 3 || 50,
      borderRightWidth: 0,
      borderBottomWidth: size - size / 3 || 50,
      borderLeftWidth: size || 70,
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: 'black'
    }
  })
  return (
    <TouchableHighlight
      underlayColor={'transparent'}
      onPress={() => (isPlaying ? stop() : play())}
    >
      <View style={circular ? styles.circular : { alignItems: 'center' }}>
        <View style={isPlaying ? styles.activePlayButton : styles.playButton} />
      </View>
    </TouchableHighlight>
  )
}
