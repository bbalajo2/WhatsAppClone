import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

class CreateConv extends React.Component {

  handleCreateConv = async (name) => {
    const token = await AsyncStorage.getItem('session_token');

    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          name: name,
        }),
      });

      if (response.status === 201) {
        const responseBody = await response.json();
        console.log('Success', 'Chat created successfully');
        navigation.navigate('ConvoList');
        return responseBody.chat_id;
      } else if (response.status === 400) {
        const responseBody = await response.text();
        console.log('Error', responseBody);
        return null;
      } else if (response.status === 401) {
        console.log('Error', 'Unauthorized');
        return null;
      } else if (response.status === 500) {
        console.log('Error', 'Server error');
        return null;
      } else {
        console.log('Error', 'An unexpected error occurred');
        return null;
      }
    } catch (error) {
      console.log(error);
      console.log('Error', 'Failed to create chat. Please try again.');
      return null;
    }
  }

  render() {
    return (
      <View>
        <TextInput style={styles.input} placeholder="Chat name" onChangeText={(text) => this.setState({ name: text })} />
        <Button title="Create Chat" onPress={() => this.handleCreateConv(this.state.name)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  }
});

export default CreateConv;
