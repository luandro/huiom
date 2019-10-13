import nodejs from 'nodejs-mobile-react-native'

export const dispatch = action => {
  // an asynchronous action somewhere else, probably involves db
  nodejs.channel.post('action', action)
}

export const whoami = () => dispatch({ type: 'whoami' })
export const about = payload => dispatch({ type: 'about', payload })

export const getFeed = payload => dispatch({ type: 'getFeed', payload })

export const publishAudio = payload =>
  dispatch({
    type: 'publishAudioFile',
    payload
  })

export const deleteAudio = payload =>
  dispatch({
    type: 'deleteAudioFile',
    payload
  })

export const setProfile = payload =>
  dispatch({
    type: 'setProfile',
    payload
  })
