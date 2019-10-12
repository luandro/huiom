import React, { Component } from 'react'
import { View } from 'react-native'
import Recorder from '../components/Recorder'
import Button from '../components/Button'
import { publishAudio, deleteAudio } from '../lib/utils'

export default class Recording extends Component {
  state = {
    isRecording: false,
    fileData: null,
    isLoading: false
  }

  reducer ({ type, payload }) {
    switch (type) {
      default:
    }
  }

  setRecording = state => {
    this.setState({
      isRecording: state
    })
  }

  setRecordedFile = file => {
    this.setState({
      fileData: file
    })
  }

  componentWillUnmount () {
    // Cancel
    const { fileData } = this.state
    if (fileData) {
      deleteAudio(fileData)
    }
  }

  render () {
    const { fileData, isRecording } = this.state
    const { navigation } = this.props
    return (
      <View style={{ flexGrow: 4 }}>
        <View style={{ flexGrow: 3 }}>
          <Recorder
            setRecordedFile={this.setRecordedFile}
            setRecording={this.setRecording}
            isRecording={isRecording}
          />
        </View>
        {
          <View
            style={{
              flexGrow: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              opacity: fileData ? 1 : 0
            }}
          >
            <Button
              disabled={isRecording}
              icon={require('../assets/cancel.png')}
              onPress={() => {
                deleteAudio(fileData)
                navigation.goBack()
              }}
            />
            <Button
              icon={require('../assets/check.png')}
              disabled={!fileData}
              onPress={() => {
                publishAudio(fileData)
                navigation.goBack()
              }}
            />
          </View>
        }
      </View>
    )
  }
}
