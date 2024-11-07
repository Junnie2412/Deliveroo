import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

interface Message {
    userId: string;
    message: string;
    sentAt: any; 
}

const ChatScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]); 
    const [newMessage, setNewMessage] = useState('');
    const [userToken, setUserToken] = useState<string | null>(null); 

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('accessToken'); 
            setUserToken(token); 
        } catch (error) {
            console.error('Error retrieving token from AsyncStorage:', error);
        }
    };

    useEffect(() => {
        getToken(); 

        const unsubscribe = firestore()
            .collection('messages')
            .orderBy('sentAt')
            .onSnapshot(snapshot => {
                const newMessages: Message[] = snapshot.docs.map(doc => doc.data() as Message); // Type the data as Message
                setMessages(newMessages); // Set the messages state with the correct type
            });

        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (userToken) {
            firestore().collection('messages').add({
                userId: userToken,  
                message: newMessage,
                sentAt: firestore.FieldValue.serverTimestamp()
            });
            setNewMessage(''); 
        } else {
            console.error('No user token found');
        }
    };

    return (
        <div>
            <div>
                <h2>Chat</h2>
                <ul>
                    {messages.map((msg, idx) => (
                        <li key={idx}>{msg.message}</li>
                    ))}
                </ul>
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatScreen;
