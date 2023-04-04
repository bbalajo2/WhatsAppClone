import React, { Component } from 'react';
import { View, Button, Text, FlatList, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleLogoutPress } from '../Users/logout';
import GetUserInfo from '../Users/getUserInfo';
import Search from '../Users/Search';
import { getContacts } from './Contacts';
import { handleDeleteContact } from './Delete';
import { handleBlockUser } from './BlockUser';
import CreateConv from '../Chat/StartConvo';
import ChatList from '../Chat/ConvoList';


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
      </View>
    </View>
  );

  handleBlockedUsers = () => {
    this.props.navigation.navigate('BlockedUsers');
  }
  handleAddContact = () => {
    this.props.navigation.navigate('Search');
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
        </View>
        <Button title="Add new contact" onPress={this.handleAddContact}/>
        <Button title="View Blocked Users" onPress={this.handleBlockedUsers}/>
        <CreateConv />
      </View>
    );
  }
}


class SettingsScreen extends Component {
  handleLogout = () => {
    handleLogoutPress();
  }

  handleUserInfo = async () => {
    this.props.navigation.navigate('GetUserInfo');
  }

  handleConvoList = () => {
    this.props.navigation.navigate('ChatList');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'right' }}>
        <Button title="Logout" onPress={this.handleLogout} />
        <Button title="Update User Info" onPress={this.handleUserInfo} />
        <Button title="Get Chat List" onPress={this.handleConvoList}/>
      </View>
    );
  }
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
