import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import * as Notifications from 'expo-notifications'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Navigation from './nagivation/nagivation'

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null)

  const requestPushNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission denied for notifications')
      return
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync()
      setExpoPushToken(token.data)
      console.log('Expo Push Token:', token.data)
    } catch (error) {
      console.error('Error getting push notification token:', error)
    }
  }

  const sendPushNotification = async (expoPushToken: string) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Cart Update',
      body: 'You have 5 items in your cart!',
      data: { cartCount: 5 },
      badge: 5
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
  }

  useEffect(() => {
    requestPushNotificationPermission()

    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification)
    })

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response)
    })

    if (expoPushToken) {
      sendPushNotification(expoPushToken)
      console.log(expoPushToken)
    }
  }, [expoPushToken])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Navigation />
    </GestureHandlerRootView>
  )
}

export default App
