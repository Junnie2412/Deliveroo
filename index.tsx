import React, { useEffect } from 'react'
import { useCart } from './app/contexts/CartContext'
import { CartProvider } from './app/contexts/CartContext'
import PushNotification from 'react-native-push-notification'
import { Platform } from 'react-native'
import { Navigation } from 'lucide-react-native' // Assuming you use a navigation component

const App = () => {
  const { cart } = useCart() // Assuming 'cart' is the number of items in the cart

  useEffect(() => {
    // Update the badge number when the cart changes
    if (cart !== null) {
      if (Platform.OS === 'android') {
        // Set badge for Android devices
        PushNotification.setApplicationIconBadgeNumber(cart)
      } else if (Platform.OS === 'ios') {
        // Set badge for iOS devices
        PushNotification.setApplicationIconBadgeNumber(cart)
      }
    }
  }, [cart])

  return (
    <CartProvider>
      <Navigation />
    </CartProvider>
  )
}

export default App
