import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { Orders } from '../types/Orders.type';


const OrderCard: React.FC<{ order: Orders }> = ({ order }) => (
  <TouchableOpacity style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.restaurantImage} />
      <View style={styles.orderInfo}>    
        <Text style={styles.orderDate}>{new Date(order.orderDate).toLocaleDateString()}</Text>
        <Text style={styles.orderItems}>
          {order.cart.cartItems.map((item) => item.productName).join(', ')}
        </Text>
      </View>
    </View>
    <View style={styles.orderFooter}>
      <Text style={styles.orderTotal}>${order.cart.totalPrice}</Text>
      <Text style={[styles.orderStatus, order.orderStatus === 'Delivered' && styles.statusDelivered]}>
        {order.orderStatus}
      </Text>
    </View>
  </TouchableOpacity>
);

const MyOrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getAccessToken = async () => {
    try{
      const accessToken = await AsyncStorage.getItem('accessToken')
      return accessToken 
    }catch(error){
      console.error("Error getting accessToken: ", error)
      return null
    }
  }
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token =  await getAccessToken()
        if(!token){
          throw new Error('Access Token not found!')
        }
        const response = await axios.get<Orders[]>('https://deliveroowebapp.azurewebsites.net/api/Orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert('Error', 'Could not fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []); // Empty dependency array ensures this effect only runs once when the component mounts.
  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (orders.length === 0) {
    return <Text>No orders available</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>
      <ScrollView style={styles.ordersContainer}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.helpButton}>
        <Icon name="help-circle-outline" size={24} color="#00CCBC" />
        <Text style={styles.helpButtonText}>Need help with your order?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
