export const UpdateUserInfo = async () => {
    const token = await AsyncStorage.getItem('session_token');
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify({
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
        }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log('User updated successfully');
        navigation.navigate('getUserInfo', { userInfo });
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
  };
  