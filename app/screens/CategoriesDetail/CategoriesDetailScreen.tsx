import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeftIcon, MapPinIcon, StarIcon } from 'react-native-heroicons/solid'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { FlatList } from 'react-native-gesture-handler'
import { RootStackParamList } from '../types/RootStackParamList.type'
import { Store } from '../types/Store.type'
import axios from 'axios'
import { Categories } from '../types/Categories.type'

type CategoriesDetailScreenRouteProp = RouteProp<RootStackParamList, 'CategoriesDetail'>

export default function CategoriesDetailScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CategoriesDetail'>>()
  const route = useRoute<CategoriesDetailScreenRouteProp>()
  const { categoryID } = route.params

  const [restaurants, setRestaurants] = useState<Store[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [category, setCategory] = useState<Categories | null>(null)

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `https://deliveroowebapp.azurewebsites.net/api/products?CategoryId=${categoryID}`
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (response.data && Array.isArray(response.data)) {
          const stores = response.data.map((product: any) => product.store);  
          setRestaurants(stores);
        } else {
          console.error('Invalid data structure returned:', response.data);
          Alert.alert('Error', 'Invalid data structure from server');
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        Alert.alert('Error', 'Could not fetch products.')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategory = async () => {
      try {
        const response = await axios.get<Categories>(
          `https://deliveroowebapp.azurewebsites.net/api/categories/${categoryID}`
        )
        setCategory(response.data)
      } catch (error) {
        console.error('Error fetching category:', error)
        Alert.alert('Error', 'Could not fetch category.')
      }
    }

    fetchRestaurants()
    fetchCategory()
  }, [categoryID])

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleRestaurantPress = (restaurantID: string) => {
    navigation.navigate('RestaurantDetail', { restaurantID })
  }

  const renderRestaurant = ({ item, index }: { item: Store, index: number }) => (
    <TouchableOpacity
      key={`${item.id}-${index}`}
      className='bg-white mb-4 shadow-sm'
      onPress={() => handleRestaurantPress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} className='h-36 w-full bg-gray-300 p-4' />
      <View className='px-3 pb-4 space-y-2'>
        <Text className='text-lg font-bold pt-2'>{item.storeName}</Text>
        <View className='flex-row items-center space-x-1'>
          <MapPinIcon color='gray' opacity={0.4} size={22} />
          <Text className='text-xs text-gray-500'>{item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='relative'>
        {category && <Image source={{ uri: category.imageUrl }} className='w-full h-56 bg-gray-300 p-4' />}
        <TouchableOpacity className='absolute top-3 left-5 p-2 bg-gray-100 rounded-full' onPress={handleGoBack}>
          <ChevronLeftIcon size={25} color='#00CCBB' />
        </TouchableOpacity>
      </View>

      <View className='bg-white'>
        <View className='px-4 pt-4'>
          <Text className='text-3xl font-bold'>{category?.categoryName} Restaurants</Text>
          <View className='flex-row space-x-2 my-1'>
            <View className='flex-row items-center space-x-1'>
              <StarIcon color='green' opacity={0.5} size={22} />
              <Text className='text-xs text-gray-500'>
                <Text className='text-green-500'>4.5</Text> · Offers
              </Text>
            </View>
          </View>
          <Text className='text-gray-500 mt-2 pb-4'>
            Delicious {category?.categoryName} options from top-rated restaurants in your area
          </Text>
        </View>
      </View>

      {loading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#00CCBB' />
          <Text className='mt-2 text-gray-500'>Loading restaurants...</Text>
        </View>
      ) : (
        // <FlatList
        //   data={restaurants}
        //   renderItem={renderRestaurant}
        //   keyExtractor={(item) => item.id}
        //   className='bg-gray-100'
        // />

        <ScrollView className='bg-gray-100'>
          <Text className='px-4 pt-6 mb-3 font-bold text-xl'>Featured Restaurants</Text>
          {restaurants.map((restaurant, index) => (
            <TouchableOpacity
              key={`${restaurant.id}-${index}`}  
              className='bg-white mb-4 shadow-sm'
              onPress={() => handleRestaurantPress(restaurant.id)} 
            >
              <Image source={{ uri: restaurant.imageUrl }} className='h-36 w-full bg-gray-300 p-4' />
              <View className='px-3 pb-4 space-y-2'>
                <Text className='text-lg font-bold pt-2'>{restaurant.storeName}</Text>
                <View className='flex-row items-center space-x-1'>
                  <MapPinIcon color='gray' opacity={0.4} size={22} />
                  <Text className='text-xs text-gray-500'>{restaurant.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}
