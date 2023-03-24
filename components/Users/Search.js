import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Search() {
  const [query, setQuery] = useState('');
  const [searchIn, setSearchIn] = useState('all');
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState('');

  const handleSearchPress = async () => {
    const token = await AsyncStorage.getItem('session_token');
    const url = `http://localhost:3333/api/1.0.0/search?q=${query}&search_in=${searchIn}&limit=${limit}&offset=${offset}`;
    fetch(url, {
      method: 'get',
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
        setResult(JSON.stringify(responseJson));
      })
      .catch((error) => {
        setResult(error.message);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'top', alignItems: 'right' }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10 }}
        onChangeText={(text) => setQuery(text)}
        placeholder="Search then"
        keyboardType="Please work"
      />
      <Button title="Search" onPress={handleSearchPress} />
      <Text>{result}</Text>
    </View>
  );
}

export default Search;
