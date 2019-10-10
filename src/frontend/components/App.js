import React, { Component } from 'react'
import nodejs from 'nodejs-mobile-react-native'
import { View, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { whoami } from '../lib/utils'
import Profile from '../pages/Profile'
import Feed from '../pages/Feed'
import Record from '../pages/Record'
import Connections from './Connections'
import Wifi from './Wifi'

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()
const navigationRef = React.createRef()
function navigate (name, params) {
  navigationRef.current && navigationRef.current.navigate(name, params)
}

class App extends Component {
  constructor () {
    super()
    this.state = {
      wifiStatus: null,
      server: true,
      isLoading: false,
      feed: null,
      feedUpdatedAt: null,
      replication: {},
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
    if (
      prevState.profile !== this.state.profile &&
      (!this.state.profile.name || !this.state.profile.image)
    ) {
      // redirect to profile
      navigate('ProfileModal')
    }
    if (
      prevState.replication.progress !== this.state.replication.progress &&
      !this.state.replicating
    ) {
      this.setState({ replicating: true })
      setTimeout(() => {
        this.setState({ replicating: false, replicatedAt: Date.now() })
      }, 1000)
    }

    // console.log('PROFILE', prevState.profile)
  }

  reducer ({ type, payload }) {
    switch (type) {
      case 'whoami':
        this.setState({ profile: payload })
        break
      default:
    }
  }
  render () {
    // console.log('FEED', feed)
    const { replicating } = this.state
    return (
      <View style={{ flexGrow: 1 }}>
        <NavigationNativeContainer>
          <MainStack.Navigator>
            <MainStack.Screen
              name='Feed'
              component={Feed}
              options={{
                headerTitle: '',
                headerLeft: () => <Connections />,
                headerRight: () => <Wifi />
              }}
            />
            <MainStack.Screen
              name='Record'
              component={props => <Record {...props} />}
              options={{
                headerTitle: ''
              }}
            />
          </MainStack.Navigator>
        </NavigationNativeContainer>
        {replicating && (
          <View
            style={{
              backgroundColor: 'black',
              height: 30,
              width: 30,
              position: 'absolute',
              top: '7%',
              left: '45%',
              right: '45%',
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 99,
              borderRadius: 50
            }}
          >
            <ActivityIndicator
              style={{ zIndex: 99 }}
              size='small'
              color='#00ff00'
            />
          </View>
        )}
      </View>
    )
  }
}

export default function RootStackScreen () {
  return (
    <NavigationNativeContainer ref={navigationRef}>
      <RootStack.Navigator mode='modal' headerMode='none'>
        <RootStack.Screen name='Main' component={App} />
        <RootStack.Screen
          name='ProfileModal'
          component={props => <Profile navigate={navigate} />}
        />
      </RootStack.Navigator>
    </NavigationNativeContainer>
  )
}
