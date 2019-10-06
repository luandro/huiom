import React, { Component } from 'react'
import { View, Text, Button, Switch, Image } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { dispatch } from '../lib/utils'
import Feed from '../pages/Feed'
import Record from '../pages/Record'

const Stack = createStackNavigator()

export default class App extends Component {
  constructor () {
    super()
    this.state = {
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
    // this.toggleRecorder = this.toggleRecorder.bind(this)
  }
  componentDidMount () {
    dispatch({ type: 'whoami' })
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }

  componentWillMount () {
    nodejs.start('loader.js')
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.profile !== this.state.profile && !this.state.profile.name) {
      // redirect to profile
    }
    // console.log('PROFILE', prevState.profile)
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
    const { server, feed, connectedPeers, stagedPeers, replication } = this.state
    // console.log('FEED', feed)
    // console.log('REPLICATION', replication)
    return (
      // <Text>{connectedPeers && connectedPeers[0] && connectedPeers[0][1] && connectedPeers[0][1].image}</Text>
      <NavigationNativeContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Feed'
            component={Feed}
            options={{
              headerTitle: '',
              headerLeft: () => (
                <View style={{ paddingLeft: 15 }}>
                  {connectedPeers && connectedPeers.map(peer => {
                    return <Image key={peer[1].key} source={{ uri: peer[1].image}} style={{ height: 50, width: 50, borderRadius: 25, borderWidth: 4, borderColor: 'green' }} />
                  })}
                </View>
              ),
              headerRight: () => (
                <Switch
                  style={{ paddingRight: 15 }}
                  onChange={() => {
                    // if (server) {

                    // } else {

                    // }
                    this.setState({ server: !server})
                  }}
                  thumbColor='#000'
                  trackColor='#f1f1'
                  value={server}
                />
              )
            }}
          />
          <Stack.Screen name='Record' component={Record} />
        </Stack.Navigator>
      </NavigationNativeContainer>
    )
  }
}
