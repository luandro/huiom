import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableHighlight, Image } from 'react-native'
import TrackPlayer from 'react-native-track-player'
import Avatar from './Avatar'
import PlayButton from './PlayButton'
import Progress from './Progress'
import colors from '../lib/colors'

export default class FeedItem extends Component {
  constructor () {
    super()
    this.state = {
      isPlaying: false
    }
    this._play = this._play.bind(this)
    this._stopPlay = this._stopPlay.bind(this)
  }
  async _play () {
    TrackPlayer.setupPlayer()
      .then(async () => {
        // Adds a track to the queue
        await TrackPlayer.add({
          url: this.props.filePath,
          title: this.props.author
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
    this.setState({ isPlaying: false })
    TrackPlayer.stop()
  }
  componentWillUnmount () {
    this._stopPlay
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
      borderBottom,
      ip,
      navigate
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
      playContainer: {
        width: '85%',
        alignSelf: 'center',
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
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
    console.log(`http://${ip}:26835/${image}`)
    return (
      <View style={styles.wrapper}>
        {!isPlaying && (
          <View style={styles.container}>
            <TouchableHighlight
              // onPress={gotoProfile}
              onPress={() => navigate('Debug', { blob: image })}
              underlayColor={'transparent'}
            >
              <Avatar source={`http://${ip}:26835/${image}`} />
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
        )}
        {isPlaying && (
          <View style={styles.playContainer}>
            <PlayButton
              size={20}
              circular
              play={this._play}
              stop={this._stopPlay}
              isPlaying={isPlaying}
            />
            <Progress duration={duration} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={{ alignSelf: 'flex-start' }}>{publishedAt}</Text>
          {!isPlaying && (
            <Text style={{ alignSelf: 'flex-end' }}>{duration}s</Text>
          )}
        </View>
      </View>
    )
  }
}
