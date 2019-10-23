import React from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import Avatar from './Avatar'
import colors from '../lib/colors'

export default ({ contact, contactImage, following, image, navigate }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.light,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 15
      }}
    >
      <Avatar source={image} />
      <Text>{following ? 'following' : 'unfollowing'}</Text>
      <TouchableHighlight
        underlayColor={colors.color1}
        onPress={() => navigate('Profile', { id: contact })}
      >
        <Avatar source={contactImage} />
      </TouchableHighlight>
    </View>
  )
}
