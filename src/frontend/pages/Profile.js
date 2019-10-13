import React, { Component, useRef } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import { about } from '../lib/utils'
import colors from '../lib/colors'

export default class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true
    }
    this.reducer.bind(this)
  }

  componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    about(this.props.route.params.id)
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  reducer ({ type, payload }) {
    const { name, image } = payload
    switch (type) {
      case 'about':
        this.setState({
          isLoading: false,
          name,
          image
        })
        break

      default:
      // console.log(type, payload)
    }
  }

  render () {
    const { isLoading, name, image } = this.state
    return (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={{ padding: 5 }}>
          {image && <Image style={styles.image} source={{ uri: image }} />}
          <Text style={styles.title}>{name}</Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    marginVertical: 30,
    alignSelf: 'center',
    height: 250,
    width: 250,
    borderRadius: 125
  },
  title: {
    alignSelf: 'center',
    fontSize: 30,
    textAlign: 'center',
    paddingBottom: 30,
    borderBottomColor: colors.color1,
    borderBottomWidth: 2,
    width: '85%'
  }
})
