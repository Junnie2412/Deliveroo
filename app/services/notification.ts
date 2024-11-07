import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

export const requestPushNotificationPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
  if (status !== 'granted') {
    alert('Permission denied for notifications')
    return
  }

  // Get Expo Push Token
  const token = await Notifications.getExpoPushTokenAsync()
  console.log('Expo Push Token:', token.data)
  return token.data
}
