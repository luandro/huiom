import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator
  // PermissionsAndroid
} from 'react-native'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import TrackPlayer from 'react-native-track-player'
// import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg'
import RecButton from './RecButton'
import PlayButton from './PlayButton'

class Recorder extends Component {
  constructor (props) {
    super(props)

    this.state = {
      hasPermission: undefined,
      audioPath: AudioUtils.DocumentDirectoryPath + `/${Date.now()}.aac`,
      currentTime: 0.0,
      isPaused: false,
      isStopped: false,
      isProcessing: false,
      isPlaying: false,
      isFinished: false // not really used?
    }
  }

  async prepareRecordingPath (audioPath) {
    await AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000
    })
  }

  componentDidMount () {
    AudioRecorder.requestAuthorization().then(async isAuthorised => {
      this.setState({ hasPermission: isAuthorised })

      if (!isAuthorised) return

      await this.prepareRecordingPath(this.state.audioPath)

      AudioRecorder.onProgress = data => {
        this.setState({ currentTime: data.currentTime })
      }

      // AudioRecorder.onFinished = data => {
      //   // Android callback comes in the form of a promise instead.
      //   if (Platform.OS === 'ios') {
      //     this._finishRecording(
      //       data.status === 'OK',
      //       data.audioFileURL
      //     )
      //   }
      // }
    })
  }

  componentWillUnmount () {
    // NOTE - this is super crude and I think crashes the app ):
    // needed because when a person clicks "cancel" this component can be unmounted while still recording
    this._stopRecording()
  }

  // async _pause () {
  //   if (!this.props.isRecording) {
  //     console.warn("Can't pause, not recording!")
  //     return
  //   }

  //   try {
  //     // const filePath =
  //     await AudioRecorder.pauseRecording()
  //     this.setState({ isPaused: true })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // async _resume () {
  //   if (!this.state.isPaused) {
  //     console.warn("Can't resume, not paused!")
  //     return
  //   }

  //   try {
  //     await AudioRecorder.resumeRecording()
  //     this.setState({ isPaused: false })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async _stopRecording () {
    if (!this.props.isRecording) {
      // console.warn("Can't stop, not recording!")
      return
    }
    this.props.setRecording(false)
    this.setState({
      isPaused: false,
      isStopped: true
      // isProcessing: true
    })

    try {
      const filePath = await AudioRecorder.stopRecording()
      console.log('stoped', filePath)
      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath) // note size is unknown here...
      }
      return filePath
    } catch (error) {
      console.error(error)
    }
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
      this.setState({
        isPlaying: true
      })
    })
  }

  async _stopPlay () {
    TrackPlayer.stop()
    this.setState({
      isPlaying: false
    })
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

  _finishRecording (didSucceed, filePath, size) {
    // if (didSucceed && process.env.OPUS) {
    // const opusFile = filePath.split('.aac')[0] + '.opus'
    //   RNFFmpeg.executeWithArguments([
    //     '-i',
    //     filePath,
    //     '-strict',
    //     '-2',
    //     '-c:v',
    //     'opus',
    //     opusFile
    //   ])
    //     .then(result => {
    //       console.log('FFmpeg process exited with rc ' + result.rc)
    //       this.setState({
    //         isProcessing: false,
    //         isFinished: didSucceed
    //       })
    //       this.props.setRecordedFile({
    //         filePath: opusFile,
    //         duration: formatTime(this.state.currentTime),
    //         size
    //       })
    //       console.log(
    //         `Finished recording of duration ${formatTime(
    //           this.state.currentTime
    //         )} seconds at path: ${filePath}`
    //       )
    //     })
    //     .catch(err => {
    //       this.setState({
    //         isProcessing: false,
    //         isFinished: true
    //       })
    //     })
    // }
    if (didSucceed) {
      this.setState({
        isProcessing: false,
        isFinished: didSucceed
      })
      this.props.setRecordedFile({
        filePath: filePath,
        duration: formatTime(this.state.currentTime),
        size
      })
      console.log(
        `Finished recording of duration ${formatTime(
          this.state.currentTime
        )} seconds at path: ${filePath}`
      )
    }
  }

  render () {
    const { isPaused, isProcessing, isFinished, currentTime } = this.state
    const { isRecording } = this.props
    if (isProcessing) {
      return (
        <View style={styles.container}>
          <View style={styles.controls}>
            <ActivityIndicator />
          </View>
        </View>
      )
    }

    if (isFinished) {
      return (
        <View style={styles.container}>
          <View style={styles.controls}>
            <PlayButton
              play={() => this._play()}
              stop={() => this._stopPlay()}
            />
            <Text style={styles.progressText}>{formatTime(currentTime)}s</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <RecButton
            startRecording={() => this._record()}
            stopRecording={() => this._stopRecording()}
            active={isRecording}
          />
          {/* {isPaused ? (
            <RecButton title='RESUME' onPress={() => this._resume()} />
          ) : (
            <RecButton title='PAUSE' onPress={() => this._pause()} />
          )} */}
          <Text style={styles.progressText}>{formatTime(currentTime)}s</Text>
        </View>
      </View>
    )
  }
}

function formatTime (t) {
  return Math.floor(t * 10) / 10.0
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50
  }
})

export default Recorder
