import React, { useState, useEffect } from 'react'
import {View,Text,Image,StyleSheet,TouchableOpacity,ScrollView,ActivityIndicator,Alert,SafeAreaView,Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { Users } from '../types/User.type'
import { RootStackParamList } from '../types/RootStackParamList.type'


const { width } = Dimensions.get('window')
export default function PersonalDetailScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'PersonalDetail'>>()
  const [user, setUser] = useState<Users | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      return accessToken
    } catch (error) {
      console.error("Error getting accessToken: ", error)
      return null
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAccessToken()
        if (!token) {
          throw new Error('Access Token not found!')
        }
        const response = await axios.get<Users>('https://deliveroowebapp.azurewebsites.net/api/users/current', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching User:', error)
        Alert.alert('Error', 'Could not fetch User.')
      } finally {
        setLoading(false)
      }
    }
  
    fetchUser()
  
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUser()
    })
 
    return unsubscribe
  }, [navigation])
  

  const handleBack = () => {
    navigation.goBack()
  }

  const handleEdit = () => {
    if (user) {
      navigation.navigate('EditPersonalDetail', { userID: user.id })
    } else {
      Alert.alert('Error', 'User data is not available.')
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.pinimg.com/736x/38/46/3b/38463b9033688c20e036f185de9452d2.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.fullName}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.userName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoText}>{user.phoneNumber}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoText}>{user.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  backButton: {
    padding: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666666',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
  },
})