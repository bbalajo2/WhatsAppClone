import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './components/Users/Login';
import SignUpScreen from './components/Users/signup';
import HomeScreen from './components/Contacts/Home';
import SettingsScreen from './components/Users/Settings';
import ChatScreen from './components/Chat/ChatScreen';
import BlockedUsers from './components/Contacts/viewBlockedUsers';
import ChatList from './components/Chat/ConvoList';
import Search from './components/Users/Search';
import ChatDetails from './components/Chat/ChatDetails';
import AddUserToChat from './components/Chat/AddUserToChat';
import GetUserInfo from './components/Users/getUserInfo';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Contacts" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="ChatList" component={ChatList} />
          <Stack.Screen name="ChatDetails" component={ChatDetails} />
          <Stack.Screen name="AddUserToChat" component={AddUserToChat} />
          <Stack.Screen name="GetUserInfo" component={GetUserInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
