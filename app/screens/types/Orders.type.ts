export type Orders = {
  id: string
  orderDate: string
  paymentMethod: string
  billingAddress: string
  orderStatus: string
  cart: {
    totalPrice: number
    cartItems: Array<{
      productName: string
      quantity: number
      price: number
    }>
  }
}
