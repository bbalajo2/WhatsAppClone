import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleUnblockUser = async (id) => {
    const token = await AsyncStorage.getItem('session_token');
    try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/block`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token,
            },
        });

        if (response.status === 200) {
            console.log('Success', 'User unblocked successfully');
            navigation.navigate('Home');
        } else if (response.status === 400) {
            const responseBody = await response.text();
            console.log('Error', responseBody);
        } else if (response.status === 401) {
            console.log('Error', 'Unauthorized');
        } else if (response.status === 404) {
            console.log('Error', 'User not found');
        } else if (response.status === 500) {
            console.log('Error', 'Server error');
        } else {
            console.log('Error', 'An unexpected error occurred');
        }
    } catch (error) {
        console.log(error);
        console.log('Error', 'Failed to block user. Please try again.');
    }
}