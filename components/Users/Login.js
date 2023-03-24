import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleUsernameChange = (text) => {
    this.setState({ email: text });
  }

  handlePasswordChange = (text) => {
    this.setState({ password: text });
  }


  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.email === '' || this.state.password === '') {
      this.setState({ errorMessage: 'Please enter a email and password.' });
    } else {
      return fetch("http://localhost:3333/api/1.0.0/login", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.state.email, password: this.state.password })
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            throw new Error('Failed validation');
          } else {
            throw new Error('Something went wrong. Status code: ' + response.status);
          }
        })
        .then(async (responseJson) => {
          console.log("Login successful. User ID:", responseJson);
          await AsyncStorage.setItem('session_token', responseJson.token)
          await AsyncStorage.setItem('userId', responseJson.id)
            .then(() => {
              console.log('session ID stored:', responseJson.token);
              console.log('ID stored:', responseJson.id);
              this.props.navigation.navigate('Home', { token: "get here"});

            })
        })
        .catch((error) => {
          console.log(error);
          this.setState({ errorMessage: 'Login failed. Please try again.' });
        });
    }
  }

  handleSignupPress = () => {
    this.props.navigation.navigate('Signup');
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 52, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, paddingBottom: 30 }}>Login</Text>

        <Text>Username:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          onChangeText={this.handleUsernameChange}
          value={this.state.email}
        />
        <Text>Password:</Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          onChangeText={this.handlePasswordChange}
          value={this.state.password}
          secureTextEntry={true}
        />
        {this.state.errorMessage !== '' && (
          <Text style={{ color: 'red', marginBottom: 10 }}>{this.state.errorMessage}</Text>
        )}
        <Button title="Login" onPress={this.handleSubmit} style={{ marginBottom: 10 }} />
        <Button title="Signup" onPress={this.handleSignupPress} />
      </View>
    );
  }
}

export default LoginScreen;