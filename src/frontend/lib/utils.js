import nodejs from 'nodejs-mobile-react-native'

export const dispatch = action => {
  // an asynchronous action somewhere else, probably involves db
  nodejs.channel.post('action', action)
}
