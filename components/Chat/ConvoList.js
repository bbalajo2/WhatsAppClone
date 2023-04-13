import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ChatList = () => {
  const navigation = useNavigation();
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

  useEffect(() => {
    handleChatList();
  }, []);

  const ChatListItem = ({ chat }) => {
    const handlePress = () => {
      navigation.navigate('ChatDetails', { chatId: chat.chat_id.toString() });
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

  const renderChat = ({ item }) => (
    <ChatListItem chat={item} />
  );

  return (
    <View>
      <FlatList
        data={chatList}
        renderItem={renderChat}
        keyExtractor={item => item.chat_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ChatList;
