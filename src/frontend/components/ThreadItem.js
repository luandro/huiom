import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import Message from './Message'
import Avatar from './Avatar'
import colors from '../lib/colors'

export default ({ messages, navigate, root, branch }) => {
  if (messages[0]) {
    const { author, content, timestamp } = messages[0].value
    // const userList = messages
    //   .reduce((prev, curr) => {
    //     const exists = prev.filter(i => {
    //       if (i && i.value.author === curr.value.author) return true
    //       else return false
    //     })
    //     if (exists.length < 1) {
    //       return prev.concat(curr)
    //     } else return prev
    //   }, [])
    //   .filter((i, key) => key !== 0)
    return (
      <View
        style={{
          marginVertical: 15
        }}
      >
        <Message
          roundTop
          roundBottom={messages.length < 2}
          borderBottom={messages.length > 1}
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
              flexDirection: 'row'
            }}
          >
            {/* {userList.map(i => (
              <Avatar key={i.key} size={25} source={i.value.content.image} />
            ))} */}
          </View>
        </TouchableHighlight>
        {messages.length > 2 && (
          <View>
            <View
              style={{
                backgroundColor: colors.light,
                width: '100%',
                height: 18
              }}
            />
            <Text
              style={{
                position: 'absolute',
                fontSize: 15,
                backgroundColor: colors.color3,
                color: colors.light,
                height: 30,
                width: 30,
                borderRadius: 15,
                zIndex: 99,
                textAlign: 'center',
                textAlignVertical: 'center',
                right: '45%',
                top: -6
              }}
            >
              +{messages.length - 2}
            </Text>
          </View>
        )}
        {messages.length > 1 && (
          <Message
            borderTop
            roundBottom
            author={messages[messages.length - 1].value.author}
            image={messages[messages.length - 1].value.content.image}
            filePath={`http://localhost:26835/${
              messages[messages.length - 1].value.content.blob
            }`}
            duration={messages[messages.length - 1].value.content.duration}
            timestamp={messages[messages.length - 1].value.timestamp}
            gotoProfile={() =>
              navigate('Profile', {
                id: messages[messages.length - 1].value.author
              })
            }
            gotoThread={() =>
              navigate('Thread', {
                root,
                branch
              })
            }
          />
        )}
      </View>
    )
  } else {
    return <View />
  }
}
