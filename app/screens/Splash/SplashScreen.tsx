// app/screens/SplashScreen.tsx

import React, { useEffect } from 'react'
import { View, StyleSheet, Image, StatusBar } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '~/types/RootStackParamList.type'

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/deliveroo-dab94.appspot.com/o/Splash%2FSplashApp.png?alt=media&token=f7aa037d-6703-4460-b6d9-266a9112f836'
        }}
        style={styles.image}
        resizeMode='cover'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight ? -StatusBar.currentHeight : 0,
    backgroundColor: '#000'
  },
  image: {
    width: '100%',
    height: '100%'
  }
})

export default SplashScreen
