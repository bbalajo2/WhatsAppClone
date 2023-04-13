import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const UpdateUserInfo = ({ route }) => {
  const { firstName, lastName, email } = route.params;
  const [first_name, setFirstName] = useState(firstName);
  const [last_name, setLastName] = useState(lastName);
  const [email_address, setEmail] = useState(email);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const handleUpdateUserInfo = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const token = await AsyncStorage.getItem('session_token');
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email: email_address,
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        Navigator.navigation.goBack()
        console.log('User updated successfully');
      } else if (response.status === 400) {
        throw new Error('Bad request');
      } else if (response.status === 401) {
        throw new Error('Unauthorized');
      } else if (response.status === 403) {
        throw new Error('Forbidden');
      } else if (response.status === 404) {
        throw new Error('User not found');
      } else {
        throw new Error('Something went wrong. Status code: ' + response.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <View style={styles.contact}>
        <View style={styles.details}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.details}
            value={first_name}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
          />
          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.details}
            value={last_name}
            onChangeText={setLastName}
            placeholder="Enter your last name"
          />
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.details}
            value={email_address}
            onChangeText={setEmail}
            placeholder="Enter your email address"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Update" onPress={handleUpdateUserInfo}/>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
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

export default UpdateUserInfo;
