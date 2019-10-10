import React, { Component, useRef } from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet
} from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import ImagePicker from 'react-native-image-picker'
import { whoami, setProfile } from '../lib/utils'

const options = {
  title: 'Select image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

export default class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      isSaving: false,
      feedId: '',
      currentName: '',
      nextName: '',
      currentImage: null,
      nextImage: null,
      nextImagePath: null
    }
    this.reducer.bind(this)
    this.save = this.save.bind(this)
    this.handleImage = this.handleImage.bind(this)
  }

  componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    whoami()
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  handleImage () {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else {
        // const source = { uri: 'data:image/jpeg;base64,' + response.data }
        this.setState({
          nextImage: 'data:image/jpeg;base64,' + response.data,
          nextImagePath: response.path
        })
      }
    })
  }

  reducer ({ type, payload }) {
    switch (type) {
      case 'whoami':
        console.log('PAYLOAD', payload)
        this.setState({
          isLoading: false,
          isSaving: false,
          currentName: payload.name || '',
          nextName: payload.name || '',
          currentImage: payload.image || '',
          nextImage: payload.image
        })

        break

      default:
      // console.log(type, payload)
    }
  }

  render () {
    const {
      isLoading,
      isSaving,
      currentName,
      nextName,
      currentImage,
      nextImage
    } = this.state
    const canPublish =
      !isLoading &&
      (nextName.length || nextImage) &&
      (nextName !== currentName || nextImage !== currentImage)
    console.log('c', currentImage)
    console.log('n', nextImage)
    return (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={{ padding: 5 }}>
          <Text>Name</Text>
          <TextInput
            value={isLoading ? 'loading...' : nextName}
            style={styles.textInput}
            placeholder='set your name'
            onChangeText={text => this.setState({ nextName: text })}
          />
          {currentImage !== '' || nextImage ? (
            <Image
              style={styles.image}
              source={{ uri: nextImage || currentImage }}
            />
          ) : (
            <View style={styles.image} />
          )}
          <Button
            title={'Add image'}
            // disabled={isSaving || !canPublish}
            onPress={this.handleImage}
          />

          <Button
            title={isSaving ? 'Saving...' : 'Save'}
            disabled={isSaving || !canPublish}
            onPress={this.save}
          />
        </View>
      </ScrollView>
    )
  }

  save () {
    this.setState({ isSaving: true })
    setProfile({
      name: this.state.nextName,
      image: this.state.nextImagePath
    })
    this.props.navigate('Main')
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    borderWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10
  },
  image: {
    marginVertical: 30,
    alignSelf: 'center',
    height: 200,
    width: 200,
    backgroundColor: 'grey'
  }
})
