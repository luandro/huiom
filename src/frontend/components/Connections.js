import React, { Component } from 'react'
import { View, Text, TouchableHighlight } from 'react-native'
import nodejs from 'nodejs-mobile-react-native'
import Pulse from 'react-native-pulse'
import Avatar from './Avatar'
import colors from '../lib/colors'

export default class Connections extends Component {
  constructor () {
    super()
    this.state = {
      connectedPeers: null,
      stagedPeers: null,
      replication: null,
      replicatingPeer: null
    }
    this.reducer.bind(this)
  }
  componentDidMount () {
    this.listener = nodejs.channel.addListener('mutation', this.reducer, this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevState.replication !== this.state.replication) {
      this.setState({
        replicatingPeer: Object.keys(this.state.replication.pendingPeers)[0]
      })
    }
  }
  componentWillUnmount () {
    this.listener.remove() // solves setState on unmounted components!
  }

  reducer ({ type, payload }) {
    switch (type) {
      case 'replication':
        this.setState({
          replication: payload
        })
      case 'connected-peers':
        if (Array.isArray(payload)) {
          var connectedPeers = payload.filter(
            ([msa, data]) => data.state === 'connected'
          )
          this.setState({ connectedPeers })
        }
        break
      case 'staged-peers':
        this.setState({ stagedPeers: payload })
        break
      default:
    }
  }
  render () {
    const { connectedPeers, stagedPeers, replicatingPeer } = this.state
    const { gotoProfile } = this.props
    return (
      <View
        style={{
          paddingLeft: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        {connectedPeers &&
          connectedPeers.map((peer, key) => {
            return (
              <TouchableHighlight
                key={peer[1].key}
                underlayColor={'transparent'}
                onPress={() => gotoProfile(peer[1].key)}
              >
                <View style={{ marginHorizontal: 5 }}>
                  {peer[1].key === replicatingPeer && (
                    <Pulse
                      color='green'
                      numPulses={2}
                      diameter={80}
                      speed={10}
                      duration={3000}
                    />
                  )}
                  {peer[1].type === 'lan' && <Avatar source={peer[1].image} />}
                  {peer[1].type === 'pub' && (
                    <View
                      style={{
                        backgroundColor: colors.color1,
                        height: 50,
                        width: 50,
                        borderRadius: 50
                      }}
                    >
                      <Text
                        style={{
                          textTransform: 'uppercase',
                          alignSelf: 'center',
                          paddingTop: 13,
                          color: colors.light
                        }}
                      >
                        pub
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            )
          })}
      </View>
    )
  }
}
