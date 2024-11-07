import React, { useState, useEffect } from 'react'
import { Button, Text, View } from 'react-native'
import { sendCartNotification } from '~/services/cartNotifications'
import { requestPushNotificationPermission } from '~/services/notification'

const CartScreen = () => {
  const [cartCount, setCartCount] = useState<number>(0)
  const [pushToken, setPushToken] = useState<string>('') // Store the push token here

  useEffect(() => {
    const getPushToken = async () => {
      const token = await requestPushNotificationPermission() // Request permission and get token
      if (token) setPushToken(token) // Store the push token
    }

    getPushToken()
  }, [])

  // Function to add an item to the cart
  const addToCart = () => {
    const updatedCartCount = cartCount + 1
    setCartCount(updatedCartCount)
    if (pushToken) {
      sendCartNotification({ cartCount: updatedCartCount, token: pushToken }) // Send notification
    }
  }

  // Function to remove an item from the cart
  const removeFromCart = () => {
    const updatedCartCount = cartCount - 1
    setCartCount(updatedCartCount)
    if (pushToken) {
      sendCartNotification({ cartCount: updatedCartCount, token: pushToken }) // Send notification
    }
  }

  return (
    <View>
      <Text>Items in Cart: {cartCount}</Text>
      <Button title='Add to Cart' onPress={addToCart} />
      <Button title='Remove from Cart' onPress={removeFromCart} />
    </View>
  )
}

export default CartScreen
