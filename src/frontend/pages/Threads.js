import React, { Component } from 'react'
import { View, FlatList, Image, ActivityIndicator } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import AsyncStorage from '@react-native-community/async-storage'
import ThreadItem from '../components/ThreadItem'
import ActionButton from '../components/ActionButton'
import { getFeed } from '../lib/utils'
import colors from '../lib/colors'

class Threads extends Component {
  constructor () {
    super()
    this.state = {
      feed: null,
      firstLoad: false,
      isLoading: false,
      feedUpdatedAt: null,
      replicatedAt: null,
      replication: null
    }
    this.reducer.bind(this)
  }
  async componentDidMount () {
    const cacheFeed = await this._retrieveData('feed')
    this.setState({
      firstLoad: true,
      feed: cacheFeed
    })
    getFeed()
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }

  async componentDidUpdate (prevProps, prevState) {
    // Get fresh if replicating
    const { firstLoad, isLoading, replicatedAt, feedUpdatedAt } = this.state
    if (
      prevState.replicatedAt !== replicatedAt ||
      (prevState.feedUpdatedAt !== feedUpdatedAt && !firstLoad && isLoading)
    ) {
      // Dirty hack to update
      getFeed()
    }
  }
  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }
  handleRefresh = () => {
    const { isLoading, firstLoad } = this.state
    if (!isLoading && !firstLoad) {
      this.setState({ isLoading: true }, () => getFeed())
    }
  }
  reducer ({ type, payload }) {
    switch (type) {
      case 'feed':
        this._storeData('feed', payload)
        this.setState({
          isLoading: false,
          firstLoad: false,
          feed: payload
        })
        break
      case 'newAudioFile':
        this.setState({
          feedUpdatedAt: Date.now()
        })
        break
      case 'replication':
        this.setState({
          replication: payload
        })
      default:
    }
  }
  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log('Error saving data', error)
    }
  }
  _retrieveData = async key => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // We have data!!
        const parsed = JSON.parse(value)
        return parsed
      } else return null
    } catch (error) {
      // Error retrieving data
    }
  }
  render () {
    const { navigation } = this.props
    // const isFocused = navigation.isFocused()
    // console.log('isFocused', isFocused)
    const { isLoading, firstLoad, feed } = this.state
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: feed ? '#ddd' : colors.light
        }}
      >
        {feed && firstLoad && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: 30,
              left: 15,
              zIndex: 99
            }}
          />
        )}
        {feed && (
          <FlatList
            refreshing={isLoading}
            onRefresh={this.handleRefresh}
            data={feed}
            ListFooterComponent={<View style={{ margin: 50 }} />}
            renderItem={({ item }) => {
              const branch = item.messages[0] ? item.messages[0].key : null
              return (
                <ThreadItem
                  messages={item.messages}
                  navigate={navigation.navigate}
                  root={branch}
                  branch={branch}
                />
              )
            }}
            style={{ padding: 10 }}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        {!feed && (
          <Image
            source={require('../assets/elephant.gif')}
            style={{
              marginTop: '55%',
              width: '100%',
              height: 180
            }}
          />
        )}
        <ActionButton action={() => navigation.navigate('Record')} />
      </View>
    )
  }
}

export default Threads
