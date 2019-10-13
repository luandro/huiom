import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableHighlight, Image } from 'react-native'
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
    const {
      duration,
      timestamp,
      author,
      image,
      gotoProfile,
      gotoThread,
      threadLength,
      margin,
      roundTop,
      roundBottom,
      borderTop,
      borderBottom
    } = this.props
    const { isPlaying, error, position } = this.state
    const publishedAt = new Date(timestamp).toLocaleDateString()
    const styles = StyleSheet.create({
      wrapper: {
        borderColor: colors.color1,
        borderBottomWidth: borderBottom ? 1 : 0,
        borderTopWidth: borderTop ? 1 : 0,
        marginVertical: margin ? 5 : 0,
        paddingVertical: 15,
        backgroundColor: colors.light,
        borderTopStartRadius: roundTop ? 7 : 0,
        borderTopEndRadius: roundTop ? 7 : 0,
        borderBottomStartRadius: roundBottom ? 7 : 0,
        borderBottomEndRadius: roundBottom ? 7 : 0
      },
      container: {
        alignSelf: 'center',
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '85%'
      },
      track: {
        width: '62%',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      },
      circle: {
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: colors.color3
      },
      speak: {
        alignSelf: 'center',
        height: 40,
        width: 24,
        marginLeft: 10,
        marginTop: 5
      },
      info: {
        alignSelf: 'center',
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      threadLength: {
        height: 25,
        width: 25,
        backgroundColor: colors.color2,
        alignSelf: 'flex-end',
        top: -7,
        left: -30
      },
      threadLengthText: {
        alignSelf: 'center',
        color: colors.light,
        marginTop: 3
      }
    })
    const showLength = threadLength > 1
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TouchableHighlight
            onPress={gotoProfile}
            underlayColor={'transparent'}
          >
            <Avatar source={image} />
          </TouchableHighlight>
          <PlayButton
            size={20}
            circular
            play={this._play}
            stop={this._stopPlay}
            isPlaying={isPlaying}
          />

          <TouchableHighlight
            onPress={gotoThread}
            underlayColor={'transparent'}
          >
            <View style={styles.circle}>
              <Image
                source={require('../assets/speak.png')}
                style={styles.speak}
              />
              {showLength && (
                <View style={[styles.circle, styles.threadLength]}>
                  <Text style={styles.threadLengthText}>{threadLength}</Text>
                </View>
              )}
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.info}>
          <Text style={{ alignSelf: 'flex-start' }}>{publishedAt}</Text>
          <Text style={{ alignSelf: 'flex-end' }}>{duration}s</Text>
        </View>
      </View>
    )
  }
}
