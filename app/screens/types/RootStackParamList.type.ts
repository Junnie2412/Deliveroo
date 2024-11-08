import { Product } from './Product.type'

export type RootStackParamList = {
  Login: undefined
  Home: undefined
  HomeTab: undefined
  Profile: { id: string }
  Settings: undefined
  Splash: undefined
  SignUp: undefined
  MyOrder: undefined
  Notifications: undefined
  Checkout: undefined
  OrderConfirmation: undefined
  SearchResult: { searchQuery: string }
  RestaurantDetail: { restaurantID: string }
  ProductDetail: { product: Product }
  CategoriesDetail: { categoryID: string }
  PersonalDetail: undefined,
  EditPersonalDetail: {userID: string}
  
}
