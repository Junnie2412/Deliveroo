import { CartItem } from './CartItem.type'

export type Cart = {
  id: string
  totalPrice: number
  status: string
  isActive: boolean
  cartItems: CartItem[]
}
