import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SendChat from './SendChat';
import AddUserToChat from './AddUserToChat';

const ChatDetails = ({ navigation, route }) => {
    const { chatId } = route.params;
    const [chatDetails, setChatDetails] = useState(null);
    const [messages, setMessages] = useState([]);

    const handleChatDetails = async () => {
        const token = await AsyncStorage.getItem('session_token');
        try {
            const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token,
                },
            });
            if (response.status === 200) {
                const responseData = await response.json();
                console.log(responseData);
                setChatDetails(responseData);
                setMessages(responseData.messages);
            } else if (response.status === 401) {
                console.log('Error', 'Unauthorized');
            } else {
                console.log('Error', 'An unexpected error occurred');
            }
        } catch (error) {
            console.log(error);
            console.log('Error', 'Failed to retrieve chat details. Please try again.');
        }
    };

    useEffect(() => {
        handleChatDetails();
    }, []);

    if (!chatDetails) {
        return <Text>Loading...</Text>;
    }

    const { name, creator, last_message } = chatDetails;

    const renderChat = ({ item }) => (
        <View style={styles.contactRow}>
            <View style={styles.contact}>
                <Text style={styles.name}>{item.chat_id} {item.name}</Text>
                <Text style={styles.email}>{item.creator.name}</Text>
                {item.last_message && (
                    <Text style={styles.message}>{item.last_message.content}</Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{name}</Text>
                <View style={styles.creatorInfo}>
                    <Text style={styles.creatorName}>{creator.name}</Text>
                    <Text style={styles.creatorEmail}>{creator.email}</Text>
                    <Text style={styles.message}>{creator.name} {last_message ? last_message.content : ""}</Text>
                </View>
            </View>

            {messages.length > 0 ? (
                <View style={styles.messageList}>
                    {messages.map((message, index) => (
                        <View key={index} style={[styles.messageContainer, message.author.id === creator.id && styles.myMessageContainer]}>
                            <Text style={[styles.message, message.author.id === creator.id && styles.myMessage]}>{message.message}</Text>
                        </View>
                    ))}
                </View>
            ) : (
                <Text>No messages yet</Text>
            )}

            <SendChat chatId={chatId} handleAddMessage={(message) => console.log(message)} />
            
            <AddUserToChat chatId={chatId}/>
        </View>
    );
};

export default ChatDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatInfo: {
        paddingHorizontal: 20,
    },
    chatName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    creatorInfo: {
        marginBottom: 20,
    },
    creatorName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    creatorEmail: {
        fontSize: 16,
        color: '#666',
    },
    lastMessage: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 10,
    },
    messageContent: {
        fontSize: 16,
        marginBottom: 10,
    },
    messageAuthor: {
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        paddingTop: 10,
    },
    authorName
        : {
        fontSize: 16,
        fontWeight: 'bold',
    },
    authorEmail: {
        fontSize: 14,
        color: '#666',
    },
});
