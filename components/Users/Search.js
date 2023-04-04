import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Search(props) {

  const [query, setQuery] = useState('');
  const [searchIn, setSearchIn] = useState('all');
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

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
        console.log(responseJson);
        setResult(responseJson.data);
        setError('');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    handleSearchPress();
  }, [result]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setQuery(text)}
          placeholder="Search then"
          keyboardType="Please work"
        />
        <Button title="Search" onPress={handleSearchPress} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={() => setOffset(offset - limit)} disabled={offset === 0} />
        <Button title="Next" onPress={() => setOffset(offset + limit)} />
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View>
          {result && result.length ? (
            (() => {
              const results = [];
              for (let i = 0; i < result.length; i++) {
                const item = result[i];
                results.push(
                  <View key={item.id} style={styles.resultContainer}>
                    <Text>{item.name}</Text>
                    <AddContact id={item.id} />
                  </View>
                );
              }
              return results;
            })()
          ) : (
            <Text>No results found</Text>
          )}
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  result: {

  },
});

export default Search;
