import AsyncStorage from '@react-native-async-storage/async-storage';

export const getContacts = async () => {
  const token = await AsyncStorage.getItem('session_token');
  try {
    const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });

    if (response.status === 200) {
      const responseJson = await response.json();
      console.log('Contacts retrieved:', responseJson);
      return responseJson;
    } else if (response.status === 400) {
      throw new Error('Unauthorized');
    } else {
      throw new Error('Something went wrong. Status code: ' + response.status);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to retrieve contacts. Please try again.');
  }
};
