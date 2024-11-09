import * as Notifications from 'expo-notifications'

interface CartNotificationData {
  cartCount: number
  token: string
}

export const sendCartNotification = async ({ cartCount, token }: CartNotificationData) => {
  try {
    await Notifications.setBadgeCountAsync(cartCount)

    const message = {
      to: token,
      title: 'Cart Update',
      body: `You have ${cartCount} items in your cart.`,
      data: { cartCount },
      badge: cartCount
    }

    await Notifications.scheduleNotificationAsync({
      content: message,
      trigger: null
    })
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}
