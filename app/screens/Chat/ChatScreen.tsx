import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation

export default function ChatScreen() {
  const [name, setName] = useState(''); // State to store the user's name
  const navigation = useNavigation(); // Hook to navigate to the chat room screen

  // Function to handle entering the chat
  const handleEnterChat = () => {
    if (name.trim()) {
      //navigation.navigate('ChatRoom', { userName: name }); // Navigate to ChatRoom screen with the user's name
    } else {
      alert('Please enter a valid name');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Enter the chat" onPress={handleEnterChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderColor: 'gray',
  },
});
