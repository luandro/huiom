import { Component } from 'react'
import { View, Text, Button } from 'react-native'

export default class FeedItem extends Component {
  constructor () {
    super()
    this.state = {}
    // this.toggleRecorder = this.toggleRecorder.bind(this)
  }
  render () {
    return (
      <View>
        <Text>FeedItem</Text>
      </View>
    )
  }
}
