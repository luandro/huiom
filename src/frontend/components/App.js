import React, { Component } from 'react'
import nodejs from 'nodejs-mobile-react-native'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { whoami } from '../lib/utils'
import Feed from '../pages/Feed'
import Record from '../pages/Record'
import Connections from './Connections'
import Wifi from './Wifi'

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
      replicatingPeer: null,
      profile: null,
      connectedPeers: null,
      stagedPeers: null
    }
    this.reducer.bind(this)
  }
  async componentDidMount () {
    nodejs.start('loader.js')
    whoami()
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  componentDidUpdate (prevProps, prevState) {
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
    const {
      wifiStatus,
      server,
      feed,
      replication,
      replicatedAt,
      feedUpdatedAt
    } = this.state
    // console.log('FEED', feed)
    return (
      <NavigationNativeContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Feed'
            component={Feed}
            options={{
              headerTitle: '',
              headerLeft: () => <Connections />,
              headerRight: () => <Wifi />
            }}
          />
          <Stack.Screen
            name='Record'
            component={props => <Record {...props} />}
            options={{
              headerTitle: ''
            }}
          />
        </Stack.Navigator>
      </NavigationNativeContainer>
    )
  }
}
