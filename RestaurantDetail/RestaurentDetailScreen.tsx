import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native'
import { ArrowLeft, MapPin, Star } from 'lucide-react-native'
import { styled } from 'nativewind'
import { useCart } from '../contexts/CartContext'
import { Store } from '../types/Store.type'
import { Product } from '../types/Product.type'
import { RootStackParamList } from '../types/RootStackParamList.type'


const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)

export default function RestaurantDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetail'>>()
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'ProductDetail'>>()
  const { restaurantID } = route.params
  const { cart, addToCart } = useCart()
  const [restaurant, setRestaurant] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`https://deliveroowebapp.azurewebsites.net/api/Store/${restaurantID}`)
        if (!response.ok) throw new Error('Failed to fetch restaurant details')
        const data: Store = await response.json()
        setRestaurant(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://deliveroowebapp.azurewebsites.net/api/products?StoreId=${restaurantID}`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data: Product[] = await response.json()
        setProducts(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        console.error(error)
      }
    }

    if (restaurantID) {
      fetchRestaurant()
      fetchProducts()
    } else {
      setError('Restaurant ID is missing')
      setLoading(false)
    }
  }, [restaurantID])

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product })
  }

  const handleAddToCart = (product: Product) => {
    addToCart({ productID: product.id, quantity: 1 })
  }

  const calculateTotal = () => {
    console.log(cart) // Check cart structure
    console.log(cart?.cartItems)

    if (!cart) return { totalQuantity: 0, totalPrice: 0 }

    const mappedItems = cart.cartItems.map((item) => {
      const quantity = item.quantity || 0
      const price = item.price || 0
      return { quantity, price, total: quantity * price }
    })

    const totalQuantity = mappedItems.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = mappedItems.reduce((acc, item) => acc + item.total, 0)

    console.log('Mapped Items:', mappedItems)
    console.log('Total Quantity:', totalQuantity)
    console.log('Total Price:', totalPrice)

    return { totalQuantity, totalPrice }
  }

  const { totalQuantity, totalPrice } = calculateTotal()

  if (loading) {
    return (
      <StyledView className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#00CCBB' />
      </StyledView>
    )
  }

  if (error) {
    return (
      <StyledView className='flex-1 justify-center items-center bg-white'>
        <StyledText className='text-red-500 text-lg'>{error}</StyledText>
      </StyledView>
    )
  }

  if (!restaurant) {
    return (
      <StyledView className='flex-1 justify-center items-center bg-white'>
        <StyledText className='text-red-500 text-lg'>No restaurant found.</StyledText>
      </StyledView>
    )
  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <StyledView className='flex-row items-center p-4 border-b border-gray-200'>
      <StyledTouchableOpacity className='flex-row items-center flex-1' onPress={() => handleProductPress(item)}>
        <StyledView className='flex-1 pr-4'>
          <StyledText className='text-lg font-bold text-gray-800 mb-1'>{item.productName}</StyledText>
          <StyledText className='text-base font-semibold text-gray-900'>${item.price.toFixed(2)}</StyledText>
        </StyledView>
        <StyledImage
          className='h-20 w-20 rounded-lg object-cover'
          source={{ uri: item.imageURL || 'https://via.placeholder.com/150' }}
        />
      </StyledTouchableOpacity>

      <StyledTouchableOpacity onPress={() => handleAddToCart(item)} className='ml-4'>
        <StyledText className='text-green-500 font-bold text-lg'>+</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  )

  return (
    <StyledView className='flex-1 bg-white'>
      <StyledView className='relative'>
        {restaurant.imageUrl && <StyledImage source={{ uri: restaurant.imageUrl }} className='w-full h-56' />}
        <StyledTouchableOpacity
          onPress={() => navigation.goBack()}
          className='absolute top-3 left-4 p-2 bg-gray-100 rounded-full'
        >
          <ArrowLeft size={24} color='#00CCBB' />
        </StyledTouchableOpacity>
      </StyledView>
      <StyledView className='px-4 py-2'>
        <StyledText className='text-2xl font-bold'>{restaurant.storeName}</StyledText>
        <StyledView className='flex-row items-center mt-2'>
          <MapPin size={16} color='#00CCBB' />
          <StyledText className='ml-1 text-sm text-gray-500'>{restaurant.address}</StyledText>
        </StyledView>
        <StyledView className='flex-row items-center mt-2'>
          <Star size={16} color='gold' />
          <StyledText className='ml-1 text-sm text-gray-500'>4.5</StyledText>
        </StyledView>
      </StyledView>

      <StyledScrollView className='mt-4 px-4'>
        <FlatList data={products} renderItem={renderProductItem} keyExtractor={(item) => item.id.toString()} />
      </StyledScrollView>

      {totalQuantity > 0 && (
        <StyledView className='px-4 py-3 bg-gray-100'>
          <StyledText className='text-lg font-bold'>Total: ${totalPrice.toFixed(2)}</StyledText>
          <StyledText className='text-sm'>Quantity: {totalQuantity}</StyledText>
          <StyledTouchableOpacity className='bg-green-500 py-2 px-4 rounded-lg mt-3'>
            <StyledText className='text-white text-center'>Checkout</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}
    </StyledView>
  )
}
