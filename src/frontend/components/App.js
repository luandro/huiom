import React, { Component } from 'react'
import nodejs from 'nodejs-mobile-react-native'
import { View, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from 'react-native-splash-screen'
import fs from 'react-native-fs'
import { startWithExternal, whoami, getFeed } from '../lib/utils'
import EditProfile from '../pages/EditProfile'
import Profile from '../pages/Profile'
import Thread from '../pages/Thread'
import Threads from '../pages/Threads'
import Record from '../pages/Record'
import Connections from './Connections'
import Wifi from './Wifi'

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()
const navigationRef = React.createRef()
const navigationRefRoot = React.createRef()

function navigateRoot (name, params) {
  navigationRefRoot.current && navigationRefRoot.current.navigate(name, params)
}
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
    SplashScreen.hide()
    nodejs.start('loader.js')
    try {
      const externalDirs = await fs.getAllExternalFilesDirs()
      // const ExternalDirectoryPath = await fs.ExternalDirectoryPath()
      // const ExternalStorageDirectoryPath = await fs.ExternalStorageDirectoryPath()
      alert(externalDirs)
      console.log('getAllExternalFilesDirs ', externalDirs)
      // console.log('ExternalDirectoryPath ', ExternalDirectoryPath)
      // console.log('ExternalStorageDirectoryPath ', ExternalStorageDirectoryPath)
      const externalStorage = externalDirs[0]
      startWithExternal(externalStorage)
    } catch (err) {
      console.log('ERROR', err)
    }
    whoami()
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
    this.startListener = nodejs.channel.addListener(
      'started',
      msg => {
        alert(msg)
      },
      this
    )
  }

  componentWillUnmount () {
    this.listener.remove()
    this.startListener.remove() // solves setState on unmounted components!
  }

  componentDidUpdate (prevProps, prevState) {
    let timeOut
    // if (
    //   prevState.profile !== this.state.profile &&
    //   (!this.state.profile.name || !this.state.profile.image)
    // ) {
    //   // redirect to profile
    //   navigateRoot('ProfileModal')
    // }
    if (
      prevState.replication.progress !== this.state.replication.progress &&
      !this.state.replicating
    ) {
      this.setState({ replicating: true })
      getFeed()
      timeOut = setTimeout(() => {
        this.setState({ replicating: false, replicatedAt: Date.now() })
        clearTimeout(timeOut)
      }, 1000)
    } else {
      clearTimeout(timeOut)
    }

    // console.log('PROFILE', prevState.profile)
  }

  reducer ({ type, payload }) {
    switch (type) {
      case 'whoami':
        this.setState({ profile: payload })
        break
      case 'replication':
        this.setState({
          replication: payload
        })
      default:
    }
  }
  render () {
    // console.log('FEED', feed)
    const { replicating, profile } = this.state
    return (
      <View style={{ flexGrow: 1 }}>
        {replicating && (
          <View
            style={{
              zIndex: 99,
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
        <NavigationNativeContainer ref={navigationRef}>
          <MainStack.Navigator>
            <MainStack.Screen
              name='Threads'
              component={Threads}
              options={{
                headerTitle: '',
                headerLeft: () => (
                  <Connections
                    gotoProfile={id => navigate('Profile', { id })}
                  />
                ),
                headerRight: () => (
                  <Wifi
                    profile={profile}
                    editProfile={() => navigateRoot('ProfileModal')}
                  />
                )
              }}
            />
            <MainStack.Screen
              name='Record'
              component={props => <Record {...props} />}
              options={{
                headerTitle: ''
              }}
            />
            <MainStack.Screen
              name='Profile'
              component={Profile}
              options={{
                headerTitle: ''
              }}
            />
            <MainStack.Screen
              name='Thread'
              component={Thread}
              options={{
                headerTitle: ''
              }}
            />
          </MainStack.Navigator>
        </NavigationNativeContainer>
      </View>
    )
  }
}

export default function RootStackScreen () {
  return (
    <NavigationNativeContainer ref={navigationRefRoot}>
      <RootStack.Navigator mode='modal' headerMode='none'>
        <RootStack.Screen name='Main' component={App} />
        <RootStack.Screen
          name='ProfileModal'
          component={props => <EditProfile navigate={navigateRoot} />}
        />
      </RootStack.Navigator>
    </NavigationNativeContainer>
  )
}
