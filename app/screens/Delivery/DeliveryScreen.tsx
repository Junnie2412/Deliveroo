import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList } from '../types/RootStackParamList.type';

// const restaurants = [
//   {
//     id: 1,
//     name: "Joe's Pizza",
//     image: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2FjoePizza.jpg?alt=media&token=29762181-9dde-4068-b794-fee1957bde0e',
//     rating: 4.5,
//     reviews: 500,
//     category: 'Italian',
//     address: '123 Main St, New York, NY',
//     deliveryTime: '20-30 min',
//     deliveryFee: '$2.99',
//     lat: 40.7128,
//     long: -74.0060,
//   },
//   {
//     id: 2,
//     name: "Mama's Pizzeria",
//     image: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fmamapizza.jfif?alt=media&token=a2c32468-838e-41cd-85a5-c76af3ddf8d6',
//     rating: 4.2,
//     reviews: 350,
//     category: 'Italian',
//     address: '456 Elm St, New York, NY',
//     deliveryTime: '25-35 min',
//     deliveryFee: '$3.99',
//     lat: 40.7138,
//     long: -74.0070,
//   },
//   {
//     id: 3,
//     name: "Luigi's Pizza Palace",
//     image: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2Fluispizza.jfif?alt=media&token=58ecf037-17d2-41f7-a5ea-8c88097fd310',
//     rating: 4.7,
//     reviews: 750,
//     category: 'Italian',
//     address: '789 Oak St, New York, NY',
//     deliveryTime: '15-25 min',
//     deliveryFee: '$1.99',
//     lat: 40.7148,
//     long: -74.0080,
//   }
// ];

interface Store {
  ID: number;
  Store: {
    StoreName: string;
    Address: string;
  };
  Latitude: number;
  Longitude: number;
}

  const DeliveryScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [stores, setStores] = useState<Store[]>([]); 
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchStores = async () => {
        try {
          const response = await fetch('https://deliveroowebapp.azurewebsites.net/api/store-locations');
          const data: Store[] = await response.json(); 
          setStores(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchStores();
    }, []);
  
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-[#00CCBB]">
          <Progress.Circle size={60} indeterminate={true} />
          <Text className="mt-2 text-white">Loading...</Text>
        </View>
      );
    }

    return (
      <View className="bg-[#00CCBB] flex-1">
        <SafeAreaView className="z-50">
          <View className="flex-row justify-between items-center p-5">
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon name="close" color="white" size={30} />
            </TouchableOpacity>
            <Text className="font-light text-white text-lg">Order Help</Text>
          </View>
  
          <View className="bg-white mx-5 my-2 rounded-md p-6 z-50 shadow-md">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg text-gray-400">Estimated Arrival</Text>
                <Text className="text-4xl font-bold">45-55 Minutes</Text>
              </View>
              <Image
                source={{
                  uri: "https://links.papareact.com/fls",
                }}
                className="h-20 w-20"
              />
            </View>
  
            <Progress.Bar width={null} height={10} color="#00CCBB" indeterminate={true} />
            <Text className="mt-3 text-gray-500">Your order is being prepared</Text>
          </View>
        </SafeAreaView>
  
        <MapView
          initialRegion={{
            latitude: stores.length > 0 ? stores[0].Latitude : 40.7128,
            longitude: stores.length > 0 ? stores[0].Longitude : -74.0060,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          className="flex-1 mt-10 z-0"
          mapType="mutedStandard"
        >
          {stores.map((store) => (
            <Marker
              key={store.ID}
              coordinate={{
                latitude: store.Latitude,
                longitude: store.Longitude,
              }}
              title={store.Store.StoreName}
              description={store.Store.Address}
              identifier="origin"
              pinColor="#00CCBB"
            />
          ))}
        </MapView>
  
        <SafeAreaView className="bg-white flex-row items-center space-x-5 h-28">
          <Image
            source={{ uri: "https://links.papareact.com/wru" }}
            className="h-12 w-12 bg-gray-300 p-4 rounded-full ml-5"
          />
          <View className="flex-1">
            <Text className="text-lg">Sonny Sangha</Text>
            <Text className="text-gray-400">Your Rider</Text>
          </View>
          <Text className='text-[#00CCBB] text-lg mr-5 font-bold'>Call</Text>
        </SafeAreaView>
      </View>
    );
  };

export default DeliveryScreen
