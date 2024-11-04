import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';


const PrepareOrderScreen = () => {
  const navigation = useNavigation()

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate("Delivery")
  //   }, 4000)
  // }, [])

  return (
    <SafeAreaView className="bg-[#00CCBB] flex-1 justify-center items-center">
      <Animatable.Image
        source={require("../../../assets/loadingScreen.gif")}
        animation="slideInUp"
        iterationCount={1}
        className="h-96 w-96"
      />

      <Animatable.Text
        animation="slideInUp"
        iterationCount={1}
        className="text-lg my-10 text-white font-bold text-center"
      >
        Waiting for Restaurant to accept your order!
      </Animatable.Text>

    </SafeAreaView>
  )
}

export default PrepareOrderScreen
