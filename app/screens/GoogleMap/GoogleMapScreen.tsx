import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Orders } from '../types/Orders.type'
import { useNavigation } from '@react-navigation/native' // Import useNavigation hook

// eslint-disable-next-line @typescript-eslint/no-require-imports
const userMarkerImg = require('../../../assets/user_marker.png')
const GOOGLE_MAPS_APIKEY = 'AIzaSyAqQOht-_72Amqx5v6avVS1ZrJZBQITS-0'

export default function GoogleMapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Orders[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null)
  const mapRef = useRef<MapView>(null)

  const navigation = useNavigation() // Initialize navigation hook

  const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      return accessToken
    } catch (error) {
      console.error('Error getting accessToken: ', error)
      return null
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const token = await getAccessToken()
        if (!token) {
          throw new Error('Access Token not found!')
        }
        const response = await axios.get<Orders[]>('https://deliveroowebapp.azurewebsites.net/api/Orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setOrders(response.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
        Alert.alert('Error', 'Could not fetch orders.')
      } finally {
        setLoading(false)
      }
    }

    const getLocation = async () => {
      // eslint-disable-next-line prefer-const
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        setLoading(false)
        return
      }

      try {
        // eslint-disable-next-line prefer-const
        let location = await Location.getCurrentPositionAsync({})
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        })
      } catch (error) {
        setErrorMsg('Error fetching location')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    getLocation()
  }, [])

  const handleMarkerPress = (order: Orders) => {
    setSelectedOrder(order)
    if (mapRef.current && location) {
      mapRef.current.fitToCoordinates(
        [location, { latitude: order.storeLocation.latitude, longitude: order.storeLocation.longitude }],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        }
      )
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Loading map...</Text>
      </View>
    )
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {/* User's Location */}
          <Marker coordinate={location} title='My Location' description='I am here'>
            <Image source={userMarkerImg} style={{ width: 50, height: 50 }} />
          </Marker>

          {/* Order Locations */}
          {orders.map((order) => (
            <Marker
              key={order.id}
              coordinate={{
                latitude: order.storeLocation.latitude,
                longitude: order.storeLocation.longitude
              }}
              title={order.storeLocation.storeName}
              description='Order Location'
              anchor={{ x: 0.4, y: 0.5 }}
              onPress={() => handleMarkerPress(order)}
            />
          ))}

          {/* Direction between User's Location and Selected Order Location */}
          {selectedOrder && (
            <MapViewDirections
              origin={location}
              destination={{
                latitude: selectedOrder.storeLocation.latitude,
                longitude: selectedOrder.storeLocation.longitude
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor='red'
              optimizeWaypoints={true}
              lineDashPattern={[0]}
              onReady={(result) => {
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 30,
                    bottom: 300,
                    left: 30,
                    top: 100
                  }
                })
              }}
            />
          )}
        </MapView>
      ) : (
        <Text>Unable to determine your location</Text>
      )}

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()} // Use navigation.goBack() to go back to the previous screen
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setSelectedOrder(null)
          if (mapRef.current && location) {
            mapRef.current.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            })
          }
        }}
      >
        <Text style={styles.resetButtonText}>Reset View</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: '100%'
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  resetButtonText: {
    color: 'black',
    fontWeight: 'bold'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  backButtonText: {
    color: 'black',
    fontWeight: 'bold'
  }
})
