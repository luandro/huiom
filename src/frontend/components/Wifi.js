import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  PermissionsAndroid,
  StyleSheet,
  Image
} from 'react-native'
import wifi from 'react-native-android-wifi'
import colors from '../lib/colors'

export default class Connections extends Component {
  constructor () {
    super()
    this.state = {
      wifiStatus: null,
      isConnected: false
    }
    this.handleWifi = this.handleWifi.bind(this)
    this.checkConnection = this.checkConnection.bind(this)
  }
  async componentDidMount () {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Wifi networks',
          message: 'We need your permission in order to find wifi networks'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Thank you for your permission! :)')
      } else {
        console.log(
          'You will not able to retrieve wifi available networks list'
        )
      }
    } catch (err) {
      console.warn(err)
    }
    wifi.isEnabled(isEnabled => {
      if (isEnabled) {
        this.setState({
          wifiStatus: 'enabled'
        })
      } else {
        this.setState({
          wifiStatus: 'disabled'
        })
      }
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { wifiStatus, isConnected } = this.state
    if (!isConnected && prevState.wifiStatus !== wifiStatus) {
      this.checkConnection()
    }
  }

  checkConnection () {
    const { wifiStatus } = this.state
    if (wifiStatus === 'enabled') {
      let checkConnection = setTimeout(() => {
        wifi.connectionStatus(isConnected => {
          if (isConnected) {
            this.setState({
              isConnected: true
            })
          } else {
            this.checkConnection()
          }
        })
      }, 2000)
    }
  }

  componentWillUnmount () {
    clearTimeout(this.checkConnection)
  }

  handleWifi () {
    wifi.isEnabled(isEnabled => {
      if (isEnabled) {
        wifi.setEnabled(false)
        this.setState({
          wifiStatus: 'disabled',
          isConnected: false
        })
      } else {
        wifi.setEnabled(true)
        this.setState({
          wifiStatus: 'enabled'
        })
      }
    })
  }

  render () {
    const { wifiStatus, isConnected } = this.state
    const { profile } = this.props
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 2,
          paddingHorizontal: 10,
          marginRight: 15
        }}
      >
        {wifiStatus && (
          <TouchableHighlight
            onPress={this.handleWifi}
            underlayColor={'transparent'}
          >
            <View
              style={{
                height: 35,
                width: 35,
                borderRadius: 35,
                paddingTop: 7,
                backgroundColor: isConnected
                  ? colors.color1
                  : wifiStatus === 'enabled'
                    ? colors.color2
                    : colors.grey
              }}
            >
              <Image
                style={styles.wifiIcon}
                source={
                  wifiStatus !== 'enabled'
                    ? require('../assets/no_wifi.png')
                    : require('../assets/wifi_on.png')
                }
              />
            </View>
          </TouchableHighlight>
        )}
        {profile && !profile.image && !profile.name && (
          <TouchableHighlight
            onPress={this.props.editProfile}
            underlayColor={'transparent'}
          >
            <View
              style={{
                height: 35,
                width: 35,
                borderRadius: 35,
                paddingTop: 7,
                marginLeft: 10,
                backgroundColor: colors.color1,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.light }}>P</Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  networkButton: {
    height: 25,
    width: 25,
    borderRadius: 25
  },
  wifiIcon: {
    width: 25,
    height: 20,
    alignSelf: 'center'
  }
})
