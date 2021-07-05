import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomListItem from '../components/CustomListItem';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { auth, db } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    return db
      .collection('chats')
      .onSnapshot(snapshot => (
        setChats(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      ));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: { backgroundColor: 'white' },
      headerTitleStyle: { color: 'black' },
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={.5} onPress={handleSignOut}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 80,
          marginRight: 20
        }}>
          <TouchableOpacity activeOpacity={.5}>
            <AntDesign name='camerao' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={.5}
            onPress={() => navigation.navigate('AddChat')}
          >
            <SimpleLineIcons name='pencil' size={24} color='black' />
          </TouchableOpacity>
        </View>
      )
    });
  }, [navigation]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => navigation.replace('Login'));
  };

  const handleEnterChat = (id, chatName) => {
    navigation.navigate('Chat', {
      id,
      chatName
    });
  };

  console.log(auth.currentUser);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        { chats && chats.map(({ id, data: { chatName } }) => (
          <CustomListItem key={id} id={id} chatName={chatName} enterChat={handleEnterChat}  />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
