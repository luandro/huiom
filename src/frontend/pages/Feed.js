import React, { Component } from 'react'
import { View, Text, Button, FlatList } from 'react-native'
import FeedItem from '../components/FeedItem'
import ActionButton from '../components/ActionButton'
import { getFeed } from '../lib/utils'

export default class Feed extends Component {
  constructor () {
    super()
    this.state = {}
  }
  componentDidUpdate (prevProps, prevState) {
    if (
      prevProps.replicatedAt !== this.props.replicatedAt ||
      prevProps.feedUpdatedAt !== this.props.feedUpdatedAt
    ) {
      console.log('Lets get feed')
      // Dirty hack to update
      getFeed()
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
            const { author, authorName, content, timestamp } = item.value
            return (
              <Audio
                author={author}
                authorName={authorName}
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
