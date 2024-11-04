import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

interface OrderItem {
  id: string
  restaurantName: string
  date: string
  items: string[]
  total: string
  status: 'Delivered' | 'In Progress' | 'Cancelled'
}

const orderData: OrderItem[] = [
  {
    id: '1',
    restaurantName: 'Burger King',
    date: '15 May, 2:30 PM',
    items: ['Whopper', 'French Fries', 'Coca Cola'],
    total: '$15.99',
    status: 'Delivered'
  },
  {
    id: '2',
    restaurantName: 'Pizza Hut',
    date: '14 May, 7:45 PM',
    items: ['Pepperoni Pizza', 'Garlic Bread'],
    total: '$22.50',
    status: 'Delivered'
  },
  {
    id: '3',
    restaurantName: 'Subway',
    date: '13 May, 12:15 PM',
    items: ['Italian BMT', 'Chocolate Chip Cookie'],
    total: '$11.25',
    status: 'Cancelled'
  },
  {
    id: '4',
    restaurantName: "McDonald's",
    date: '12 May, 6:20 PM',
    items: ['Big Mac', 'Chicken McNuggets', 'Fries'],
    total: '$18.75',
    status: 'In Progress'
  }
]

const OrderCard: React.FC<{ order: OrderItem }> = ({ order }) => (
  <TouchableOpacity style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.restaurantImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.restaurantName}>{order.restaurantName}</Text>
        <Text style={styles.orderDate}>{order.date}</Text>
        <Text style={styles.orderItems}>{order.items.join(', ')}</Text>
      </View>
    </View>
    <View style={styles.orderFooter}>
      <Text style={styles.orderTotal}>{order.total}</Text>
      <Text
        style={[
          styles.orderStatus,
          order.status === 'Delivered' && styles.statusDelivered,
          order.status === 'In Progress' && styles.statusInProgress,
          order.status === 'Cancelled' && styles.statusCancelled
        ]}
      >
        {order.status}
      </Text>
    </View>
  </TouchableOpacity>
)

const MyOrderScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      <ScrollView style={styles.ordersContainer}>
        {orderData.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.helpButton}>
        <Icon name='help-circle-outline' size={24} color='#00CCBC' />
        <Text style={styles.helpButtonText}>Need help with your order?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  header: {
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
  ordersContainer: {
    flex: 1,
    padding: 16
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12
  },
  orderInfo: {
    flex: 1
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4
  },
  orderDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4
  },
  orderItems: {
    fontSize: 14,
    color: '#666666'
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  statusDelivered: {
    backgroundColor: '#e6f7ed',
    color: '#00a86b'
  },
  statusInProgress: {
    backgroundColor: '#fff7e6',
    color: '#ffa500'
  },
  statusCancelled: {
    backgroundColor: '#ffe6e6',
    color: '#ff0000'
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  helpButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#00CCBC',
    fontWeight: '600'
  }
})

export default MyOrderScreen
