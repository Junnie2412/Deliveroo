import React from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeftIcon, MapPinIcon, StarIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'

const restaurants = [
  {
    id: 1,
    name: "Joe's Pizza",
    image:
      'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2FjoePizza.jpg?alt=media&token=29762181-9dde-4068-b794-fee1957bde0e',
    rating: 4.5,
    reviews: 500,
    category: 'Italian',
    address: '123 Main St, New York, NY',
    deliveryTime: '20-30 min',
    deliveryFee: '$2.99'
  },
  {
    id: 2,
    name: "Mama's Pizzeria",
    image:
      'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fmamapizza.jfif?alt=media&token=a2c32468-838e-41cd-85a5-c76af3ddf8d6',
    rating: 4.2,
    reviews: 350,
    category: 'Italian',
    address: '456 Elm St, New York, NY',
    deliveryTime: '25-35 min',
    deliveryFee: '$3.99'
  },
  {
    id: 3,
    name: "Luigi's Pizza Palace",
    image:
      'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fluispizza.jfif?alt=media&token=58ecf037-17d2-41f7-a5ea-8c88097fd310',
    rating: 4.7,
    reviews: 750,
    category: 'Italian',
    address: '789 Oak St, New York, NY',
    deliveryTime: '15-25 min',
    deliveryFee: '$1.99'
  }
]

export default function ProductDetailScreen() {
  const navigation = useNavigation()
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='relative'>
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fpizzarestaurant.jpg?alt=media&token=fce3d031-9e4e-41fc-ade1-da77774e032a'
          }}
          className='w-full h-56 bg-gray-300 p-4'
        />
        <TouchableOpacity
          className='absolute top-3 left-5 p-2 bg-gray-100 rounded-full'
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size={25} color='#00CCBB' />
        </TouchableOpacity>
      </View>

      <View className='bg-white'>
        <View className='px-4 pt-4'>
          <Text className='text-3xl font-bold'>Pizza Restaurants</Text>
          <View className='flex-row space-x-2 my-1'>
            <View className='flex-row items-center space-x-1'>
              <StarIcon color='green' opacity={0.5} size={22} />
              <Text className='text-xs text-gray-500'>
                <Text className='text-green-500'>4.5</Text> · Offers
              </Text>
            </View>
            <View className='flex-row items-center space-x-1'>
              <MapPinIcon color='gray' opacity={0.4} size={22} />
              <Text className='text-xs text-gray-500'>Nearby · New York</Text>
            </View>
          </View>
          <Text className='text-gray-500 mt-2 pb-4'>
            Delicious pizza options from top-rated restaurants in your area
          </Text>
        </View>
      </View>

      <ScrollView className='bg-gray-100'>
        <Text className='px-4 pt-6 mb-3 font-bold text-xl'>Featured Restaurants</Text>
        {restaurants.map((restaurant) => (
          <TouchableOpacity key={restaurant.id} className='bg-white mb-4 shadow-sm'>
            <Image source={{ uri: restaurant.image }} className='h-36 w-full bg-gray-300 p-4' />
            <View className='px-3 pb-4 space-y-2'>
              <Text className='text-lg font-bold pt-2'>{restaurant.name}</Text>
              <View className='flex-row items-center space-x-1'>
                <StarIcon color='green' opacity={0.5} size={22} />
                <Text className='text-xs text-gray-500'>
                  <Text className='text-green-500'>{restaurant.rating}</Text> · {restaurant.reviews} reviews
                </Text>
              </View>
              <View className='flex-row items-center space-x-1'>
                <MapPinIcon color='gray' opacity={0.4} size={22} />
                <Text className='text-xs text-gray-500'>{restaurant.address}</Text>
              </View>
            </View>
            <View className='flex-row items-center space-x-2 px-3 pb-4'>
              <View className='flex-row items-center space-x-1'>
                <Image source={{ uri: '/placeholder.svg?height=20&width=20' }} className='h-4 w-4' />
                <Text className='text-xs text-gray-500'>{restaurant.deliveryTime}</Text>
              </View>
              <View className='flex-row items-center space-x-1'>
                <Image source={{ uri: '/placeholder.svg?height=20&width=20' }} className='h-4 w-4' />
                <Text className='text-xs text-gray-500'>{restaurant.deliveryFee} delivery fee</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
