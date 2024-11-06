import PushNotification from 'react-native-push-notification'

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification)
  },

  onRegister: function (token) {
    console.log('TOKEN:', token)
  },

  requestPermissions: Platform.OS === 'ios'
})

PushNotification.createChannel(
  {
    channelId: 'default-channel-id',
    channelName: 'Default Channel',
    channelDescription: 'A channel to categorize your notifications',
    soundName: 'default',
    importance: 4,
    vibrate: true
  },
  (created) => console.log(`createChannel returned '${created}'`)
)
