import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add a new chat',
      headerBackTitle: 'Chats',
    });
  }, [navigation]);

  const handleCreateChat = async () => {
    try {
      await db
        .collection('chats')
        .add({
          chatName: input
        });
      navigation.goBack();
    } catch (err) {
      alert(err);
    }
  };
  
  return (
    <View style={styles.container}>
      <Input 
        placeholder='Enter a chat name'
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={handleCreateChat}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color='black' />
        }
      />
      <Button title="Create new chat" onPress={handleCreateChat} />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 30,
    height: '100%',
  },
});
