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
      hotspotStatus: null,
      isConnected: false
    }
    this.handleWifi = this.handleWifi.bind(this)
    this.handleHotspot = this.handleHotspot.bind(this)
    this.enableHotspot = this.enableHotspot.bind(this)
    this.disableHotspot = this.disableHotspot.bind(this)
    this.checkConnection = this.checkConnection.bind(this)
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
          wifiStatus: 'enabled',
          hotspotStatus: 'disabled'
        })
      } else {
        Hotspot.enable(
          () => {
            console.log('Hotspot Enabled')
            Hotspot.disable(
              () => {
                console.log('Hotspot Disabled')
              },
              err => {
                if (err.toString() === 'Hotspot already closed') {
                  this.setState({
                    hotspotStatus: null
                  })
                }
                console.log(err.toString())
              }
            )
          },
          err => {
            console.log(err.toString())
            if (err.toString() === 'Hotspot already running') {
              this.setState({
                wifiStatus: 'disabled',
                hotspotStatus: 'enabled'
              })
            }
          }
        )
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
    const { wifiStatus, hotspotStatus } = this.state
    if (
      wifiStatus === 'enabled' &&
      (hotspotStatus === 'disabled' || !hotspotStatus)
    ) {
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
    const { hotspotStatus } = this.state
    if (!hotspotStatus || hotspotStatus === 'disabled') {
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
  }

  enableHotspot () {
    Hotspot.enable(
      () => {
        // console.log('Hotspot Enabled')
        this.setState({
          hotspotStatus: 'enabled',
          wifiStatus: 'disabled',
          isConnected: false
        })
        // Hotspot.getConfig(
        //   config => {
        //     alert('Hotspot SSID: ' + config.ssid)
        //   },
        //   err => {
        //     console.log(err.toString())
        //   }
        // )
      },
      err => {
        // this.setState({
        //   hotspotError: true
        // })
        console.log(err.toString())
        this.setState({
          hotspotStatus: 'enabled'
        })
      }
    )
  }

  disableHotspot () {
    Hotspot.disable(
      () => {
        // console.log('Hotspot Disabled')
        Hotspot.disable(
          () => {
            console.log('Hotspot Disabled twice')
            this.setState({
              hotspotStatus: this.state.hotspotStatus ? 'uncontrolledOn' : null,
              isConnected: false
            })
          },
          err => {
            console.log(err.toString())
            this.setState({ hotspotStatus: 'disabled', isConnected: false })
          }
        )
      },
      err => {
        console.log(err.toString())
      }
    )
  }

  handleHotspot () {
    const { hotspotStatus } = this.state
    if (hotspotStatus === 'uncontrolledOn') {
    } else if (hotspotStatus === 'enabled') {
      this.disableHotspot()
    } else if (hotspotStatus === 'disabled') this.enableHotspot()
  }

  render () {
    const { wifiStatus, isConnected, hotspotStatus } = this.state
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 2,
          paddingHorizontal: 10,
          marginRight: 15,
          borderColor: colors.dark,
          borderWidth: 1,
          borderRadius: 5
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
        <TouchableHighlight
          onPress={this.handleHotspot}
          underlayColor={'transparent'}
          style={{
            borderLeftColor: colors.dark,
            borderLeftWidth: wifiStatus ? 1 : 0,
            paddingLeft: 0,
            marginLeft: 10
          }}
        >
          <View
            style={{
              marginLeft: 15,
              height: 35,
              width: 35,
              borderRadius: 35,
              paddingTop: 7,
              backgroundColor:
                hotspotStatus === 'enabled' ||
                hotspotStatus === 'uncontrolledOn'
                  ? colors.color1
                  : hotspotStatus === 'disabled'
                    ? colors.grey
                    : colors.light
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
