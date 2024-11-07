import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Cart } from '~/screens/types/Cart.type'
import { CartItemRequest } from '~/screens/types/CartItemRequest.type'

interface CartContextProps {
  cart: Cart | null
  addToCart: (item: CartItemRequest) => void
  getCart: () => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  removeCartItem: (itemId: string) => void
  clearCart: () => void
  getCartTotal: () => number
}

interface CartProviderProps {
  children: ReactNode
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
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
      if (!accessToken) throw new Error('Access token not found')

      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch cart')

      const data: Cart = await response.json()
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (item: CartItemRequest) => {
    try {
      const accessToken = await getAccessToken()
      if (!accessToken) throw new Error('Access token not found')

      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: [item] })
      })
      if (!response.ok) throw new Error('Failed to add item to cart')

      getCart() // Refresh cart after adding item
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    try {
      const accessToken = await getAccessToken()
      if (!accessToken) throw new Error('Access token not found')

      const response = await fetch(`https://deliveroowebapp.azurewebsites.net/api/Cart/${itemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      })
      if (!response.ok) throw new Error('Failed to update item quantity')

      getCart() // Refresh cart
    } catch (error) {
      console.error('Error updating cart item quantity:', error)
    }
  }

  const removeCartItem = async (itemId: string) => {
    try {
      const accessToken = await getAccessToken()
      if (!accessToken) throw new Error('Access token not found')

      const response = await fetch(`https://deliveroowebapp.azurewebsites.net/api/Cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (!response.ok) throw new Error('Failed to remove item from cart')

      getCart() // Refresh cart
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  const clearCart = async () => {
    try {
      const accessToken = await getAccessToken()
      if (!accessToken) throw new Error('Access token not found')

      const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/Cart/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (!response.ok) throw new Error('Failed to clear cart')

      setCart(null)
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const getCartTotal = () => {
    return cart?.cartItems.reduce((total, item) => total + item.price * item.quantity, 0) || 0
  }

  useEffect(() => {
    getCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
