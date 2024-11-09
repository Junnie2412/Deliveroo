import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { realTimeDB } from 'app/config/firebase'; 
import { ref, onValue, push } from 'firebase/database';

// Định nghĩa kiểu Message
interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

const ChatScreen2 = () => {
  // Sử dụng kiểu Message cho state messages
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);  // State với kiểu Message[]

  useEffect(() => {
    // Lắng nghe thay đổi trong node 'chat'
    const messagesRef = ref(realTimeDB, 'chat/');
    const onMessageChange = onValue(messagesRef, snapshot => {
      const data = snapshot.val();
      const messagesArray: Message[] = data ? Object.values(data) : [];  // Chuyển đổi thành mảng kiểu Message[]
      setMessages(messagesArray);
    });

    // Cleanup listener khi component unmount
    return () => {
      onMessageChange();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        text: message,
        sender: 'user',  // Hoặc có thể dùng một ID người dùng cụ thể
        timestamp: new Date().toISOString(),
      };

      // Lưu tin nhắn vào Firebase Realtime Database
      const messagesRef = ref(realTimeDB, 'chat/');
      push(messagesRef, newMessage);

      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.message}>
              <Text>{item.sender === 'user' ? 'Bạn: ' : 'Đại diện cửa hàng: '}</Text>
              <Text>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
        />
        <Button title="Gửi" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  message: {
    marginBottom: 10,
  },
});

export default ChatScreen2;
