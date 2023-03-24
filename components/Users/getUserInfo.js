import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserInfo = async () => {
  const token = await AsyncStorage.getItem('session_token');
  const userId = await AsyncStorage.getItem('userId');
  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });
    console.log(response)
    if (response.status === 200) {
      const userInfo = await response.json();
      console.log('User info retrieved:', userInfo);
    } else if (response.status === 401) {
      throw new Error('Unauthorized');
    } else if (response.status === 404) {
      throw new Error('User not found');
    } else {
      throw new Error('Something went wrong. Status code: ' + response.status);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to retrieve user information. Please try again.');
  }

  return (
    <View>
      <Text>User Info:</Text>
      <Text>Name: {userInfo.name}</Text>
      <Text>Email: {userInfo.email}</Text>
      <Text>Age: {userInfo.age}</Text>
    </View>
  );
}
export default getUserInfo;
