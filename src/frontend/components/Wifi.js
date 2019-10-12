import React, { Component } from 'react'
import {
  View,
  TouchableHighlight,
  PermissionsAndroid,
  StyleSheet,
  Image
} from 'react-native'
import wifi from 'react-native-android-wifi'
import Hotspot from 'react-native-wifi-hotspot'
import colors from '../lib/colors'
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
    this.handleHotspot = this.handleHotspot.bind(this)
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

  handleHotspot () {
    const { hotspotStatus } = this.state
    if (!hotspotStatus) {
      Hotspot.enable(
        () => {
          console.log('Hotspot Enabled')
          this.setState({
            hotspotStatus: true,
            wifiStatus: 'disabled'
          })
          Hotspot.getConfig(
            config => {
              alert('Hotspot SSID: ' + config.ssid)
            },
            err => {
              alert(err.toString())
            }
          )
        },
        err => {
          // alert(err.toString())
          Hotspot.disable(
            () => {
              console.log('Hotspot Disabled')
              this.setState({ hotspotStatus: false })
            },
            err => {
              alert(err.toString())
            }
          )
        }
      )
    } else {
      Hotspot.disable(
        () => {
          console.log('Hotspot Disabled')
          this.setState({ hotspotStatus: false })
        },
        err => {
          alert(err.toString())
        }
      )
    }
  }

  render () {
    const { wifiStatus, hotspotStatus } = this.state
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 15 }}
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
                backgroundColor:
                  wifiStatus === 'enabled' ? colors.color1 : colors.color2
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
        <TouchableHighlight
          onPress={this.handleHotspot}
          underlayColor={'transparent'}
        >
          <View
            style={{
              marginLeft: 15,
              height: 35,
              width: 35,
              borderRadius: 35,
              paddingTop: 7,
              backgroundColor: hotspotStatus ? colors.color1 : colors.color2
            }}
          >
            <Image
              style={styles.hotspotIcon}
              source={require('../assets/hotspot.png')}
            />
          </View>
        </TouchableHighlight>
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
  },
  hotspotIcon: {
    width: 30,
    height: 20,
    alignSelf: 'center'
  }
})
