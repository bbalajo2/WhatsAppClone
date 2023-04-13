import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const UpdateUserInfo = ({ route }) => {
  const { firstName, lastName, email, password } = route.params;
  const [first_name, setFirstName] = useState(firstName);
  const [last_name, setLastName] = useState(lastName);
  const [email_address, setEmail] = useState(email);
  const [user_password, setPassword] = useState(password);
  console.log(firstName, lastName, email)

  const handleSubmit = async () => {
    console.log(`First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Password: ${password}`);

    if (!PASSWORD_REGEX.test(password)) {
      console.log('Password should contain at least 8 characters, including upper and lowercase letters, numbers, and special characters');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('session_token');
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('User updated successfully');
        navigation.navigate('GetUserInfo', { userInfo: data });
      } else if (response.status === 400) {
        throw new Error('Bad request');
      } else if (response.status === 401) {
        throw new Error('Unauthorized');
      } else if (response.status === 403) {
        throw new Error('Forbidden');
      } else if (response.status === 404) {
        throw new Error('User not found');
      } else {
        throw new Error('Something went wrong. Status code: ' + response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default UpdateUserInfo;
