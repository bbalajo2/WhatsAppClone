import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SendChat({ chatId, handleAddMessage }) {
    const [message, setMessage] = useState('');
  
    const onSubmit = async () => {
      const token = await AsyncStorage.getItem('session_token');
      try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,
          },
          body: JSON.stringify({
            message: message,
          }),
        });
      if (response.status === 200) {
        console.log('Message added successfully');
        handleAddMessage(message);
      } else if (response.status === 400) {
        console.log('Error', 'Bad Request');
      } else if (response.status === 401) {
        console.log('Error', 'Unauthorized');
      } else if (response.status === 403) {
        console.log('Error', 'Forbidden');
      } else if (response.status === 404) {
        console.log('Error', 'Chat not found');
      } else {
        console.log('Error', 'An unexpected error occurred');;
      }
    } catch (error) {
      console.log(error);
      console.log('Error', 'Failed to add message. Please try again.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Type your message here"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <Button title="Send" onPress={onSubmit} />
    </View>
  );
}
