import React, { Component } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';;

class AddContact extends Component {
  state = {
    userId: '',
  }

  handleUserIdChange = (userId) => {
    this.setState({ userId });
  }

  handleAddContactPress = async () => {
    const token = await AsyncStorage.getItem('session_token');

    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${this.state.userId}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({}),
      });

      if (response.statue == 200) {
        console.log('Success', 'Contact added successfully');
      } else if (response.status == 400) {
        const responseBody = await response.text();
        console.log('Error', responseBody);
      } else if (response.status === 401) {
        console.log('Error', 'Unauthorized');
      } else {
        console.log('Error', 'An unexpected error occurred');
      }
    } catch (error) {
      console.log(error);
      console.log('Error', 'Failed to add contact. Please try again.');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input} placeholder="User ID"
          onChangeText={this.handleUserIdChange} value={this.state.userId} keyboardType="numeric" />
        <Button title="Add Contact" onPress={this.handleAddContactPress} />
        <Search/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
});

export default AddContact;
