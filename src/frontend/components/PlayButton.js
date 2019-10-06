import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native'
import {
  useTrackPlayerEvents,
  TrackPlayerEvents,
  useTrackPlayerProgress
} from 'react-native-track-player'

// Subscribing to the following events inside MyComponent
const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR
]

export default ({ play, stop }) => {
  const [playerState, setState] = useState(null)
  useTrackPlayerEvents(events, event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      console.warn('An error occured while playing the current track.')
    }
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setState(event.state)
    }
  })

  const isPlaying = playerState === 3

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={() => (isPlaying ? stop() : play())}
      >
        <View style={isPlaying ? styles.activePlayButton : styles.playButton} />
      </TouchableHighlight>
    </View>
  )
}

var styles = StyleSheet.create({
  activePlayButton: {
    backgroundColor: 'black',
    height: 70,
    width: 70
  },
  playButton: {
    height: 0,
    width: 0,
    borderStyle: 'solid',
    borderTopWidth: 50,
    borderRightWidth: 0,
    borderBottomWidth: 50,
    borderLeftWidth: 70,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'black'
  }
})
