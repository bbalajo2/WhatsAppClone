import React, { Component } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        Alert.alert('Success', 'Contact added successfully');
      } else if (response.status == 400) {
        const responseBody = await response.text();
        Alert.alert('Error', responseBody);
      } else if (response.status === 401) {
        Alert.alert('Error', 'Unauthorized');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to add contact. Please try again.');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          onChangeText={this.handleUserIdChange}
          value={this.state.userId}
          keyboardType="numeric"
        />
        <Button
          title="Add Contact"
          onPress={this.handleAddContactPress}
        />
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
