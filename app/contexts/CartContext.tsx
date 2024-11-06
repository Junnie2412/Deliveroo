import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Cart } from '~/types/Cart.type'
import { CartItemRequest } from '~/types/CartItemRequest.type'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface CartContextProps {
  cart: Cart | null
  addToCart: (item: CartItemRequest) => void
  getCart: () => void
}

interface CartProviderProps {
  children: ReactNode
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null)

  const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      return accessToken
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  }

  const getCart = async () => {
    try {
      const accessToken = await getAccessToken()

      if (!accessToken) {
        throw new Error('Access token not found')
      }

      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }

      const data: Cart = await response.json()
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (item: CartItemRequest) => {
    try {
      const accessToken = await getAccessToken()

      if (!accessToken) {
        throw new Error('Access token not found')
      }

      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [item]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add item to cart')
      }

      getCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  useEffect(() => {
    getCart()
  }, [])

  return <CartContext.Provider value={{ cart, addToCart, getCart }}>{children}</CartContext.Provider>
}
