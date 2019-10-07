import React, { Component } from 'react'
import { View, StyleSheet, Slider, Text } from 'react-native'
import Avatar from './Avatar'
import PlayButton from './PlayButton'
import colors from '../lib/colors'

export default class FeedItem extends Component {
  constructor () {
    super()
    this.state = {}
    // this.toggleRecorder = this.toggleRecorder.bind(this)
  }
  async _play () {
    if (this.props.isRecording) {
      await this._stopRecording()
    }
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: this.state.audioPath,
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

  async _record () {
    if (this.props.isRecording) {
      console.warn('Already recording!')
      return
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!")
      return
    }

    if (this.state.isStopped) {
      this.prepareRecordingPath(this.state.audioPath)
    }
    this.props.setRecording(true)
    this.setState({ isPaused: false })
    try {
      // const filePath =
      await AudioRecorder.startRecording()
    } catch (error) {
      console.error(error)
    }
  }
  render () {
    const styles = StyleSheet.create({
      container: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
      },
      play: {
        // padding: 10,
        height: 50,
        width: 50,
        backgroundColor: colors.color1,
        borderRadius: 30,
        alignItems: "center"
      },
      track: {
        width: '70%',
        flexDirection: "column",
        justifyContent: "flex-end"
      }
    })
    return (
      <View style={styles.container}>
        <Avatar />
        <View style={styles.play}>
          <PlayButton size={30} />
        </View>
        <View style={styles.track}>
          <Slider disabled />
          <Text style={{ alignSelf: "flex-end" }}>30s</Text>
        </View>
      </View>
    )
  }
}
