// ChatScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { ChatHub } from "./ChatHub";

// Define types for the message
interface Message {
  userId: string;
  message: string;
  sentAt: string;
}

const ChatScreen = () => {
  const [message, setMessage] = useState<string>(""); 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [userId, setUserId] = useState<string>("user1");

  const { sendMessage } = ChatHub({
    onMessageReceived: (userId: string, message: string, sentAt: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId, message, sentAt }
      ]);
    }
  });

  const handleSendMessage = () => {
    sendMessage(userId, message);
    setMessage(""); 
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text>{item.userId}: {item.message}</Text>
            <Text style={styles.timestamp}>{item.sentAt}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
