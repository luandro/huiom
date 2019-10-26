import React, { Component, useRef } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  FlatList
} from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import ThreadItem from '../components/ThreadItem'
import { about, getProfileFeed } from '../lib/utils'
import colors from '../lib/colors'
import AboutMessage from '../components/AboutMessage'
import ContactMessage from '../components/ContactMessage'

export default class Profile extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoadingAbout: true,
      isLoadingFeed: true
    }
    this.reducer.bind(this)
  }

  componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    about(this.props.route.params.id)
    getProfileFeed(this.props.route.params.id)
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  reducer ({ type, payload }) {
    const { name, image } = payload
    switch (type) {
      case 'about':
        this.setState({
          isLoadingAbout: false,
          name,
          image
        })
        break
      case 'profileFeed':
        this.setState({
          isLoadingFeed: false,
          feed: payload
        })
        break

      default:
      // console.log(type, payload)
    }
  }

  render () {
    const { isLoadingFeed, name, image, feed } = this.state
    const { navigation } = this.props
    return (
      <View>
        <FlatList
          ListHeaderComponent={props => (
            <View style={{ padding: 5 }}>
              {image && <Image style={styles.image} source={{ uri: image }} />}
              <Text style={styles.title}>{name}</Text>
            </View>
          )}
          refreshing={isLoadingFeed}
          // onRefresh={this.handleRefresh}
          data={feed || []}
          ListFooterComponent={<View style={{ margin: 50 }} />}
          renderItem={({ item }) => {
            if (item.messages[0].value.content.type === 'about') {
              return (
                <AboutMessage
                  navigate={navigation.navigate}
                  {...item.messages[0].value.content}
                />
              )
            } else if (item.messages[0].value.content.type === 'contact') {
              return (
                <ContactMessage
                  navigate={navigation.navigate}
                  {...item.messages[0].value.content}
                />
              )
            } else {
              const branch = item.messages[0] ? item.messages[0].key : null
              return (
                <ThreadItem
                  messages={item.messages}
                  navigate={navigation.navigate}
                  root={branch}
                  branch={branch}
                />
              )
            }
          }}
          style={{ padding: 10 }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
