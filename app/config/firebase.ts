import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import Config from 'react-native-config'

const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASUREMENT_ID
  // apiKey: 'AIzaSyCEhnkolnR141DeAKC-l1JHpFVWgG-PaeY',
  // authDomain: 'deliveroo-dab94.firebaseapp.com',
  // projectId: 'deliveroo-dab94',
  // storageBucket: 'deliveroo-dab94.appspot.com',
  // messagingSenderId: '207678626978',
  // appId: '1:207678626978:web:0e1cd9178b2e350846cbfb',
  // measurementId: Config.FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
export const db = getFirestore(app)
