import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'promo' | 'order' | 'info'
  isRead: boolean
}

const notificationData: Notification[] = [
  {
    id: '1',
    title: 'Your order is on its way!',
    message: 'Your order from Pizza Hut is out for delivery. Track your order now.',
    time: '2 min ago',
    type: 'order',
    isRead: false
  },
  {
    id: '2',
    title: '50% off your next order!',
    message: 'Use code DELICIOUS50 for 50% off your next order. Valid for 24 hours only.',
    time: '1 hour ago',
    type: 'promo',
    isRead: false
  },
  {
    id: '3',
    title: 'Rate your last order',
    message: 'How was your Burger King order? Tap to rate and help us improve.',
    time: '2 hours ago',
    type: 'order',
    isRead: true
  },
  {
    id: '4',
    title: 'New restaurants in your area!',
    message: 'Check out the new restaurants',
    time: '1 day ago',
    type: 'info',
    isRead: true
  },
  {
    id: '5',
    title: 'Weekend special: Free delivery',
    message: 'Enjoy free delivery on all orders this weekend. No minimum spend required!',
    time: '2 days ago',
    type: 'promo',
    isRead: true
  }
]

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return 'pricetag-outline'
      case 'order':
        return 'bicycle-outline'
      case 'info':
        return 'information-circle-outline'
      default:
        return 'notifications-outline'
    }
  }

  return (
    <TouchableOpacity style={[styles.notificationItem, notification.isRead && styles.notificationRead]}>
      <View style={[styles.iconContainer, styles[`${notification.type}Icon`]]}>
        <Icon name={getIcon(notification.type)} size={24} color='#FFFFFF' />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
    </TouchableOpacity>
  )
}

const NotificationsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notificationList}>
        {notificationData.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333'
  },
  markAllRead: {
    fontSize: 14,
    color: '#00CCBC',
    fontWeight: '600'
  },
  notificationList: {
    flex: 1
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  notificationRead: {
    backgroundColor: '#f8f8f8'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  promoIcon: {
    backgroundColor: '#FFA500'
  },
  orderIcon: {
    backgroundColor: '#00CCBC'
  },
  infoIcon: {
    backgroundColor: '#4169E1'
  },
  notificationContent: {
    flex: 1
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4
  },
  notificationTime: {
    fontSize: 12,
    color: '#999999'
  }
})

export default NotificationsScreen
