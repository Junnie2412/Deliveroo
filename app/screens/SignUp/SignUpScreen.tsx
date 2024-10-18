import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { RootStackParamList } from '~/types/RootStackParamList.type'

type SignUpScreenScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>
}

const SignUpScreen: React.FC<SignUpScreenScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('')
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

  const handleLogin = () => {
    navigation.replace('Login')
  }

  const handleSignUp = () => {
    navigation.replace('Home')
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
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
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
