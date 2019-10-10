import React, { Component } from 'react'
import {
  View,
  TouchableHighlight,
  Switch,
  PermissionsAndroid
} from 'react-native'
import wifi from 'react-native-android-wifi'
import Hotspot from 'react-native-wifi-hotspot'
const hotspotConfig = {
  SSID: 'HUIOM',
  password: 'HUIOM',
  authAlgorithms: Hotspot.auth.OPEN,
  protocols: Hotspot.protocols.WPA
}

export default class Connections extends Component {
  constructor () {
    super()
    this.state = {
      wifiStatus: null,
      hotspotStatus: null
    }
    this.handleWifi = this.handleWifi.bind(this)
  }
  async componentDidMount () {
    // check hotspot status
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
    if (prevState.wifiStatus !== this.state.wifiStatus) {
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
  }
  handleWifi () {
    const { wifiStatus } = this.state
    if (wifiStatus === 'disabled') {
      wifi.setEnabled(true)
      this.setState({
        wifiStatus: 'enabled'
      })
    } else if (wifiStatus === 'enabled') {
      wifi.setEnabled(false)
      this.setState({
        wifiStatus: 'disabled'
      })
    }
  }

  render () {
    const { wifiStatus, hotspotStatus } = this.state
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 15 }}
      >
        {wifiStatus && (
          <TouchableHighlight onPress={this.handleWifi}>
            <View
              style={{
                height: 25,
                width: 25,
                borderRadius: 25,
                backgroundColor: wifiStatus === 'enabled' ? 'green' : 'red'
              }}
            />
          </TouchableHighlight>
        )}
        <Switch
          style={{ paddingRight: 15 }}
          onChange={() => {
            if (!hotspotStatus) {
              Hotspot.enable(
                hotspotConfig,
                () => {
                  console.log('Hotspot Enabled')
                },
                err => {
                  console.log(err.toString())
                }
              )
            } else {
              Hotspot.disable(
                () => {
                  console.log('Hotspot Disabled')
                },
                err => {
                  console.log(err.toString())
                }
              )
            }
            this.setState({ hotspotStatus: !hotspotStatus })
          }}
          thumbColor='#000'
          trackColor='#f1f1'
          value={hotspotStatus}
        />
      </View>
    )
  }
}
