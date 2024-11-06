import React from 'react'
import Navigation from './nagivation/nagivation'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
    </GestureHandlerRootView>
  );
};

export default App
