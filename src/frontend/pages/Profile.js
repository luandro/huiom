import React, { Component, useRef } from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import { whoami } from '../lib/utils'

export default class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      isSaving: false,
      feedId: '',
      currentName: '',
      nextName: '',
      currentImage: '',
      nextImage: ''
    }
    this.reducer.bind(this)
  }

  componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    whoami()
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  reducer ({ type, payload }) {
    switch (type) {
      case 'whoami':
        this.setState({
          isLoading: false,
          isSaving: false,
          currentName: payload.name || '',
          nextName: payload.name || '',
          currentImage: payload.image || '',
          nextImage: payload.image || ''
        })

        break

      default:
      // console.log(type, payload)
    }
  }

  render () {
    const canPublish =
      !this.state.isLoading &&
      this.state.nextName.length &&
      this.state.nextName !== this.state.currentName

    return (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={{ padding: 5 }}>
          <Text>Name</Text>
          <TextInput
            value={this.state.isLoading ? 'loading...' : this.state.nextName}
            style={styles.textInput}
            placeholder='set your name'
            onChangeText={text => this.setState({ nextName: text })}
          />

          <Button
            title={this.state.isSaving ? 'Saving...' : 'Save'}
            disabled={this.state.isSaving || !canPublish}
            onPress={this.save.bind(this)}
          />
        </View>
      </ScrollView>
    )
  }

  save () {
    this.setState({ isSaving: true })
    setProfile({
      name: this.state.nextName,
      image: this.state.nextImage
    })
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10
  }
})
