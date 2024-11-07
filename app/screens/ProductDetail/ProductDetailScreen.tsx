import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ArrowLeft, Star, Heart } from 'lucide-react-native'
import { styled } from 'nativewind'
import { Product } from '../types/Product.type'
import { RootStackParamList } from '../types/RootStackParamList.type'
import { LinearGradient } from 'expo-linear-gradient'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)
const StyledLinearGradient = styled(LinearGradient)

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>()
  const navigation = useNavigation()
  const { product }: { product: Product } = route.params

  const handleReturn = () => {
    navigation.goBack()
  }

  const handleFavorite = () => {
    // Implement favorite functionality
    console.log('Added to favorites:', product.productName)
  }

  return (
    <StyledView className='flex-1 bg-white'>
      <StyledScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <StyledView className='relative'>
          <StyledImage source={{ uri: product.imageURL }} className='w-full h-96' resizeMode='cover' />
          <StyledLinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className='absolute bottom-0 left-0 right-0 h-1/2'
          />
          <StyledTouchableOpacity
            className='absolute top-12 left-4 bg-white p-2 rounded-full shadow-md'
            onPress={handleReturn}
          >
            <ArrowLeft color='#00CCBB' size={24} />
          </StyledTouchableOpacity>
          <StyledView className='absolute bottom-4 left-4 right-4'>
            <StyledText className='text-4xl font-bold text-white mb-2'>{product.productName}</StyledText>
            <StyledView className='flex-row items-center'>
              <StyledText className='text-white text-lg ml-1'></StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        <StyledView className='bg-white -mt-6 rounded-t-3xl pt-6 px-5'>
          <StyledView className='mb-6'>
            <StyledText className='text-xl font-semibold text-gray-800 mb-2'>About this product</StyledText>
            <StyledText className='text-lg text-gray-600 leading-6 mb-4'>{product.briefDescription}</StyledText>
            <StyledText className='text-lg text-gray-600 leading-6'>{product.fullDescription}</StyledText>
          </StyledView>

          <StyledView className='mb-6'>
            <StyledText className='text-xl font-semibold text-gray-800 mb-2'>Product Details</StyledText>
            <StyledView className='flex-row flex-wrap'>
              {['Organic', 'Gluten-free', 'Non-GMO', 'Vegan'].map((tag, index) => (
                <StyledView key={index} className='bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2'>
                  <StyledText className='text-gray-600'>{tag}</StyledText>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>

          <StyledView className='mb-6'>
            <StyledText className='text-xl font-semibold text-gray-800 mb-2'>Customer Reviews</StyledText>
            {[1, 2, 3].map((_, index) => (
              <StyledView key={index} className='mb-4'>
                <StyledView className='flex-row items-center mb-1'>
                  <StyledView className='flex-row'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} color='#FFD700' fill={star <= 4 ? '#FFD700' : 'transparent'} size={16} />
                    ))}
                  </StyledView>
                  <StyledText className='text-gray-600 ml-2'>John Doe</StyledText>
                </StyledView>
                <StyledText className='text-gray-600'>Great product! Highly recommended.</StyledText>
              </StyledView>
            ))}
          </StyledView>
        </StyledView>
      </StyledScrollView>

      <StyledTouchableOpacity
        className='absolute bottom-6 right-6 bg-[#00CCBB] p-3 rounded-full shadow-lg'
        onPress={handleFavorite}
      >
        <Heart color='white' size={24} />
      </StyledTouchableOpacity>
    </StyledView>
  )
}

export default ProductDetailScreen
