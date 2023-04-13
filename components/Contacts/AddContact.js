import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleAddContactPress = async (userId) => {
  const token = await AsyncStorage.getItem('session_token');

  try {
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({}),
    });

    if (response.statue == 200) {
      console.log('Success', 'Contact added successfully');
    } else if (response.status == 400) {
      const responseBody = await response.text();
      console.log('Error', responseBody);
    } else if (response.status === 401) {
      console.log('Error', 'Unauthorized');
    } else {
      console.log('Error', 'An unexpected error occurred');
      
    }
  } catch (error) {
    console.log(error);
    console.log('Error', 'Failed to add contact. Please try again.');
  }
};
