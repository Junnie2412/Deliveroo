import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ActivityIndicator, Image, TouchableOpacity, FlatList, Modal } from 'react-native'
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native'
import { ArrowLeft, MapPin, Star, ShoppingBag, Plus, Minus } from 'lucide-react-native'
import { styled } from 'nativewind'
import { RootStackParamList } from '../types/RootStackParamList.type'
import { Store } from '../types/Store.type'
import { Product } from '../types/Product.type'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CartItemNew } from '../types/CartItemNew.type'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)

interface CartItem extends Product {
  quantity: number
}

export default function RestaurantDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'RestaurantDetail'>>()
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'ProductDetail'>>()
  const navigation2 = useNavigation<NavigationProp<RootStackParamList, 'Checkout'>>()
  const { restaurantID } = route.params
  const [restaurant, setRestaurant] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartModalVisible, setIsCartModalVisible] = useState(false)

  const addToCart = useCallback(async (product: Product) => {
    try {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id)
        if (existingItem) {
          return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
          return [...prevCart, { ...product, quantity: 1 }]
        }
      })

      const token = await AsyncStorage.getItem('accessToken')
      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [
            {
              productID: product.id,
              quantity: 1
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add product to cart')
      }

      const cartResponse = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!cartResponse.ok) {
        throw new Error('Failed to fetch updated cart')
      }

      const data = await cartResponse.json()
      setCart(data[0].cartItems || [])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
      console.error(error)
    }
  }, [])

  const removeFromCart = useCallback(async (product: Product) => {
    try {
      setCart((prevCart: CartItem[]) => {
        const existingItem = prevCart.find((item) => item.id === product.id)
        if (existingItem && existingItem.quantity > 1) {
          return prevCart.map((item: CartItem) =>
            item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
          )
        } else {
          return prevCart.filter((item: CartItem) => item.id !== product.id)
        }
      })

      const token = await AsyncStorage.getItem('accessToken')

      if (!token) {
        throw new Error('Authorization token is missing')
      }
      const cartApiResponse = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!cartApiResponse.ok) {
        throw new Error('Failed to fetch cart items')
      }

      const cartData = await cartApiResponse.json()
      const cartItems = cartData[0]?.cartItems || []

      if (!cartItems.length) {
        throw new Error('No cart items found')
      }

      const cartItem = cartItems.find((item: CartItemNew) => item.id === product.id)

      if (!cartItem || cartItem.quantity === undefined) {
        throw new Error('Product not found or quantity is missing in the cart')
      }

      console.log(product.id, cartItem.quantity - 1)

      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/CartItem/quantity', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: product.id,
          quantity: cartItem.quantity - 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update product quantity in cart')
      }

      // Re-fetch the cart to update the local state with the latest backend data
      const cartResponse = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!cartResponse.ok) {
        throw new Error('Failed to fetch updated cart')
      }

      // Set the updated cart items in the state
      const updatedCartData = await cartResponse.json()
      setCart(updatedCartData[0]?.cartItems || [])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
      console.error('Error while removing from cart:', error)
    }
  }, [])

  const clearAllCart = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken')

      if (!token) {
        throw new Error('Authorization token is missing')
      }
      const cartApiResponse = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!cartApiResponse.ok) {
        throw new Error('Failed to fetch cart items')
      }

      const cartData = await cartApiResponse.json()
      const cartItems = cartData[0]

      const cartClearResponse = await fetch(`https://deliveroowebapp.azurewebsites.net/api/Cart/hard/${cartItems.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!cartClearResponse.ok) {
        throw new Error('Failed to clear cart')
      }

      setCart([])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      console.error(error)
    }
  }, [])

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`https://deliveroowebapp.azurewebsites.net/api/Store/${restaurantID}`)
        if (!response.ok) throw new Error('Failed to fetch restaurant details')
        const data: Store = await response.json()
        setRestaurant(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
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
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
        console.error(error)
      }
    }

    const fetchCart = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken')
        const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Failed to fetch cart')

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          setCart(data[0].cartItems || [])
        } else {
          setCart([])
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred')
        }
        console.error(error)
      }
    }

    if (restaurantID) {
      fetchRestaurant()
      fetchProducts()
      fetchCart()
    } else {
      setError('Restaurant ID is missing')
      setLoading(false)
    }
  }, [restaurantID])

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product: product })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const renderProductItem = ({ item }: { item: Product }) => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id)
    const quantity = cartItem ? cartItem.quantity : 0

    return (
      <StyledView className='flex-row items-center p-4 border-b border-gray-200'>
        <StyledTouchableOpacity className='flex-1 flex-row items-center' onPress={() => handleProductPress(item)}>
          <StyledView className='flex-1 pr-4'>
            <StyledText className='text-lg font-bold text-gray-800 mb-1'>{item.productName}</StyledText>
            <StyledText className='text-base font-semibold text-gray-900'>${item.price.toFixed(2)}</StyledText>
          </StyledView>
          <StyledImage
            className='h-20 w-20 rounded-lg object-cover'
            source={{ uri: item.imageURL ? item.imageURL : 'https://via.placeholder.com/150' }}
          />
        </StyledTouchableOpacity>
        <StyledView className='flex-row items-center ml-4'>
          <StyledTouchableOpacity className='p-2 bg-gray-200 rounded-full' onPress={() => removeFromCart(item)}>
            <Minus size={20} color='#00CCBB' />
          </StyledTouchableOpacity>
          <StyledText className='mx-3 text-lg'>{quantity}</StyledText>
          <StyledTouchableOpacity className='p-2 bg-gray-200 rounded-full' onPress={() => addToCart(item)}>
            <Plus size={20} color='#00CCBB' />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    )
  }

  const CartModal = () => (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isCartModalVisible}
      onRequestClose={() => setIsCartModalVisible(false)}
    >
      <StyledView className='flex-1 justify-end'>
        <StyledView className='bg-white rounded-t-3xl p-6'>
          <StyledText className='text-2xl font-bold mb-4'>Your Cart</StyledText>
          <FlatList
            data={cart}
            renderItem={({ item }) => (
              <StyledView className='flex-row justify-between items-center mb-2'>
                <StyledText className='text-lg flex-1'>{item.productName}</StyledText>
                <StyledView className='flex-row items-center'>
                  <StyledTouchableOpacity
                    className='p-1 bg-gray-200 rounded-full mr-2'
                    onPress={() => removeFromCart(item)}
                  >
                    <Minus size={16} color='#00CCBB' />
                  </StyledTouchableOpacity>
                  <StyledText className='text-lg mx-2'>{item.quantity}</StyledText>
                  <StyledTouchableOpacity className='p-1 bg-gray-200 rounded-full ml-2' onPress={() => addToCart(item)}>
                    <Plus size={16} color='#00CCBB' />
                  </StyledTouchableOpacity>
                  <StyledText className='text-lg font-semibold ml-4'>
                    ${(item.price * item.quantity).toFixed(2)}
                  </StyledText>
                </StyledView>
              </StyledView>
            )}
            keyExtractor={(item) => item.id?.toString() || item.productName}
          />
          <StyledView className='mt-4 border-t border-gray-200 pt-4 flex-row justify-between items-center'>
            <StyledText className='text-xl font-bold'>Total: ${getTotalPrice().toFixed(2)}</StyledText>
            <StyledTouchableOpacity className='bg-red-500 py-2 px-4 rounded-full' onPress={clearAllCart}>
              <StyledText className='text-white text-lg font-bold'>Clear All</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
          <StyledTouchableOpacity
            className='mt-6 bg-[#00CCBB] py-3 rounded-full'
            onPress={() => setIsCartModalVisible(false)}
          >
            <StyledText className='text-center text-white text-lg font-bold'>Close</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </Modal>
  )

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

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id?.toString() || item.productName}
        contentContainerStyle={{ paddingBottom: cart.length > 0 ? 80 : 16 }}
      />

      {cart.length > 0 && (
        <StyledView className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex-row justify-between items-center'>
          <StyledTouchableOpacity onPress={() => setIsCartModalVisible(true)}>
            <ShoppingBag size={24} color='#00CCBB' />
          </StyledTouchableOpacity>
          <StyledText className='text-lg font-bold'>Total: ${getTotalPrice().toFixed(2)}</StyledText>
          <StyledTouchableOpacity
            className='bg-[#00CCBB] px-4 py-2 rounded-full'
            onPress={() => {
              navigation2.navigate('Checkout')
            }}
          >
            <StyledText className='text-white font-bold'>Checkout</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      )}

      <CartModal />
    </StyledView>
  )
}
