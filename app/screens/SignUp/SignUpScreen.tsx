import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Animated, Alert } from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { RootStackParamList } from '../types/RootStackParamList.type'
import AsyncStorage from '@react-native-async-storage/async-storage'

type SignUpScreenScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>
}

const SignUpScreen: React.FC<SignUpScreenScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
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

  const handleLogin = () => {
    navigation.replace('Login')
  }

  const validate = () => {
    if (!username) {
      Alert.alert('Validation Error', 'Username is required.')
      return false
    }
    if (!password) {
      Alert.alert('Validation Error', 'Password is required.')
      return false
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.')
      return false
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required.')
      return false
    }
    if (phone.length < 10) {
      Alert.alert('Validation Error', 'Phone number must be at least 10 digits long.')
      return false
    }
    return true
  }

  const handleSignUp = async () => {
    if (!validate()) return

    const registrationData = {
      fullName,
      username,
      email,
      password,
      phoneNumber: phone,
      address
    }

    try {
      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      })

      if (response.ok) {
        const { accessToken, refreshToken } = await response.json()

        await AsyncStorage.setItem('accessToken', accessToken)
        await AsyncStorage.setItem('refreshToken', refreshToken)
        Alert.alert('Success', 'You have successfully signed up!')
        navigation.replace('Home')
      } else {
        const errorData = await response.json()
        const errorMessages = Object.values(errorData.errors || {})
          .flat()
          .join('\n')
        Alert.alert('Registration Error', errorMessages || 'Something went wrong.')
      }
    } catch (error) {
      Alert.alert('Network Error', 'Please check your internet connection.')
      console.error('Error during registration:', error)
    }
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
        <Text className='text-3xl font-bold mb-8 text-center text-blue-600'>Create Account</Text>
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Username'
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Full Name (optional)'
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Email (optional)'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50'
          placeholder='Phone (required)'
          value={phone}
          onChangeText={setPhone}
          keyboardType='phone-pad'
        />
        <TextInput
          className='h-12 border border-gray-300 rounded-lg px-4 mb-6 bg-gray-50'
          placeholder='Address (optional)'
          value={address}
          onChangeText={setAddress}
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            className='bg-blue-500 h-12 rounded-lg justify-center items-center shadow-md'
            onPress={handleSignUp}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text className='text-white font-semibold text-lg'>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
        <View className='mt-6 flex-row justify-center'>
          <Text className='text-center text-blue-500'>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text className='font-semibold'>Login</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

export default SignUpScreen
