import React, { Component } from 'react'
import { View } from 'react-native'
import Recorder from '../components/Recorder'
import Button from '../components/Button'
import { publishAudio, deleteAudio, getFeed } from '../lib/utils'

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
    const {
      navigation,
      route: { params }
    } = this.props
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
                if (params) {
                  publishAudio({ ...fileData, ...params })
                  getFeed(params.root)
                } else {
                  publishAudio(fileData)
                  getFeed()
                }
                navigation.goBack()
              }}
            />
          </View>
        }
      </View>
    )
  }
}
