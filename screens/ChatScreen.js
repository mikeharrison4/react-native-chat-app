import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, TouchableWithoutFeedback,
  View
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebase';
import firebase from 'firebase';

const ChatScreen = ({ navigation, route: { params } }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Avatar
            rounded
            source={require('../assets/placeholder-photo.jpeg')}
          />
          <Text
            style={{
              color: 'white',
              marginLeft: 10,
              fontWeight: '700'
            }}
          >
            {params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: 'row',
          width: 70,
          justifyContent: 'space-between',
          marginRight: 10,
        }}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation]);

  useLayoutEffect(() => {
    return db
      .collection('chats')
      .doc(params.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot => {
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        );
      }));
  }, []);
  
  const handleSendMessage = () => {
    Keyboard.dismiss();
    db
      .collection('chats')
      .doc(params.id)
      .collection('messages')
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      });

    setInput('');
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: 'white',
    }}>
      <StatusBar style='light' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <ScrollView
              contentContainerStyle={{ paddingTop: 15, paddingHorizontal: 5 }}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                keyboardVerticalOffset={30}
                behavior={'position'}
              >
                <View>
                  { messages && messages.map(({ id, data }) => (
                    data.email === auth.currentUser.email ? (
                      <View key={id} style={styles.sender}>
                        <Avatar
                          rounded
                          containerStyle={{
                            position: 'absolute',
                            bottom: -15,
                            right: -15,
                          }}
                          position='absolute'
                          bottom={-15}
                          right={-15}
                          source={{ uri: data.photoURL }}
                        />
                        <Text style={styles.senderText}>{data.message}</Text>
                      </View>
                    ) : (
                      <View key={id} style={styles.receiver}>
                        <Avatar
                          rounded
                          containerStyle={{
                            position: 'absolute',
                            bottom: -15,
                            left: -15,
                          }}
                          position='absolute'
                          bottom={-15}
                          left={-15}
                          source={{ uri: data.photoURL }}
                        />
                        <Text style={styles.receiverText}>{data.message}</Text>
                        <Text style={styles.receiverName}>{data.displayName}</Text>
                      </View>
                    )
                  )) }
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder='Signal Message'
                style={styles.textInput}
                value={input}
                onSubmitEditing={handleSendMessage}
                onChangeText={(text) => setInput(text)}
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: '#ECECEC',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
  receiver: {
    padding: 20,
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 15,
    maxWidth: '80%',
    position: 'relative'
  },
  receiverText: {
    fontWeight: '500',
  },
  receiverName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    marginTop: 15,
  },
  sender: {
    padding: 20,
    alignSelf: 'flex-end',
    backgroundColor: '#2B68E6',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 15,
    maxWidth: '80%',
    position: 'relative'
  },
  senderText: {
    color: 'white'
  }
});