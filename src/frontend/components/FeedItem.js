import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import Avatar from './Avatar'
import PlayButton from './PlayButton'

export default class FeedItem extends Component {
  constructor () {
    super()
    this.state = {}
    this._play = this._play.bind(this)
  }
  async _play () {
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: this.props.filePath,
        title: 'Track Title',
        artist: 'Track Artist'
      })

      // Starts playing it
      TrackPlayer.play()
    })
  }

  async _stopPlay () {
    TrackPlayer.stop()
  }

  render () {
    const { duration, image } = this.props
    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },

      track: {
        width: '62%',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }
    })
    return (
      <View style={styles.container}>
        <Avatar source={image} />
        <PlayButton
          size={20}
          circular
          play={this._play}
          stop={this._stopPlay}
        />
        <View style={styles.track}>
          {/* <Slider disabled /> */}
          <Text style={{ alignSelf: 'flex-end' }}>{duration}s</Text>
        </View>
      </View>
    )
  }
}
