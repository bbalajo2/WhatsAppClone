import React, { Component } from 'react';
import { View, TextInput, Text, Button } from 'react-native';

const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    };
  }

  handleFirstnameChange = (text) => {
    this.setState({ first_name: text });
  };

  handleSurnameChange = (text) => {
    this.setState({ last_name: text });
  };

  handlesetEmailChange = (text) => {
    this.setState({ email: text });
  };

  handlePasswordChange = (text) => {
    this.setState({ password: text });
  };

  handleSubmit = (event) => {
    const { first_name, last_name, email, password } = this.state;
    console.log(`Firstname: ${first_name}, Surname: ${last_name}, Email: ${email}, Password: ${password}`);

    if (!PASSWORD_REGEX.test(password)) {
      alert("secure password required");
      return;
    }
    return fetch("http://localhost:3333/api/1.0.0/user", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json()
        }
        else if (response.status === 400) {
          throw 'Failed validation';
        }
        else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        console.log("User created ID:", responseJson);
        this.props.navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleLoginPress = () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    const { first_name, last_name, email, password } = this.state;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 52, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, paddingBottom: 30 }}>Sign Up</Text>

        <Text>Firstname:</Text>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          type="text" value={first_name} onChangeText={this.handleFirstnameChange} />

        <Text>Surname:</Text>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          type="text" value={last_name} onChangeText={this.handleSurnameChange} />

        <Text>Email:</Text>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          type="text" value={email} onChangeText={this.handlesetEmailChange} />

        <Text>Password:</Text>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          type="password" value={password} onChangeText={this.handlePasswordChange} />

        <Button title="Signup" onPress={this.handleSubmit} />

        <Button title="Login" onPress={this.handleLoginPress} />
      </View>
    );
  }
}

export default SignUpForm;