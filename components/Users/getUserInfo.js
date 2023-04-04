import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import UpdateUserInfo from '../Users/UpdateUserInfo';

const GetUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
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

  if (!userInfo) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
    
  }
  
  const handleUpdateUserInfo = () => {
    navigation.navigate('UpdateUserInfo');
  };

  return (
    <View>
      <View style={styles.container}>
        <Text>User Info:</Text>
        <Text style={styles.name}>User ID: {userInfo.user_id}</Text>
        <View style={styles.contact}>
          <Text style={styles.label}>Firstname:</Text>
          <TextInput
            style={styles.input}
            value={userInfo.first_name}
            onChangeText={(text) => setUserInfo({ ...userInfo, first_name: text })}
          />
        </View>
        <View style={styles.contact}>
          <Text style={styles.label}>Surname:</Text>
          <TextInput
            style={styles.input}
            value={userInfo.last_name}
            onChangeText={(text) => setUserInfo({ ...userInfo, last_name: text })}
          />
        </View>
        <View style={styles.contact}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={userInfo.email}
            onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
          />
        </View>
      </View>
      <Button title="Update" onPress={handleUpdateUserInfo} />
    </View>
  );
};

export default GetUserInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  contact: {
    justifyContent: 'Right',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingBottom: 30,
  },
  label: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 30,
    color: 'blue',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingBottom: 10,
  },
  contact: {
    flex: 1,
  },
  name: {

    fontSize: 30,
    fontWeight: 'bold',
  },
  email: {
    color: 'blue',
  },
  buttonContainer: {
    marginLeft: 10,
  },
});
