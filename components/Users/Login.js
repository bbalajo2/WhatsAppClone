import React, { Component } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  handleUsernameChange = (text) => {
    this.setState({ email: text });
  };

  handlePasswordChange = (text) => {
    this.setState({ password: text });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.state.email === '' || this.state.password === '') {
      this.setState({ errorMessage: 'Please enter a email and password.' });
    } else {
      try {
        const response = await fetch('http://localhost:3333/api/1.0.0/login', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.state.email, password: this.state.password }),
        });

        if (response.status === 200) {
          const responseJson = await response.json();
          console.log('Login successful. User ID:', responseJson);

          // Set session token and user ID in AsyncStorage with an expiration time of 1 hour
          const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now
          await AsyncStorage.setItem('session_token', responseJson.token);
          await AsyncStorage.setItem('userId', responseJson.id);
          await AsyncStorage.setItem('session_expiration', expirationTime.toString());

          this.props.navigation.navigate('Home', { token: 'get here' });
        } else if (response.status === 400) {
          throw new Error('Failed validation');
        } else {
          throw new Error('Something went wrong. Status code: ' + response.status);
        }
      } catch (error) {
        console.log(error);
        this.setState({ errorMessage: 'Login failed. Please try again.' });
      }
    }
  };

  handleSignupPress = () => {
    this.props.navigation.navigate('Signup');
  };

  componentDidMount = async () => {
    const sessionToken = await AsyncStorage.getItem('session_token');
    const sessionExpiration = await AsyncStorage.getItem('session_expiration');

    if (sessionToken && sessionExpiration) {
      const expirationTime = parseInt(sessionExpiration, 10);
      if (new Date().getTime() < expirationTime) {
        this.props.navigation.navigate('Home', { token: 'get here' });
      }
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{
          fontSize: 52
          , fontWeight: 'bold', textAlign: 'center', marginBottom: 16, paddingBottom: 30
        }}>Login</Text>

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