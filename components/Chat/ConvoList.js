import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatList = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  
  const handleChatList = async () => {
    const token = await AsyncStorage.getItem('session_token');
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        setChatList(responseData);
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

  const renderChat = ({ item }) => (
    <View style={styles.contactRow}>
      <View style={styles.contact}>
        <Text style={styles.name}>{item.chat_id} {item.name}</Text>
        <Text style={styles.email}>{item.creator.name} {item.last_message.content}</Text>
      </View>
    </View>
  );

  useEffect(() => {
    handleChatList();
  }, []);

  const ChatListItem = ({ chat }) => {
    const handlePress = () => {
      navigation.navigate('ChatDetails', { chatId: chat.chat_id });
    };

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.contactRow}>
          <View style={styles.contact}>
            <Text style={styles.name}>{chat.chat_id} {chat.name}</Text>
            <Text style={styles.email}>{chat.creator.name} {chat.last_message.content}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={chatList}
        renderItem={({ item }) => <ChatListItem chat={item} />}
        keyExtractor={item => item.chat_id.toString()}
      />
    </View>
  );
};

export default ChatList;

const styles = {
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  contact: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
};
