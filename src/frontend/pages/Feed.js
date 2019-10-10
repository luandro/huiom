import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import FeedItem from '../components/FeedItem'
import ActionButton from '../components/ActionButton'
import { getFeed } from '../lib/utils'

export default class Feed extends Component {
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
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    console.log('Lets get feed')
    getFeed()
  }

  // componentDidUpdate (prevProps, prevState) {
  //   if (
  //     prevState.replicatedAt !== this.state.replicatedAt ||
  //     prevState.feedUpdatedAt !== this.state.feedUpdatedAt
  //   ) {
  //     console.log('Lets update feed')
  //     // Dirty hack to update
  //     getFeed()
  //   }
  // }
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
      case 'whoami':
        this.setState({ profile: payload })
        break
      default:
    }
  }
  render () {
    const { navigation } = this.props
    const { isLoading, feed } = this.state
    return (
      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          refreshing={isLoading}
          onRefresh={this.handleRefresh}
          data={feed}
          renderItem={({ item }) => {
            // console.log(item)
            const { author, image, content, timestamp } = item.value
            return (
              <FeedItem
                author={author}
                image={image}
                filePath={`http://localhost:26835/${content.blob}`}
                duration={content.duration}
                timestamp={timestamp}
              />
            )
          }}
          style={{ padding: 10 }}
          keyExtractor={(item, index) => item.key}
        />
        <ActionButton action={() => navigation.navigate('Record')} />
      </View>
    )
  }
}
