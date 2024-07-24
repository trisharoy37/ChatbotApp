import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, MessageText } from 'react-native-gifted-chat';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const[typing,setTyping] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Please choose one of the Above topics:',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'LPU Query Bot',
        
        },
        buttons: [
          { text: 'Holidays', value: 'holidays' },
          { text: 'Student Organisation', value: 'organisation' },
          { text: 'RMS', value: 'rms' },
          { text: 'Announcements', value: 'announcement' },
          { text: 'LPU Nest Guidelines', value: 'lpuNest' },
          { text: 'Passing Criteria', value: 'pass' },
          // Add more options as needed
        ],
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    getBotResponse(messages[0].text,selectedTopic);
  }, [selectedTopic]);

  const getBotResponse = async (message,topic) => {
    setTyping(true);

    if(!selectedTopic){
        const botMessage = {
            _id: Math.random().toString(36).substring(7),
            text: "Please Choose one of the topic first!",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'LPU Query Bot',
            
            },
          };

          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, botMessage)
          );
          return;
    }

    try {
      const response = await axios.post('https://chatbotbackend-2.onrender.com/ask', {
        question: message,
        topic: topic,
      });

      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: response.data.response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'LPU Query Bot',
        
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
      );
      setTyping(false);
    } catch (error) {
      console.error('Error fetching bot response:', error.message);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedTopic(option.value);
    const userMessage = {
        _id: Math.random().toString(36).substring(7),
        text: option.text,
        createdAt: new Date(),
        user: {
            _id: 1,
        },
    };
    
    setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, userMessage)
    );
    
    setTyping(true);
    const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: "How can i assist you?",
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'LPU Query Bot',
            
        },
    };
    
    setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
);
    setTyping(false);
  };

  const renderCustomView = (props) => {
    if (props.currentMessage.buttons) {
      return (
        <View style={styles.buttonContainer}>
          {props.currentMessage.buttons.map((button) => (
            <TouchableOpacity
              key={button.value}
              style={styles.button}
              onPress={() => handleOptionSelect(button)}
            >
              <Text style={styles.buttonText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0078fe',
        },
        left: {
          backgroundColor: '#f0f0f0',
        },
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>LPU Query Bot</Text>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        renderCustomView={renderCustomView}
        isTyping={typing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#0078fe',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0078fe',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatScreen;
