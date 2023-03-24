import AsyncStorage from '@react-native-async-storage/async-storage';

export function handleLogoutPress() {
    AsyncStorage.removeItem('session_token')
        .then(() => {
            console.log('User has logged out');
            navigation.navigate('Login');
        })
        .catch((error) => {
            console.log(error);
            this.setState({ errorMessage: 'Logout failed. Please try again.' });
        });
}