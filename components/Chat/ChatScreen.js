import React, { Component } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text>Chat Screen</Text>
    </View>
  );
}

function ChatListScreen(props) {
  const handleChatPress = (convoId) => {
    props.navigation.navigate('Chat', { convoId });
  };

  return (
    <View style={styles.container}>
      <Text>Chat List Screen</Text>
      <Button title="Chat with John" onPress={() => handleChatPress('1234')} />
    </View>
  );
}

class ChatNavigator extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    );
  }
}

export default ChatNavigator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bio: {
    fontSize: 14,
    color: '#666',
  },
});
