import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native'
import { styled } from 'nativewind'
import { ShoppingBag, Plus, Minus, X, ChevronLeft, Star } from 'lucide-react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Product } from '../types/Product.type'
import { Cart } from '../types/Cart.type'
import { Store } from '../types/Store.type'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootStackParamList } from '../types/RootStackParamList.type'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledSafeAreaView = styled(SafeAreaView)
const StyledScrollView = styled(ScrollView)

export default function RestaurantScreen() {
  const [cart, setCart] = useState<Cart>({
    id: '1',
    totalPrice: 0,
    status: 'active',
    isActive: true,
    cartItems: []
  })
  const [products, setProducts] = useState<Product[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [isCartModalVisible, setIsCartModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation()
  const navigation1 = useNavigation<NavigationProp<RootStackParamList, 'ProductDetail'>>()
  const navigation2 = useNavigation<NavigationProp<RootStackParamList, 'Checkout'>>()

  function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16).toUpperCase()
    })
  }

  useEffect(() => {
    const fetchStoreAndProducts = async () => {
      try {
        setIsLoading(true)
        const restaurantID = await AsyncStorage.getItem('RestaurantID')
        if (!restaurantID) {
          throw new Error('Restaurant ID not found')
        }

        const authToken = await AsyncStorage.getItem('accessToken')
        console.log(authToken)
        if (!authToken) {
          throw new Error('Authentication token not found')
        }

        const [storeResponse, productsResponse, cartResponse] = await Promise.all([
          axios.get(`https://deliveroowebapp.azurewebsites.net/api/Store/${restaurantID}`),
          axios.get(`https://deliveroowebapp.azurewebsites.net/api/products?StoreId=${restaurantID}`),
          axios.get('https://deliveroowebapp.azurewebsites.net/api/Cart/active', {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          })
        ])

        setStore(storeResponse.data)
        setProducts(productsResponse.data)
        setCart(
          cartResponse.data[0] || {
            id: generateGuid(),
            totalPrice: 0,
            status: 'active',
            isActive: true,
            cartItems: []
          }
        )
      } catch (error) {
        console.error('Error fetching store, products, or cart:', error)
        setError('Failed to load restaurant data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoreAndProducts()
  }, [])

  useEffect(() => {
    const newTotalPrice = cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    setCart((prevCart) => ({ ...prevCart, totalPrice: newTotalPrice }))
  }, [cart.cartItems])

  const addToCart = async (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.cartItems.find((item) => item.productID === product.id)

      if (existingItem) {
        const payload = {
          id: existingItem.id,
          quantity: existingItem.quantity + 1
        }

        console.log('Updating cart with payload:', payload)

        AsyncStorage.getItem('accessToken')
          .then(async (authToken) => {
            if (!authToken) {
              throw new Error('Authentication token not found')
            }

            try {
              await axios.put('https://deliveroowebapp.azurewebsites.net/api/CartItem/quantity', payload, {
                headers: {
                  Authorization: `Bearer ${authToken}`
                }
              })
              console.log('Cart updated successfully')
            } catch (error) {
              console.error('Error updating cart:', error)
            }
          })
          .catch((error) => {
            console.error('Error fetching auth token:', error)
          })

        const updatedCartItems = prevCart.cartItems.map((item) =>
          item.productID === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )

        return {
          ...prevCart,
          cartItems: updatedCartItems
        }
      } else {
        const payload = {
          items: [
            {
              productID: product.id,
              quantity: 1
            }
          ]
        }
        AsyncStorage.getItem('accessToken')
          .then(async (authToken) => {
            if (!authToken) {
              throw new Error('Authentication token not found')
            }

            try {
              const response = await axios.post('https://deliveroowebapp.azurewebsites.net/api/Cart', payload, {
                headers: {
                  Authorization: `Bearer ${authToken}`
                }
              })

              console.log('New item added to cart successfully:', response.data)
            } catch (error) {
              console.error('Error adding item to cart:', error)
            }
          })
          .catch((error) => {
            console.error('Error fetching auth token:', error)
          })

        const newCartItem = {
          id: generateGuid(),
          productID: product.id,
          productName: product.productName,
          quantity: 1,
          price: product.price,
          storeID: product.store.id
        }

        const updatedCartItems = [...prevCart.cartItems, newCartItem]

        return {
          ...prevCart,
          cartItems: updatedCartItems
        }
      }
    })
  }

  const removeFromCart = async (productId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.cartItems
        .map((item) => (item.productID === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0)

      return {
        ...prevCart,
        cartItems: updatedItems
      }
    })

    const existingItem = cart.cartItems.find((item) => item.productID === productId)

    if (existingItem) {
      const payload = {
        id: existingItem.id,
        quantity: existingItem.quantity - 1 //
      }

      const authToken = await AsyncStorage.getItem('accessToken')
      if (!authToken) {
        throw new Error('Authentication token not found')
      }

      try {
        await axios.put('https://deliveroowebapp.azurewebsites.net/api/CartItem/quantity', payload, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })

        console.log('Cart updated successfully')
      } catch (error) {
        console.error('Error updating cart:', error)
      }
    } else {
      console.log('Item not found in cart')
    }
  }

  const handleProductPress = (product: Product) => {
    navigation1.navigate('ProductDetail', { product: product })
  }

  const clearAllCart = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken')

      if (!token) {
        throw new Error('Authorization token is missing')
      }
      const cartApiResponse = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart/active', {
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

      // Update local cart state to reflect an empty cart
      setCart({
        ...cart,
        cartItems: [],
        totalPrice: 0
      })
      setIsCartModalVisible(false)
      console.log('Cart cleared successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      console.error(error)
    }
  }, [cart])

  const renderProductItem = ({ item }: { item: Product }) => {
    const cartItem = cart.cartItems.find((cartItem) => cartItem.productID === item.id)
    const quantity = cartItem ? cartItem.quantity : 0

    return (
      <StyledView className='flex-row items-center p-4 border-b border-gray-200'>
        <StyledTouchableOpacity className='flex-1 flex-row items-center' onPress={() => handleProductPress(item)}>
          <StyledView className='flex-1 pr-4'>
            <StyledText className='text-lg font-bold'>{item.productName}</StyledText>
            <StyledText className='text-sm text-gray-500'>{item.briefDescription}</StyledText>
            <StyledText className='text-base font-semibold mt-1'>${item.price.toFixed(2)}</StyledText>
          </StyledView>
          <StyledImage source={{ uri: item.imageURL }} className='w-20 h-20 rounded-lg' />
        </StyledTouchableOpacity>
        <StyledView className='flex-row items-center ml-4'>
          <StyledTouchableOpacity className='p-2 bg-gray-200 rounded-full' onPress={() => removeFromCart(item.id)}>
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
      <StyledSafeAreaView className='flex-1 justify-end bg-black bg-opacity-50'>
        <StyledView className='bg-white rounded-t-3xl p-6 h-3/4'>
          <StyledView className='flex-row justify-between items-center mb-4'>
            <StyledText className='text-2xl font-bold'>Your Cart</StyledText>
            <StyledTouchableOpacity onPress={() => setIsCartModalVisible(false)}>
              <X size={24} color='#00CCBB' />
            </StyledTouchableOpacity>
          </StyledView>
          <StyledScrollView>
            {cart.cartItems.map((item) => (
              <StyledView key={item.id} className='flex-row justify-between items-center mb-4'>
                <StyledView className='flex-1'>
                  <StyledText className='text-lg font-semibold'>{item.productName}</StyledText>
                  <StyledText className='text-gray-500'>${item.price.toFixed(2)} each</StyledText>
                </StyledView>
                <StyledView className='flex-row items-center'>
                  <StyledTouchableOpacity
                    className='p-1 bg-gray-200 rounded-full'
                    onPress={() => removeFromCart(item.productID)}
                  >
                    <Minus size={16} color='#00CCBB' />
                  </StyledTouchableOpacity>
                  <StyledText className='mx-3 text-lg'>{item.quantity}</StyledText>
                  <StyledTouchableOpacity
                    className='p-1 bg-gray-200 rounded-full'
                    onPress={() => addToCart({ id: item.productID } as Product)}
                  >
                    <Plus size={16} color='#00CCBB' />
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            ))}
          </StyledScrollView>
          <StyledTouchableOpacity className='bg-red-500 py-2 px-4 rounded-full' onPress={clearAllCart}>
            <StyledText className='text-white text-lg font-bold'>Clear All</StyledText>
          </StyledTouchableOpacity>
          <StyledView className='mt-4 border-t border-gray-200 pt-4'>
            <StyledText className='text-xl font-bold'>Total: ${cart.totalPrice.toFixed(2)}</StyledText>
          </StyledView>
          <StyledTouchableOpacity
            className='mt-6 bg-[#00CCBB] py-3 rounded-full'
            onPress={() => {
              // Handle checkout logic here
              setIsCartModalVisible(false)
            }}
          >
            <StyledText className='text-center text-white text-lg font-bold'>Checkout</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledSafeAreaView>
    </Modal>
  )

  if (isLoading) {
    return (
      <StyledView className='flex-1 justify-center items-center'>
        <StyledText>Loading...</StyledText>
      </StyledView>
    )
  }

  if (error) {
    return (
      <StyledView className='flex-1 justify-center items-center'>
        <StyledText>{error}</StyledText>
      </StyledView>
    )
  }

  return (
    <StyledSafeAreaView className='flex-1 bg-white'>
      <StyledView className='flex-row items-center p-4 bg-white border-b border-gray-200'>
        <StyledTouchableOpacity onPress={() => navigation.goBack()} className='mr-4'>
          <ChevronLeft size={24} color='#00CCBB' />
        </StyledTouchableOpacity>
        <StyledText className='text-lg font-bold'>{store ? store.storeName : 'Restaurant'}</StyledText>
      </StyledView>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <StyledView className='bg-gray-100'>
            {store && (
              <>
                <StyledImage source={{ uri: store.imageUrl }} className='w-full h-48 object-cover' />
                <StyledView className='p-4'>
                  <StyledText className='text-2xl font-bold mb-2'>{store.storeName}</StyledText>
                  <StyledView className='flex-row items-center mb-2'>
                    <Star size={18} color='#FFD700' />
                    <StyledText className='ml-1 text-gray-600'>{store.rating.toFixed(1)}</StyledText>
                  </StyledView>
                  <StyledText className='text-sm text-gray-500'>{store.address}</StyledText>
                </StyledView>
              </>
            )}
          </StyledView>
        )}
      />
      {cart.cartItems.length > 0 && (
        <StyledView className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex-row justify-between items-center'>
          <StyledTouchableOpacity onPress={() => setIsCartModalVisible(true)}>
            <ShoppingBag size={24} color='#00CCBB' />
          </StyledTouchableOpacity>
          <StyledText className='text-lg font-bold'>Total: ${cart.totalPrice.toFixed(2)}</StyledText>
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
    </StyledSafeAreaView>
  )
}
