import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { handleUnblockUser } from './UnblockUser';

const Stack = createNativeStackNavigator();

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
      if (response.status === 200) {
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
  
  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.contactRow}>
        <View style={styles.contact}>
          <Text style={styles.name}>Blocked Users:</Text>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((item) => (
              <View key={item.user_id}>
                <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.buttonContainer}>
                  <Button title="Unblock" onPress={() => handleUnblockUser(item.user_id)} />
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.message}>No blocked users found</Text>
          )}
        </View>
      </View>
      </ScrollView>
      <Button title="Home" onPress={handleHomePress} />
    </View>
  );
}

export default BlockedUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  contact: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  email: {
    color: 'blue',
    borderBottomColor: 'red',
  },
  buttonContainer: {
    marginLeft: 10,
  },
  message: {
    fontSize: 16,
  },
});
