/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './src/frontend/components/App'
import { name as appName } from './app.json'
import TrackPlayer from 'react-native-track-player'

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() =>
  require('./src/frontend/lib/player-handler')
)
