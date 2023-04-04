import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, StyleSheet } from 'react-native';
import { getContacts } from "../Contacts/Contacts";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUserToChat = ({ chatId }) => {
    console.log('chatId:', chatId)
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      const contacts = await getContacts();
      setContacts(contacts);
    }
    fetchContacts();
  }, []);

  const handleAddToChat = async (userId) => {
    const token = await AsyncStorage.getItem('session_token');
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
      if (response.status === 200) {
        console.log('User added successfully');
      } else if (response.status === 400) {
        console.log('Error', 'Bad Request');
      } else if (response.status === 401) {
        console.log('Error', 'Unauthorized');
      } else if (response.status === 403) {
        console.log('Error', 'Forbidden');
      } else if (response.status === 404) {
        console.log('Error', 'Not Found');
      } else {
        console.log('Error', 'An unexpected error occurred');
      }
    } catch (error) {
      console.log(error);
      console.log('Error', 'Failed to add user to chat. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.contactRow}>
      <View style={styles.contact}>
        <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Add to Chat" onPress={() => handleAddToChat(item.user_id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  contact: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
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
  buttonContainer: {
    marginLeft: 10,
  },
});

export default AddUserToChat;
