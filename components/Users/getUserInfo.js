import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { UpdateUserInfo } from './UpdateUserInfo';

const GetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
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
    };

    fetchUserInfo();
  }, []);

  const handleUpdateUserInfo = () => {
    navigation.navigate('UpdateUserInfo', { firstName, lastName, email});
  };

  if (!userInfo) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
    
  }
  
  return (
    <View>
    <View style={styles.container}>
      <View style={styles.contact}>
        <Text style={styles.details}>Firstname:</Text>
        <Text style={styles.details}>{firstName}</Text>
      </View>
      <View style={styles.contact}>
        <Text style={styles.details}>Surname:</Text>
        <Text style={styles.details}>{lastName}</Text>
      </View>
      <View style={styles.contact}>
        <Text style={styles.details}>Email:</Text>
        <Text style={styles.details}>{email}</Text>
      </View>
      <Button title="Edit" onPress={handleUpdateUserInfo} />
    </View>
  </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F4FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    color: '#9026BA',
    fontSize: 42,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  contact: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 4,
    backgroundColor: '#9026BA',
    padding: 10,
    width: 300,
  },
  details: {
    
    fontSize: 18,
    color: '#F9F4FB',
    width: '100 ',
    padding: 3,
  },
  buttonContainer: {
    marginLeft: 10,
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default GetUserInfo;
