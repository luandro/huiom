import React from 'react'
import { View, Text } from 'react-native'
import Avatar from '../components/Avatar'
import colors from '../lib/colors'

export default ({ about, image, name, navigate }) => {
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
      {name && <Text>{name}</Text>}
      {image && <Avatar source={image} />}
    </View>
  )
}
