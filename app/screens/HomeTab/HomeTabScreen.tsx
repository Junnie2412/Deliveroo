import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MagnifyingGlassIcon, AdjustmentsVerticalIcon } from 'react-native-heroicons/outline'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import axios from 'axios'
import { RootStackParamList } from '../types/RootStackParamList.type'
import { Categories } from '../types/Categories.type'

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CategoriesDetail'>
}

const featuredCollections = [
  { id: 1, title: 'Offers near you!', description: 'Why not support your local restaurant tonight!' },
  { id: 2, title: 'Best Rated', description: 'Top-rated restaurants in your area' }
]

const restaurants = [
  {
    id: 1,
    name: "Nando's",
    image:
      'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fnando.jpg?alt=media&token=aa4410f4-081a-4ef8-acd9-8814008d644d',
    rating: 4.5,
    category: 'Chicken'
  },
  {
    id: 2,
    name: 'Pizza Hut',
    image:
      'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fpizzahut.png?alt=media&token=05e0a041-3bd2-4cb5-afbc-1398ba5b0c40',
    rating: 4.0,
    category: 'Pizza'
  },
  {
    id: 3,
    name: 'Burger King',
    image:
      'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fburderking.jpg?alt=media&token=3bb16a13-9a3d-432a-9c78-daf15af0443a',
    rating: 3.8,
    category: 'Burgers'
  }
]

const HomeTabScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [categories, setCategories] = useState<Categories[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchNavigation = () => {
    navigation.navigate('SearchResult', { searchQuery })
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://deliveroowebapp.azurewebsites.net/api/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1'>
        <View className='flex-row items-center space-x-2 px-4 pb-2'>
          <View className='flex-1'>
            <Image
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2FDeliveroo-Logo.png?alt=media&token=8d6f8e71-65b3-4dec-aa48-bc08823bcb42'
              }}
              className='h-20 w-36 rounded-full'
            />
            <Text className='font-bold text-gray-400 text-xs'>Deliver Now!</Text>
            <Text className='font-bold text-xl'>Current Location</Text>
          </View>
          <TouchableOpacity>
            <Image
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Flocation.png?alt=media&token=e617b26b-a9ed-421e-a6dc-4674b59c8360'
              }}
              className='h-10 w-10 rounded-full'
            />
          </TouchableOpacity>
        </View>

        <View className='flex-row items-center space-x-2 pb-2 px-4'>
          <View className='flex-row flex-1 space-x-2 bg-gray-200 p-3 rounded-full'>
            <MagnifyingGlassIcon color='gray' size={20} />
            <TextInput
              placeholder='Restaurants and cuisines'
              keyboardType='default'
              className='flex-1'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={handleSearchNavigation}>
            <AdjustmentsVerticalIcon color='#00CCBB' size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingTop: 10
          }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className='relative mr-2'
              onPress={() => navigation.navigate('CategoriesDetail', { categoryID: category.id })}
            >
              <Image source={{ uri: category.imageUrl }} className='h-20 w-20 rounded' />
              <Text className='absolute bottom-1 left-1 text-white font-bold'>{category.categoryName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {featuredCollections.map((collection) => (
          <View key={collection.id} className='mt-4'>
            <View className='flex-row items-center justify-between px-4'>
              <Text className='font-bold text-lg'>{collection.title}</Text>
              <TouchableOpacity>
                <Text className='text-sm text-gray-500'>See All</Text>
              </TouchableOpacity>
            </View>
            <Text className='text-xs text-gray-500 px-4'>{collection.description}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingTop: 10
              }}
            >
              {restaurants.map((restaurant) => (
                <TouchableOpacity key={restaurant.id} className='mr-4 bg-white rounded-lg shadow'>
                  <Image source={{ uri: restaurant.image }} className='h-36 w-64 rounded-t-lg' />
                  <View className='px-3 pb-4 space-y-2'>
                    <Text className='text-lg font-bold pt-2'>{restaurant.name}</Text>
                    <View className='flex-row items-center space-x-1'>
                      <Image source={{ uri: '/placeholder.svg?height=20&width=20' }} className='h-4 w-4' />
                      <Text className='text-xs text-gray-500'>
                        <Text className='text-green-500'>{restaurant.rating}</Text> · {restaurant.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeTabScreen
