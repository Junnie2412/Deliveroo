import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MapPin, Clock, CreditCard, Package } from 'lucide-react-native'
import { OrderList } from '../types/OrderList.type'

const API_URL = 'https://deliveroowebapp.azurewebsites.net/api/Orders'

const fetchOrders = async (): Promise<OrderList[]> => {
  try {
    const token = await AsyncStorage.getItem('accessToken')
    if (!token) throw new Error('No access token found')

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error('Network response was not ok')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    throw error
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState<OrderList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)

  const loadOrders = useCallback(async () => {
    try {
      const fetchedOrders = await fetchOrders()
      setOrders(fetchedOrders)
      setError(null)
    } catch (err) {
      console.error('Error loading orders:', err) // Log the error
      setError('Failed to load orders. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    loadOrders()
  }, [loadOrders])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return styles.statusDelivered
      case 'processing':
        return styles.statusProcessing
      case 'pending':
        return styles.statusPending
      default:
        return styles.statusDefault
    }
  }

  const renderOrderItem = ({ item: order }: { item: OrderList }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, getStatusColor(order.orderStatus)]}>
          <Text style={styles.statusText}>{order.orderStatus}</Text>
        </View>
      </View>
      <View style={styles.orderContent}>
        <View style={styles.orderDetails}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.detailRow}>
            <Clock style={styles.icon} />
            <Text style={styles.detailText}>{formatDate(order.orderDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin style={styles.icon} />
            <Text style={styles.detailText}>{order.storeLocation.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <CreditCard style={styles.icon} />
            <Text style={styles.detailText}>{order.paymentMethod}</Text>
          </View>
        </View>
        <View style={styles.orderItems}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.cart.cartItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.quantity}x {item.productName}
              </Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
          <Text style={styles.totalPrice}>Total: ${order.cart.totalPrice.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.trackButton}>
          <Package style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Track Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reorderButton}>
          <Text style={styles.reorderButtonText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#00CCBB' />
      </View>
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={orders}
      renderItem={renderOrderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Text style={styles.title}>My Orders</Text>}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#00CCBB']} />}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16
  },
  orderCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600'
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500'
  },
  statusDelivered: {
    backgroundColor: '#10b981'
  },
  statusProcessing: {
    backgroundColor: '#fbbf24'
  },
  statusPending: {
    backgroundColor: '#ef4444'
  },
  statusDefault: {
    backgroundColor: '#6b7280'
  },
  orderContent: {
    padding: 16
  },
  orderDetails: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  icon: {
    marginRight: 8
  },
  detailText: {
    fontSize: 14
  },
  orderItems: {},
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  itemText: {
    fontSize: 14
  },
  itemPrice: {
    fontSize: 14
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 8
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6
  },
  buttonIcon: {
    marginRight: 4
  },
  buttonText: {
    fontSize: 14
  },
  reorderButton: {
    backgroundColor: '#00CCBB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  reorderButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280'
  }
})
