import React, { Component } from 'react'
import { View, Text, Button, Switch } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import { NavigationNativeContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Feed from '../pages/Feed'

function DetailsScreen () {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  )
}

const Stack = createStackNavigator()

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      feed: null,
      feedUpdatedAt: null,
      replication: null,
      feedId: null,
      connectedPeers: null,
      stagedPeers: null
    }
    this.reducer.bind(this)
    // this.toggleRecorder = this.toggleRecorder.bind(this)
  }
  componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }

  componentWillMount () {
    nodejs.start('loader.js')
  }

  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
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
        this.setState({ feedId: payload.feedId })
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
    console.log('STATE', this.state)
    return (
      <NavigationNativeContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Feed'
            component={Feed}
            options={{
              headerTitle: '',
              headerLeft: () => (
                <View>
                  <Text>Bla bla</Text>
                </View>
              ),
              headerRight: () => (
                <Switch
                  onChange={e => alert('Hello', e)}
                  thumbColor='#000'
                  trackColor='#f1f1'
                />
              )
            }}
          />
          <Stack.Screen name='Details' component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationNativeContainer>
    )
  }
}
