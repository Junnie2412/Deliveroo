import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Animated } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react-native'
import { styled } from 'nativewind'
import { Product } from '../types/Product.type'
import { RootStackParamList } from '../types/RootStackParamList.type'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>()
  const navigation = useNavigation()
  const { product }: { product: Product } = route.params

  const [quantity, setQuantity] = useState(1)
  const [showAddToCart, setShowAddToCart] = useState(false)
  const fadeAnim = useState(new Animated.Value(0))[0]

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
    if (!showAddToCart) {
      setShowAddToCart(true)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start()
    }
  }

  const addToCart = () => {
    console.log('Added to cart', { product, quantity })
    // Handle adding to cart logic here
  }

  const handleReturn = () => {
    navigation.goBack()
  }

  return (
    <StyledView className='flex-1 bg-white'>
      <StyledScrollView>
        <StyledView className='relative'>
          <StyledImage source={{ uri: product.imageURL }} className='w-full h-72' />
          <StyledTouchableOpacity
            className='absolute top-12 left-4 bg-white p-2 rounded-full shadow-md'
            onPress={handleReturn}
          >
            <ArrowLeft color='#00CCBB' size={24} />
          </StyledTouchableOpacity>
        </StyledView>

        <StyledView className='bg-white -mt-12 rounded-t-3xl pt-6 px-5'>
          <StyledText className='text-3xl font-bold text-gray-800 mb-2'>{product.productName}</StyledText>
          <StyledText className='text-2xl font-semibold text-gray-900 mb-6'>${product.price.toFixed(2)}</StyledText>

          <StyledView className='flex-row items-center justify-between mb-6'>
            <StyledView className='flex-row items-center bg-gray-100 rounded-full'>
              <StyledTouchableOpacity onPress={decreaseQuantity} className='p-3'>
                <Minus color={quantity > 1 ? '#00CCBB' : '#A0AEC0'} size={24} />
              </StyledTouchableOpacity>
              <StyledText className='mx-4 text-xl font-bold'>{quantity}</StyledText>
              <StyledTouchableOpacity onPress={increaseQuantity} className='p-3'>
                <Plus color='#00CCBB' size={24} />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>

          <StyledView className='mb-6'>
            <StyledText className='text-lg font-semibold text-gray-800 mb-2'>About this product</StyledText>
          </StyledView>

          <StyledView className='mb-6'>
            <StyledText className='text-lg font-semibold text-gray-800 mb-2'>Allergens</StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }
          ]
        }}
      >
        {showAddToCart && (
          <StyledTouchableOpacity
            className='bg-[#00CCBB] mx-5 p-4 rounded-lg flex-row items-center justify-between mb-5'
            onPress={addToCart}
          >
            <StyledText className='text-white font-bold text-lg'>{quantity}</StyledText>
            <StyledView className='flex-row items-center'>
              <StyledText className='text-white font-bold text-lg mr-2'>Add to cart</StyledText>
              <ShoppingCart color='white' size={24} />
            </StyledView>
            <StyledText className='text-white font-bold text-lg'>${(product.price * quantity).toFixed(2)}</StyledText>
          </StyledTouchableOpacity>
        )}
      </Animated.View>
    </StyledView>
  )
}

export default ProductDetailScreen
