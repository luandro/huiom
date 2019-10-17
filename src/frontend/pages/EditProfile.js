import React, { Component, useRef } from 'react'
import {
  ScrollView,
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight,
  PermissionsAndroid
} from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import ImagePicker from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import { whoami, setProfile } from '../lib/utils'
import Button from '../components/Button'
import colors from '../lib/colors'

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
    this.handleDocument = this.handleDocument.bind(this)
  }

  async componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    whoami()
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External storage',
          message:
            'We need your permission in order to find use your external storage'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Thank you for your permission! :)')
      } else {
        console.log('You will not able to use external storage')
      }
    } catch (err) {
      console.warn(err)
    }
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
        alert('User cancelled image picker')
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error)
      } else {
        // const source = { uri: 'data:image/jpeg;base64,' + response.data }

        this.setState({
          nextImage: 'data:image/jpeg;base64,' + response.data,
          nextImagePath: response.path
        })
      }
    })
  }
  async handleDocument () {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images]
      })
      if (res.type.split('/')[0] === 'image') {
        const folder = res.uri
          .split('/')
          .filter((p, key) => key < res.uri.split('/').length - 1)
          .join('/')
        RNFS.readFile(res.uri, 'base64')
          .then(base64Image => {
            const newFilePath = RNFS.DocumentDirectoryPath + '/' + res.name
            RNFS.appendFile(newFilePath, base64Image, 'base64')
              .then(() => {
                this.setState({
                  nextImage: res.uri,
                  nextImagePath: newFilePath
                })
              })
              .catch(err => console.log('ERROR', err))
          })
          .catch(err => console.log('ERRRR', err))
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  save () {
    this.setState({ isSaving: true })
    setProfile({
      name: this.state.nextName,
      image: this.state.nextImagePath
    })
    this.props.navigate('Main')
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
    // const canPublish = !isLoading && nextName.length && nextImage
    // const canPublish = (!isLoading && nextName.length) || nextImage
    return (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.description}>
            To continue please set a name and an image for this profile. This
            will only be prompt once.
          </Text>
          <TextInput
            value={isLoading ? 'loading...' : nextName}
            style={styles.textInput}
            placeholder='set your name'
            onChangeText={text => this.setState({ nextName: text })}
          />
          <View style={styles.pickerContainer}>
            <TouchableHighlight
              style={styles.imageContainer}
              onPress={this.handleDocument}
            >
              <Image
                style={styles.folderIcon}
                source={require('../assets/folder.png')}
              />
            </TouchableHighlight>
            {currentImage !== '' || nextImage ? (
              <Image
                style={styles.image}
                source={{ uri: nextImage || currentImage }}
              />
            ) : (
              <TouchableHighlight
                onPress={this.handleImage}
                underlayColor={colors.color3}
                style={styles.imageContainer}
              >
                <Image
                  style={styles.icon}
                  source={require('../assets/add_image.png')}
                />
              </TouchableHighlight>
            )}
          </View>
          <Button
            icon={require('../assets/check.png')}
            disabled={isSaving}
            onPress={this.save}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '75%',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingTop: '2.5%'
  },
  welcome: {
    alignSelf: 'center',
    fontSize: 30,
    marginVertical: '10%'
  },
  description: {
    textAlign: 'left'
  },
  textInput: {
    paddingLeft: 15,
    borderRadius: 15,
    fontSize: 20,
    borderWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10,
    marginVertical: '10%'
  },
  pickerContainer: {
    marginVertical: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  imageContainer: {
    justifyContent: 'center',
    backgroundColor: colors.color3,
    borderRadius: 50,
    height: 100,
    width: 100
    // paddingVertical: 20,
    // paddingHorizontal: 20
  },
  icon: {
    alignSelf: 'center',
    height: 60,
    width: 60
  },
  folderIcon: {
    alignSelf: 'center',
    height: 39,
    width: 50
  },
  image: {
    marginVertical: '10%',
    alignSelf: 'center',
    height: 150,
    width: 150,
    borderRadius: 75,
    borderColor: colors.dark,
    borderWidth: 1
  }
})
