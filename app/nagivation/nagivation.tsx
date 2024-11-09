// app/navigation/navigation.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LoginScreen from '~/screens/Login/LoginScreen'
import HomeTabScreen from '~/screens/HomeTab/HomeTabScreen'
import HomeScreen from '~/screens/Home/HomeScreen'
import SettingScreen from '~/screens/Setting/SettingScreen'
import SplashScreen from '~/screens/Splash/SplashScreen'
import SignUpScreen from '~/screens/SignUp/SignUpScreen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyOrderScreen from '~/screens/MyOrder/MyOrderScreen'
import CategoriesDetailScreen from '~/screens/CategoriesDetail/CategoriesDetailScreen'
import SearchResultScreen from '~/screens/SearchResult/SearchResultScreen'
import RestaurentDetailScreen from '~/screens/RestaurantDetail/RestaurentDetailScreen'
import ProductDetailScreen from '~/screens/ProductDetail/ProductDetailScreen'
import ChatScreen from '~/screens/Chat/ChatScreen'
import NotificationsScreen from '~/screens/Notifications/NotificationsScreen'
import CheckoutScreen from '~/screens/Checkout/CheckoutScreen'
import OrderConfirmationScreen from '~/screens/OrderConfirmation/OrderConfirmationScreen'
import PersonalDetailScreen from '~/screens/PersonalDetail/PersonalDetailScreen'
import EditPersonalDetailScreen from '~/screens/PersonalDetail/EditPersonalDetailScreen'
import GoogleMapScreen from '~/screens/GoogleMap/GoogleMapScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home Tab'
        component={HomeTabScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='home-outline' size={size} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen
        name='My Order'
        component={MyOrderScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='file-tray-outline' size={size} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen
        name='Notifications'
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='notifications-outline' size={size} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='chatbubble-outline' size={size} color={color} />,
          headerShown: false
        }}
      />
      <Tab.Screen
        name='Setting'
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name='settings-outline' size={size} color={color} />,
          headerShown: false
        }}
      />
    </Tab.Navigator>
  )
}

const Navigation = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='Splash'>
        <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name='CategoriesDetail' component={CategoriesDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name='Chat' component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name='SearchResult' component={SearchResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name='RestaurantDetail' component={RestaurentDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='ProductDetail' component={ProductDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Notification' component={NotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Checkout' component={CheckoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name='OrderConfirmation' component={OrderConfirmationScreen} options={{ headerShown: false }} />
        <Stack.Screen name='PersonalDetail' component={PersonalDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='EditPersonalDetail' component={EditPersonalDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='GoogleMap' component={GoogleMapScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
