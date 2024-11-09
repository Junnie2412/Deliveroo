import { Cart } from './Cart.type'
import { StoreLocation } from './StoreLocation.type'
import { UserResponse } from './UserResponse.type'

export type OrderList = {
  id: string
  billingAddress: string
  cart: Cart
  user: UserResponse
  storeLocation: StoreLocation
  orderDate: string
  paymentMethod: string
  orderStatus: string
}
