import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { User } from '../types/User.type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { CartItem } from '../types/CartItem.type'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../types/RootStackParamList.type'

export default function OrderConfirmationScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'OrderConfirmation'>>()
  const [user, setUser] = useState<User>()
  const [orderItems, setOrderItems] = useState<CartItem[]>([])

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        if (token) {
          const response = await axios.get('https://deliveroowebapp.azurewebsites.net/api/Cart', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          const cartItems = response.data[0]?.cartItems || []

          setOrderItems(cartItems)
        }
      } catch (error) {
        console.error('Error fetching cart data:', error)
      }
    }

    fetchCartItems()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        if (token) {
          const userResponse = await axios.get('https://deliveroowebapp.azurewebsites.net/api/users/current', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setUser(userResponse.data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUser()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name='checkmark-circle' size={60} color='#00CCBB' />
          <Text style={styles.headerText}>Order Placed</Text>
          <Text style={styles.subHeaderText}>Your order is on its way!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {orderItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.productName}
              </Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={[styles.orderItem, styles.totalItem]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPrice}>
              ${orderItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.deliveryItem}>
            <Ionicons name='location-outline' size={24} color='#00CCBB' />
            <Text style={styles.deliveryText}>{user?.address}</Text>
          </View>
          <View style={styles.deliveryItem}>
            <Ionicons name='time-outline' size={24} color='#00CCBB' />
            <Text style={styles.deliveryText}>Estimated delivery: 30-40 mins</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Track My Order</Text>
        </TouchableOpacity>

        {/* Return Button */}
        <TouchableOpacity style={[styles.button, styles.returnButton]} onPress={() => navigation.navigate('MyOrder')}>
          <Text style={styles.buttonText}>Return</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  scrollContent: {
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 30
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1f2937'
  },
  subHeaderText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 5
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937'
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  itemName: {
    fontSize: 16,
    color: '#4b5563'
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937'
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 10,
    paddingTop: 10
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937'
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00CCBB'
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  deliveryText: {
    fontSize: 16,
    color: '#4b5563',
    marginLeft: 10,
    flex: 1
  },
  button: {
    backgroundColor: '#00CCBB',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  returnButton: {
    backgroundColor: '#D1D5DB',
    marginTop: 15
  }
})
