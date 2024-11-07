import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text, Switch, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { RootStackParamList } from '../types/RootStackParamList.type'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Users } from '../types/User.type'


interface SettingItemProps {
  icon: string
  title: string
  subtitle?: string
  value?: boolean
  onPress: () => void
  hasToggle?: boolean
}

type SettingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PersonalDetail'>
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, value, onPress, hasToggle = false }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingItem}>
      <View style={styles.itemContent}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={24} color='#00CCBC' />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {hasToggle ? (
        <Switch value={value} onValueChange={onPress} trackColor={{ false: '#E2E8F0', true: '#00CCBC' }} />
      ) : (
        <Icon name='chevron-forward' size={20} color='#CBD5E0' />
      )}
    </TouchableOpacity>
  )
}

const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return <Text style={styles.sectionTitle}>{title}</Text>
}

const SettingScreen: React.FC <SettingScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true)
  const [locationServices, setLocationServices] = useState(true)
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <SectionTitle title='Account' />
          <View style={styles.card}>
            <SettingItem
              icon='person-outline'
              title='Personal Details'
              subtitle='Manage your personal information'
              onPress={() => {
                navigation.navigate('PersonalDetail'); 
              }}
            />
            <SettingItem
              icon='card-outline'
              title='Payment Methods'
              subtitle='Add or remove payment options'
              onPress={() => {}}
            />
            <SettingItem
              icon='location-outline'
              title='Addresses'
              subtitle='Manage your delivery addresses'
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title='Preferences' />
          <View style={styles.card}>
            <SettingItem
              icon='notifications-outline'
              title='Push Notifications'
              subtitle='Stay updated with latest offers'
              value={notifications}
              onPress={() => setNotifications(!notifications)}
              hasToggle
            />
            <SettingItem
              icon='navigate-outline'
              title='Location Services'
              subtitle='Improve app experience with location'
              value={locationServices}
              onPress={() => setLocationServices(!locationServices)}
              hasToggle
            />
            <SettingItem
              icon='earth-outline'
              title='Language'
              subtitle='Choose your preferred language'
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle title='Support' />
          <View style={styles.card}>
            <SettingItem
              icon='help-circle-outline'
              title='Help Center'
              subtitle='Find answers to your questions'
              onPress={() => {}}
            />
            <SettingItem
              icon='chatbubble-outline'
              title='Contact Us'
              subtitle='Get in touch with our support team'
              onPress={() => {}}
            />
            <SettingItem
              icon='document-text-outline'
              title='Terms of Service'
              subtitle='Read our terms and conditions'
              onPress={() => {}}
            />
            <SettingItem
              icon='shield-outline'
              title='Privacy Policy'
              subtitle='Learn how we protect your data'
              onPress={() => {}}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
  scrollContainer: {
    paddingHorizontal: 16
  },
  section: {
    paddingVertical: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 1
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    backgroundColor: '#E0F7FA',
    borderRadius: 50,
    padding: 10,
    marginRight: 12,
    elevation: 2
  },
  textContainer: {
    flex: 1
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#00CCBC',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default SettingScreen
