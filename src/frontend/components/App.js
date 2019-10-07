import React, { Component } from 'react'
import { View, Switch, TouchableHighlight, PermissionsAndroid } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Pulse from 'react-native-pulse'
import wifi from 'react-native-android-wifi'
import { dispatch } from '../lib/utils'
import Feed from '../pages/Feed'
import Record from '../pages/Record'
import Avatar from './Avatar'

const Stack = createStackNavigator()

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      wifiStatus: null,
      server: true,
      isLoading: false,
      feed: null,
      feedUpdatedAt: null,
      replication: null,
      profile: null,
      connectedPeers: null,
      stagedPeers: null
    }
    this.reducer.bind(this)
    this.handleWifi = this.handleWifi.bind(this)
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
    nodejs.start('loader.js')
    dispatch({ type: 'whoami' })
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.profile !== this.state.profile && !this.state.profile.name) {
      // redirect to profile
    }
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
    // console.log('PROFILE', prevState.profile)
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
  reducer ({ type, payload }) {
    switch (type) {
      case 'feed':
        this.setState({
          isLoading: false,
          feed: payload
        })
        break
      case 'newAudioFile':
        this.setState({
          feedUpdatedAt: Date.now()
        })
        break
      case 'replication':
        this.setState({
          replication: payload
        })
      case 'whoami':
        this.setState({ profile: payload })
        break
      case 'connected-peers':
        var connectedPeers = payload.filter(
          ([msa, data]) => data.state === 'connected'
        )
        this.setState({ connectedPeers })
        break
      case 'staged-peers':
        this.setState({ stagedPeers: payload })
        break
      default:
    }
  }
  render () {
    const {
      wifiStatus,
      server,
      feed,
      connectedPeers,
      stagedPeers,
      replication,
      replicatedAt,
      feedUpdatedAt
    } = this.state
    // console.log('REPLICATION', replication)
    return (
      <NavigationNativeContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Feed'
            component={props => (
              <Feed
                feed={feed}
                replication={replication}
                replicatedAt={replicatedAt}
                feedUpdatedAt={feedUpdatedAt}
                {...props}
              />
            )}
            options={{
              headerTitle: '',
              headerLeft: () => (
                <View style={{ paddingLeft: 15 }}>
                  {connectedPeers &&
                    connectedPeers.map(peer => {
                      return (
                        <View>
                          <Pulse
                            color='orange'
                            numPulses={3}
                            diameter={400}
                            speed={20}
                            duration={2000}
                          />
                          <Avatar key={peer[1].key} source={peer[1].image} />
                        </View>
                      )
                    })}
                </View>
              ),
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {wifiStatus && <TouchableHighlight onPress={this.handleWifi}>
                    <View
                      style={{
                        height: 25,
                        width: 25,
                        borderRadius: 25,
                        backgroundColor: wifiStatus === 'enabled' ? 'green' : 'red'
                      }}
                    />
                  </TouchableHighlight>}
                  <Switch
                    style={{ paddingRight: 15 }}
                    onChange={() => {
                      if (server) {
                        // Hotspot.enable(() => {
                        //   console.log("Hotspot Enabled")
                        // }, (err) => {
                        //   console.log(err.toString())
                        // })
                      } else {
                      }
                      this.setState({ server: !server })
                    }}
                    thumbColor='#000'
                    trackColor='#f1f1'
                    value={server}
                  />
                </View>
              )
            }}
          />
          <Stack.Screen
            name='Record'
            component={Record}
            options={{
              headerTitle: ''
            }}
          />
        </Stack.Navigator>
      </NavigationNativeContainer>
    )
  }
}
