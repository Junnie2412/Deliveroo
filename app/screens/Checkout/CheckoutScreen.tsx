import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { styled } from 'nativewind'
import { ArrowLeft, CreditCard, MapPin, Clock, ChevronRight, Percent } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { CartItem } from '../types/CartItem.type'
import AsyncStorage from '@react-native-async-storage/async-storage'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledTextInput = styled(TextInput)

const CheckoutScreen = () => {
  const navigation = useNavigation()
  const [promoCode, setPromoCode] = useState('')
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 2.99
  const serviceFee = 1.99
  const total = subtotal + deliveryFee + serviceFee

  return (
    <StyledView className='flex-1 bg-gray-100'>
      <StyledView className='bg-white py-4 px-4 flex-row items-center'>
        <StyledTouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color='#00CCBB' size={24} />
        </StyledTouchableOpacity>
        <StyledText className='text-xl font-bold ml-4'>Checkout</StyledText>
      </StyledView>

      <StyledScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <StyledView className='bg-white mt-4 p-4'>
          <StyledText className='text-lg font-bold mb-2'>Your order</StyledText>
          {orderItems.map((item) => (
            <StyledView key={item.id} className='flex-row justify-between mb-2'>
              <StyledText className='text-gray-600'>
                {item.quantity}x {item.productName}
              </StyledText>
              <StyledText className='font-semibold'>${(item.price * item.quantity).toFixed(2)}</StyledText>
            </StyledView>
          ))}
        </StyledView>

        <StyledView className='bg-white mt-4 p-4'>
          <StyledView className='flex-row items-center mb-4'>
            <MapPin color='#00CCBB' size={24} />
            <StyledView className='ml-3'>
              <StyledText className='font-semibold'>Delivery address</StyledText>
              <StyledText className='text-gray-600'>123 Main St, Anytown, AN 12345</StyledText>
            </StyledView>
          </StyledView>
          <StyledView className='flex-row items-center'>
            <Clock color='#00CCBB' size={24} />
            <StyledView className='ml-3'>
              <StyledText className='font-semibold'>Estimated delivery time</StyledText>
              <StyledText className='text-gray-600'>30-45 minutes</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        <StyledTouchableOpacity className='bg-white mt-4 p-4 flex-row justify-between items-center'>
          <StyledView className='flex-row items-center'>
            <CreditCard color='#00CCBB' size={24} />
            <StyledText className='ml-3 font-semibold'>Payment method</StyledText>
          </StyledView>
          <StyledView className='flex-row items-center'>
            <StyledText className='text-gray-600 mr-2'>Visa •••• 1234</StyledText>
            <ChevronRight color='#00CCBB' size={20} />
          </StyledView>
        </StyledTouchableOpacity>

        <StyledView className='bg-white mt-4 p-4'>
          <StyledView className='flex-row items-center mb-4'>
            <Percent color='#00CCBB' size={24} />
            <StyledText className='ml-3 font-semibold'>Promo code</StyledText>
          </StyledView>
          <StyledView className='flex-row'>
            <StyledTextInput
              className='flex-1 border border-gray-300 rounded-l-lg p-2'
              placeholder='Enter promo code'
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <StyledTouchableOpacity className='bg-[#00CCBB] rounded-r-lg justify-center px-4'>
              <StyledText className='text-white font-semibold'>Apply</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledView className='bg-white mt-4 p-4'>
          <StyledText className='text-lg font-bold mb-2'>Total</StyledText>
          <StyledView className='flex-row justify-between mb-2'>
            <StyledText className='text-gray-600'>Subtotal</StyledText>
            <StyledText className='font-semibold'>${subtotal.toFixed(2)}</StyledText>
          </StyledView>
          <StyledView className='flex-row justify-between mb-2'>
            <StyledText className='text-gray-600'>Delivery Fee</StyledText>
            <StyledText className='font-semibold'>${deliveryFee.toFixed(2)}</StyledText>
          </StyledView>
          <StyledView className='flex-row justify-between mb-2'>
            <StyledText className='text-gray-600'>Service Fee</StyledText>
            <StyledText className='font-semibold'>${serviceFee.toFixed(2)}</StyledText>
          </StyledView>
          <StyledView className='flex-row justify-between mt-2 pt-2 border-t border-gray-200'>
            <StyledText className='font-bold'>Total</StyledText>
            <StyledText className='font-bold'>${total.toFixed(2)}</StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <StyledView className='bg-white p-4'>
        <StyledTouchableOpacity className='bg-[#00CCBB] py-3 rounded-lg'>
          <StyledText className='text-white text-center font-bold text-lg'>
            Place order • ${total.toFixed(2)}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  )
}

export default CheckoutScreen
