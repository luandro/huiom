import React, { Component } from 'react'
import { View } from 'react-native'
import Recorder from '../components/Recorder'
import Button from '../components/Button'

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
    // onCancel(this.props.fileData)
  }

  render () {
    console.log(this.props)
    const { onCancel, onPublish } = this.props
    const { fileData, isRecording } = this.state
    return (
      <View style={{ flexGrow: 4 }}>
        <View style={{ flexGrow: 3 }}>
          <Recorder
            setRecordedFile={this.setRecordedFile}
            setRecording={this.setRecording}
            isRecording={isRecording}
          />
        </View>
        {<View style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'space-around', opacity: fileData ? 1 : 0 }}>
          <Button
            disabled={isRecording}
            title='Cancel'
            onPress={() => onCancel(fileData)}
          />
          <Button
            title='Publish'
            disabled={!fileData}
            onPress={() => onPublish(fileData)}
          />
        </View>}
      </View>
    )
  }
}
