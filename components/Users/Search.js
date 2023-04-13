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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setQuery(text)}
          placeholder="Search"
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      {result.length > 0 ? (
        <ScrollView>
          {result.map((user) => (
            <View key={user.user_id}>
              <Text>{user.first_name} {user.last_name}</Text>
              <Text>{user.email}</Text>
              <Button title="Add Contact" onPress={() => handleAddContactPress(user.user_id)} />
            </View>
          ))}
          <Button title="Load More" onPress={handleLoadMore} />
          <Button title="Home" onPress={handleHomePress} />
        </ScrollView>
      ) : (
        <Text>{error ? error : 'No results found'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
});

export default Search;
