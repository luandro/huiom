import React from 'react'
import { View, TouchableHighlight } from 'react-native'
import FeedItem from './FeedItem'
import Avatar from './Avatar'
import colors from '../lib/colors'

export default ({ messages, navigate, root, branch }) => {
  if (messages[0]) {
    const { author, content, timestamp } = messages[0].value
    const userList = messages
      .reduce((prev, curr) => {
        const exists = prev.filter(i => {
          if (i && i.value.author === curr.value.author) return true
          else return false
        })
        if (exists.length < 1) {
          return prev.concat(curr)
        } else return prev
      }, [])
      .filter((i, key) => key !== 0)
    return (
      <View>
        <FeedItem
          author={author}
          image={content.image}
          filePath={`http://localhost:26835/${content.blob}`}
          duration={content.duration}
          timestamp={timestamp}
          gotoProfile={() => navigate('Profile', { id: author })}
          gotoThread={() =>
            navigate('Thread', {
              root,
              branch
            })
          }
        />
        <TouchableHighlight
          onPress={() =>
            navigate('Thread', {
              root,
              branch
            })
          }
        >
          <View
            style={{
              backgroundColor: colors.light,
              marginBottom: 15,
              flexDirection: 'row'
            }}
          >
            {userList.map(i => (
              <Avatar key={i.key} source={i.value.content.image} />
            ))}
          </View>
        </TouchableHighlight>
      </View>
    )
  } else {
    return <View />
  }
}
