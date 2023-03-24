import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    getBlockedUsers();
  }, []);

  const getBlockedUsers = async () => {
    const token = await AsyncStorage.getItem('session_token');
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/blocked`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBlockedUsers(data);
      } else {
        console.log('Error', 'Failed to fetch blocked users');
      }
    } catch (error) {
      console.log(error);
      console.log('Error', 'Failed to fetch blocked users. Please try again.');
    }
  };

  const handleGetBlockedUsers = () => {
    console.log(blockedUsers);
  };

  return (
    <View>
      <Text>Blocked Users:</Text>
      {blockedUsers.map((user) => (
        <Text key={user.user_id}>{user.first_name} {user.last_name}</Text>
      ))}
      <Button title="Get Blocked Users" onPress={handleGetBlockedUsers} />
    </View>
  );
};

export default BlockedUsers;
