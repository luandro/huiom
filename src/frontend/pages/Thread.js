import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import FeedItem from '../components/FeedItem'
import Thread from '../components/ThreadItem'
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
    const {
      route: { params }
    } = this.props
    getFeed(params.root)
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
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
    getFeed()
  }
  handleRefresh = () => {
    const {
      route: { params }
    } = this.props
    this.setState({ isLoading: true }, () => getFeed(params.root))
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
    const {
      navigation,
      route: { params }
    } = this.props
    const { isLoading, feed } = this.state
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {feed && (
          <FlatList
            refreshing={isLoading}
            onRefresh={this.handleRefresh}
            data={feed[0].messages}
            renderItem={({ item }) => {
              const branch = item.key
              const { author, content, timestamp } = item.value
              return (
                <FeedItem
                  author={author}
                  // image={content.image}
                  filePath={`http://localhost:26835/${content.blob}`}
                  duration={content.duration}
                  timestamp={timestamp}
                  gotoProfile={() =>
                    navigation.navigate('Profile', { id: author })
                  }
                  gotoThread={() =>
                    navigation.navigate('Thread', {
                      root: params.root,
                      branch
                    })
                  }
                />
              )
            }}
            style={{ padding: 10 }}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        <ActionButton
          action={() =>
            navigation.navigate('Record', {
              root: params.root,
              branch: params.branch
            })
          }
        />
      </View>
    )
  }
}
