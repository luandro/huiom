import React from 'react'
import { Image } from 'react-native'

export default ({ source}) => <Image source={{ uri: source }} style={{ backgroundColor: 'grey', height: 50, width: 50, borderRadius: 25, borderWidth: 0, borderColor: 'green' }} />