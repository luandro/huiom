import React, { Component, useRef } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'
import wifi from 'react-native-android-wifi'

export default class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ip: null
    }
  }

  componentDidMount () {
    wifi.getIP(ip => {
      console.log(ip)
      this.setState({
        ip
      })
    })
  }

  render () {
    const { ip } = this.state
    const {
      route: { params }
    } = this.props
    return (
      <ScrollView contentInsetAdjustmentBehavior='automatic'>
        <View style={{ padding: 5 }}>
          <Text>localhost</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `http://localhost:26835/${params.blob}` }}
          />
        </View>
        <View style={{ padding: 5 }}>
          <Text>127.0.0.1</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `http://127.0.0.1:26835/${params.blob}` }}
          />
        </View>
        <View style={{ padding: 5 }}>
          <Text>0.0.0.0</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `http://0.0.0.0:26835/${params.blob}` }}
          />
        </View>
        <View style={{ padding: 5 }}>
          <Text>network ip: {ip}</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `http://${ip}:26835/${params.blob}` }}
          />
        </View>
        <View style={{ padding: 5 }}>
          <Text>10.0.2.2</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `http://10.0.2.2:26835/${params.blob}` }}
          />
        </View>
        <View style={{ padding: 5 }}>
          <Text>::1</Text>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `http://[::1]:26835/${params.blob}` }}
          />
        </View>
      </ScrollView>
    )
  }
}
