import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Notification } from '../types/Notification.type'

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken')
      return token
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage:', error)
      return null
    }
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = await getToken()

      if (token) {
        try {
          const response = await axios.get('https://deliveroowebapp.azurewebsites.net/api/Notification', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setNotifications(response.data)
        } catch (error) {
          console.error('Error fetching notifications:', error)
        } finally {
          setLoading(false)
        }
      } else {
        console.error('No token found')
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  // Function to get the correct icon based on read status
  const getIcon = (isRead: boolean) => {
    return isRead ? 'checkmark-circle' : 'notifications-outline'
  }

  // Function to handle notification selection and update the server
  const handleSelectNotification = async (notificationId: string) => {
    const token = await getToken()

    if (token) {
      try {
        // Optimistically update the UI
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          )
        )
        await axios.put(
          `https://deliveroowebapp.azurewebsites.net/api/Notification/${notificationId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } catch (error) {
        console.error('Error updating notification:', error)

        // Rollback the optimistic update in case of error
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: false } : notification
          )
        )
      }
    }
  }

  const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationItem, notification.isRead && styles.notificationRead]}
        onPress={() => handleSelectNotification(notification.id)} // Handle selection
      >
        <View style={[styles.iconContainer, styles[`${notification.isRead ? 'order' : 'promo'}Icon`]]}>
          <Icon name={getIcon(notification.isRead)} size={24} color='#FFFFFF' />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>{notification.createdAt}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.notificationList}>
        {loading ? (
          <ActivityIndicator size='large' color='#00CCBC' />
        ) : (
          notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)
        )}
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
  notificationContent: {
    flex: 1
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
