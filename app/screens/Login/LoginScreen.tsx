import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Animated, Alert } from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootStackParamList } from '../types/RootStackParamList.type'

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const fadeAnim = new Animated.Value(0)
  const slideAnim = new Animated.Value(50)
  const scaleAnim = new Animated.Value(1)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://deliveroowebapp.azurewebsites.net/api/auth/login', {
        userName,
        password
      })

      if (response.status === 200) {
        const { accessToken, refreshToken } = response.data
        await AsyncStorage.setItem('accessToken', accessToken)
        await AsyncStorage.setItem('refreshToken', refreshToken)
        navigation.replace('Home')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Login Failed', 'Username or password is incorrect.')
    }
  }

  const handleSignUp = () => {
    navigation.replace('SignUp')
  }

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true
    }).start()
  }

  return (
    <View className='flex-1 justify-center p-4 bg-white'>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text className='text-3xl font-bold mb-8 text-center text-blue-600'>Welcome Back</Text>
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Username'
          value={userName}
          onChangeText={setUserName}
          autoCapitalize='none'
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-6 bg-gray-50'
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            className='bg-blue-500 h-12 rounded-lg justify-center items-center shadow-md'
            onPress={handleLogin}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text className='text-white font-semibold text-lg'>Login</Text>
          </TouchableOpacity>
        </Animated.View>
        <View className='mt-6 flex-row justify-center'>
          <Text className='text-center text-blue-500'>Don't have an account? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text className='font-semibold'>SignUp</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

export default LoginScreen
