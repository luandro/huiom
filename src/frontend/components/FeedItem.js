import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import Avatar from './Avatar'
import PlayButton from './PlayButton'
import colors from '../lib/colors'

export default class FeedItem extends Component {
  constructor () {
    super()
    this.state = {
      isPlaying: false
    }
    this._play = this._play.bind(this)
  }
  componentDidMount () {
    // Adds an event handler for the playback-track-changed event
    this.onTrackChange = TrackPlayer.addEventListener(
      'playback-track-changed',
      async data => {
        let state = await TrackPlayer.getState()

        let trackId = await TrackPlayer.getCurrentTrack()
        let trackObject = await TrackPlayer.getTrack(trackId)

        // Position, buffered position and duration return values in seconds
        let position = await TrackPlayer.getPosition()
        let buffered = await TrackPlayer.getBufferedPosition()
        let duration = await TrackPlayer.getDuration()
        this.setState({
          // trackId,
          // trackObject,
          position,
          // buffered,
          duration
        })
      }
    )
  }
  componentWillUnmount () {
    // Removes the event handler
    this.onTrackChange.remove()
  }
  async _play () {
    TrackPlayer.setupPlayer()
      .then(async () => {
        // Adds a track to the queue
        await TrackPlayer.add({
          id: 'trackId',
          url: this.props.filePath,
          title: 'Track Title',
          artist: 'Track Artist'
        })

        // Starts playing it
        TrackPlayer.play()
        this.setState({ isPlaying: true })
        const listener = TrackPlayer.addEventListener(
          'playback-queue-ended',
          () => {
            listener.remove()
            this.setState({ isPlaying: false })
          }
        )
      })
      .catch(err => this.setState({ error: true }))
  }

  async _stopPlay () {
    TrackPlayer.stop()
  }

  render () {
    const { duration, timestamp, author, image } = this.props
    const { isPlaying, error, position } = this.state
    const publishedAt = new Date(timestamp).toLocaleDateString()
    const styles = StyleSheet.create({
      wrapper: {
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor: colors.light
      },
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
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Avatar source={image} />
          <PlayButton
            size={20}
            circular
            play={this._play}
            stop={this._stopPlay}
            isPlaying={isPlaying}
          />
          <View style={styles.track}>
            {/* <Slider disabled /> */}
            <Text style={{ alignSelf: 'flex-end' }}>{duration}s</Text>
          </View>
        </View>
        <Text>{publishedAt}</Text>
      </View>
    )
  }
}
