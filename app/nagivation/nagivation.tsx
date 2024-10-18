// app/navigation/navigation.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import LoginScreen from '~/screens/Login/LoginScreen'
import HomeScreen from '~/screens/Home/HomeScreen'
import SettingScreen from '~/screens/Setting/SettingScreen'
import SplashScreen from '~/screens/Splash/SplashScreen'
import SignUpScreen from '~/screens/SignUp/SignUpScreen'
import ProductDetailScreen from '~/screens/ProductDetail/ProductDetailScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Setting' component={SettingScreen} />
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
        <Stack.Screen name='ProductDetail' component={ProductDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation
