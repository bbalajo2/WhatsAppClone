import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UpdateUserInfo } from './UpdateUserInfo';

const GetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
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
        if (response.status === 200) {
          const data = await response.json();
          setUserInfo(data);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setEmail(data.email);
          setPassword(data.password);
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 404) {
          throw new Error('User not found');
        } else {
          throw new Error('Something went wrong. Status code: ' + response.status);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to retrieve user information. Please try again.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdateUserInfo = () => {
    navigation.navigate('UpdateUserInfo', { firstName, lastName, email, password });
  };

  if (!userInfo) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>User Info:</Text>
      <Text style={styles.label}>User ID:</Text>
      <Text>{userInfo.user_id}</Text>
      <View style={styles.contactRow}>
        <Text style={styles.label}>First name:</Text>
        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.label}>Last name:</Text>
        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.contactRow}>
        <Text style={styles.label}>Password:</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} />
      </View>
      <Button title="Edit" onPress={handleUpdateUserInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor:'blue',
  },
  buttonContainer: {
    marginLeft: 10,
  },
});

export default GetUserInfo;
