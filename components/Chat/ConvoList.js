import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = await AsyncStorage.getItem('session_token');
      try {
        const response = await fetch('http://localhost:3333/api/1.0.0/chats', {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setChats(responseData);
        } else if (response.status === 401) {
          console.log('Error', 'Unauthorized');
        } else {
          console.log('Error', 'An unexpected error occurred');
        }
      } catch (error) {
        console.log(error);
        console.log('Error', 'Failed to retrieve chats. Please try again.');
      }
    };
    fetchChats();
  }, []);

  const renderChat = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chat_id.toString()}
        renderItem={renderChat}
      />
    </View>
  );
};

export default ChatList;
