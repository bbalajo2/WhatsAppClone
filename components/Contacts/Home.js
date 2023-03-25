import React, { Component } from 'react';
import { View, Button, Text, FlatList, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogoutPress } from '../Users/logout';
import getUserInfo from '../Users/getUserInfo';
import AddContact from './addContact';
import { getContacts } from './Contacts';
import Search from '../Users/Search';
import { handleDeleteContact } from './Delete';
import { handleBlockUser } from './BlockUser';
import {createConv} from '../Chat/StartConvo';



const Tab = createBottomTabNavigator();

class ContactsScreen extends Component {
  state = {
    contacts: [],
    errorMessage: null,
    searchText: '',
  }

  async componentDidMount() {
    try {
      const contacts = await getContacts();
      this.setState({ contacts });
    } catch (error) {
      console.log(error);
      this.setState({
        errorMessage: 'Failed to retrieve contacts. Please try again.',
      });
    }
  }

  renderItem = ({ item }) => (
    <View style={styles.contactRow}>
      <View style={styles.contact}>
        <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete" onPress={() => handleDeleteContact(item.user_id)} />
        <Button title="Block" onPress={() => handleBlockUser(item.user_id)} />
        <Button title='Start Convo' onPress={() => createConv(item.user_id)}/>
      </View>
    </View>
  );

  handleBlockedUsers = () => {
    this.props.navigation.navigate('BlockedUsers');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contactsContainer}>
          <FlatList
            data={this.state.contacts}
            renderItem={this.renderItem}
          />
        </View>
        <View style={styles.addContactContainer}>
          <AddContact />
        </View>
        <Button title="View Blocked Users" onPress={this.handleBlockedUsers} />
      </View>
    );
  }
}


function SettingsScreen() {
  const handleLogout = () => {
    handleLogoutPress();
  }

  const handleUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      console.log(userInfo);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'right' }}>
      <Search />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Get User Info" onPress={handleUserInfo} />
    </View>
  );
}

class HomeNavigator extends Component {
  render() {
    const { token } = this.props.route.params;

    return (
      <Tab.Navigator>
        <Tab.Screen name="Contacts" component={ContactsScreen} initialParams={{ token }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }
}

export default HomeNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  contact: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: 'blue',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    paddingBottom: 10,
  },
  contact: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: 'blue',
  },
  buttonContainer: {
    marginLeft: 10,
  },
});
