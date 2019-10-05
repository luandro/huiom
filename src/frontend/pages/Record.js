import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'
import Recorder from '../components/Recorder'

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

  render () {
    return (
      <View style={{ flexGrow: 1 }}>
        <View style={{ flexGrow: 1 }}>
          <Recorder
            setRecordedFile={this.setRecordedFile}
            setRecording={this.setRecording}
            isRecording={this.state.isRecording}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            disabled={this.state.isRecording}
            title='Cancel'
            onPress={() => this.props.onCancel(this.state.fileData)}
          />
          <Button
            title='Publish'
            disabled={!this.state.fileData}
            onPress={() => this.props.onPublish(this.state.fileData)}
          />
        </View>
      </View>
    )
  }
}
