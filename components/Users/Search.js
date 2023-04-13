import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';
import { handleAddContactPress } from '../Contacts/AddContact';

function Search() {
  const [query, setQuery] = useState('');
  const [searchIn, setSearchIn] = useState('all');
  const [limit, setLimit] = useState(3);
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    handleSearchPress();
  }, [offset]);

  const handleSearchPress = async () => {
    const token = await AsyncStorage.getItem('session_token');
    const url = `http://localhost:3333/api/1.0.0/search?q=${query}&search_in=${searchIn}&limit=${limit}&offset=${offset}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error('Bad Request');
        } else if (response.status === 401) {
          throw new Error('Unauthorized');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong. Status code: ' + response.status);
        }
      })
      .then((responseJson) => {
        setResult((prevResult) => prevResult.concat(responseJson));
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  const handleSearch = async () => {
    setResult([]);
    setOffset(0);
    handleSearchPress();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Users</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setQuery(text)}
          placeholder="Search users"
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {result.length > 0 ? (
        <View style={styles.container}>
          <ScrollView >
            {result.map((user) => (
              <View style={styles.contact} key={user.user_id} >
                <Text style={styles.details}>{user.first_name} </Text>
                <Text style={styles.details}>{user.last_name}</Text>
                <Text style={styles.details}>{user.email}</Text>
                <Button title="Add Contact" onPress={() => handleAddContactPress(user.user_id)} />
              </View>
            ))}
            <Button style={styles.loadBtn} title="Load More" onPress={handleLoadMore} />
            <Button style={styles.homeBtn} title="Home" onPress={handleHomePress} />
          </ScrollView>
        </View>
      ) : (
        <Text>{error ? error : 'No results found'}</Text>
      )}
    </View>
  );
}


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
  homeBtn: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loadBtn: {
    paddingTop: 5,
  },
  textInput: {
    borderColor: '#9026BA',
    borderWidth: 1,
  },
});

export default Search;
