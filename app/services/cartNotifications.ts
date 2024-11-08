import * as Notifications from 'expo-notifications'

interface CartNotificationData {
  cartCount: number
  token: string // Expo Push Token
}

// Function to send a notification and update the cart badge
export const sendCartNotification = async ({ cartCount, token }: CartNotificationData) => {
  try {
    // Update the badge count on the app icon
    await Notifications.setBadgeCountAsync(cartCount)

    const message = {
      to: token, // Expo Push Token
      title: 'Cart Update',
      body: `You have ${cartCount} items in your cart.`,
      data: { cartCount },
      badge: cartCount // Set the badge number on the app icon
    }

    // Send the notification
    await Notifications.scheduleNotificationAsync({
      content: message,
      trigger: null // Send immediately
    })
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
