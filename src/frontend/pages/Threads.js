import React, { Component } from 'react'
import { View, FlatList, Image } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import ThreadItem from '../components/ThreadItem'
import ActionButton from '../components/ActionButton'
import { getFeed } from '../lib/utils'

export default class Threads extends Component {
  constructor () {
    super()
    this.state = {
      feed: null,
      isLoading: false,
      feedUpdatedAt: null,
      replicatedAt: null,
      replication: null
    }
    this.reducer.bind(this)
  }
  componentDidMount () {
    getFeed()
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      prevState.replicatedAt !== this.state.replicatedAt ||
      prevState.feedUpdatedAt !== this.state.feedUpdatedAt
    ) {
      console.log('Lets update feed')
      // Dirty hack to update
      getFeed()
    }
  }
  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }
  handleRefresh = () => {
    this.setState({ isLoading: true }, () => getFeed())
  }
  reducer ({ type, payload }) {
    switch (type) {
      case 'feed':
        this.setState({
          isLoading: false,
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
  render () {
    const { navigation } = this.props
    const { isLoading, feed } = this.state
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {feed && (
          <FlatList
            refreshing={isLoading}
            onRefresh={this.handleRefresh}
            data={feed}
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
              alignSelf: 'center'
            }}
          />
        )}
        <ActionButton action={() => navigation.navigate('Record')} />
      </View>
    )
  }
}
