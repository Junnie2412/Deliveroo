import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, SafeAreaView, Image } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { Users } from '../types/User.type'
import { RootStackParamList } from '../types/RootStackParamList.type'

type EditPersonalDetailRouteProp = RouteProp<RootStackParamList, 'EditPersonalDetail'>

export default function EditPersonalDetailScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'EditPersonalDetail'>>()
  const route = useRoute<EditPersonalDetailRouteProp>()
  const { userID } = route.params

  const [user, setUser] = useState<Users | null>(null)
  const [fullName, setFullName] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])

  const getAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      return accessToken
    } catch (error) {
      console.error("Error getting accessToken: ", error)
      return null
    }
  }

  const fetchUser = async () => {
    try {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('Access Token not found!')
      }
      const response = await axios.get<Users>(`https://deliveroowebapp.azurewebsites.net/api/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data)
      setFullName(response.data.fullName)
      setImageURL(response.data.imageUrl || '')
      setEmail(response.data.email)
      setAddress(response.data.address)
      setPhoneNumber(response.data.phoneNumber)
    } catch (error) {
      console.error('Error fetching User:', error)
      Alert.alert('Error', 'Could not fetch User data.')
    }
  }

  const handleSave = async () => {
    try {
      const token = await getAccessToken()
      if (!token) {
        throw new Error('Access Token not found!')
      }
      await axios.put(
        `https://deliveroowebapp.azurewebsites.net/api/users/${userID}`,
        {
          fullName,
          imageURL,
          email,
          phoneNumber,
          address,
          isActive: true // Always set to true as per requirement
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      Alert.alert('Success', 'User information updated successfully.')
      navigation.pop();
  
    } catch (error) {
      console.error('Error updating User:', error)
      Alert.alert('Error', 'Could not update User information.')
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: imageURL || 'https://i.pinimg.com/736x/38/46/3b/38463b9033688c20e036f185de9452d2.jpg' }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
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
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333333',
  },
})