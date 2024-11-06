import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { Product } from '~/types/Product.type'
import { Store } from '~/types/Store.type'
import { ArrowLeft, MapPin, DollarSign, Star } from 'lucide-react-native'
import { styled } from 'nativewind'
import Slider from '@react-native-community/slider'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '~/types/RootStackParamList.type'

type SearchResultRouteParams = {
  searchQuery: string
}

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledTouchableOpacity = styled(TouchableOpacity)
const StyledScrollView = styled(ScrollView)

export default function SearchResultScreen() {
  const route = useRoute<RouteProp<{ params: SearchResultRouteParams }>>()
  const { searchQuery } = route.params
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [stores, setStores] = useState<Store[]>([])
  const [error, setError] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState(500)
  const [ratingFilter, setRatingFilter] = useState('0')

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/products')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
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

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        product.price <= priceRange &&
        parseFloat(product.store.rating.toString()) >= parseFloat(ratingFilter)
    )
  }, [products, searchQuery, priceRange, ratingFilter])

  useEffect(() => {
    const uniqueStores = [...new Map(filteredProducts.map((product) => [product.store.id, product.store])).values()]
    setStores(uniqueStores)
  }, [filteredProducts])

  if (loading) {
    return (
      <StyledView className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#00CCBB' />
      </StyledView>
    )
  }

  if (error) {
    return (
      <StyledView className='flex-1 justify-center items-center'>
        <StyledText className='text-red-500'>{error}</StyledText>
      </StyledView>
    )
  }

  const renderStoreCard = ({ item: store }: { item: Store }) => {
    const storeProducts = filteredProducts.filter((product) => product.store.id === store.id).slice(0, 3)

    return (
      <StyledTouchableOpacity
        onPress={() => navigation.navigate('RestaurantDetail', { restaurantID: store.id })}
        className='bg-white rounded-lg shadow-md mb-4 overflow-hidden'
      >
        <StyledView>
          <StyledImage source={{ uri: store.imageUrl }} className='w-full h-48' />
          <StyledView className='p-4'>
            <StyledText className='text-xl font-bold text-gray-800 mb-2'>{store.storeName}</StyledText>
            <StyledView className='flex-row items-center text-gray-600 mb-4'>
              <MapPin color='#00CCBB' size={16} />
              <StyledText className='text-sm ml-1'>{store.address}</StyledText>
            </StyledView>
            <StyledView className='flex-row items-center text-gray-600 mb-4'>
              <Star color='#00CCBB' size={20} />
              <StyledText className='text-sm ml-1'>{store.rating}</StyledText>
            </StyledView>
            <StyledView className='flex-row justify-around'>
              {storeProducts.map((product) => (
                <StyledView key={product.id} className='w-[30%]'>
                  <StyledImage source={{ uri: product.imageURL }} className='w-full h-24 rounded-md mb-2' />
                  <StyledText className='text-sm text-gray-700' numberOfLines={1}>
                    {product.productName}
                  </StyledText>
                  <StyledText className='text-sm text-gray-700' numberOfLines={1}>
                    {product.price} $
                  </StyledText>
                </StyledView>
              ))}
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    )
  }

  const handleRatingSelect = (rating: string) => {
    setRatingFilter(rating)
  }

  return (
    <StyledView className='flex-1 bg-gray-100'>
      <StyledView className='bg-white shadow-md'>
        <StyledView className='flex-row items-center p-4'>
          <StyledTouchableOpacity onPress={() => navigation.goBack()} className='mr-4'>
            <ArrowLeft color='#00CCBB' size={24} />
          </StyledTouchableOpacity>
          <StyledText className='text-2xl font-bold text-gray-800'>Search For {searchQuery}</StyledText>
        </StyledView>
      </StyledView>

      <StyledView className='p-4 bg-white mb-4'>
        <StyledView className='flex-row justify-between items-center mb-2'>
          <StyledView className='flex-1 mr-4'>
            <StyledView className='flex-row items-center mb-2'>
              <DollarSign color='#00CCBB' size={20} />
              <StyledText className='text-lg font-semibold ml-2'>Price Range</StyledText>
            </StyledView>
            <Slider
              minimumValue={0}
              maximumValue={500}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
              minimumTrackTintColor='#00CCBB'
              maximumTrackTintColor='#d4d4d4'
              thumbTintColor='#00CCBB'
            />
            <StyledView className='flex-row justify-between mt-1'>
              <StyledText className='text-gray-500'>$0</StyledText>
              <StyledText className='text-gray-500'>${priceRange}</StyledText>
              <StyledText className='text-gray-500'>$500</StyledText>
            </StyledView>
          </StyledView>

          <StyledView className='flex-1'>
            <StyledView className='flex-row items-center mb-2'>
              <Star color='#00CCBB' size={20} />
              <StyledText className='text-lg font-semibold ml-2'>Rating</StyledText>
            </StyledView>
            <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['0', '3', '4', '5'].map((rating) => (
                <StyledTouchableOpacity
                  key={rating}
                  onPress={() => handleRatingSelect(rating)}
                  className={`py-2 px-4 rounded-md mr-2 ${rating === ratingFilter ? 'bg-teal-200' : 'bg-gray-200'}`}
                >
                  <StyledText className={`text-sm ${rating === ratingFilter ? 'text-gray-800' : 'text-gray-500'}`}>
                    {rating === '0' ? 'All' : `${rating}+`}
                  </StyledText>
                </StyledTouchableOpacity>
              ))}
            </StyledScrollView>
          </StyledView>
        </StyledView>
      </StyledView>

      {stores.length === 0 ? (
        <StyledView className='flex-1 justify-center items-center'>
          <StyledText className='text-gray-500'>No results found for "{searchQuery}"</StyledText>
        </StyledView>
      ) : (
        <FlatList
          data={stores}
          renderItem={renderStoreCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        />
      )}
    </StyledView>
  )
}
