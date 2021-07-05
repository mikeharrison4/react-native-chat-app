import React, { useEffect, useState } from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Image, Input } from 'react-native-elements';
import { auth } from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace('Home');
      }
    });
  }, []);

  const handleSignIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(err => alert(err));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <StatusBar style='light' />
        <Image
          source={require('../assets/signal-logo.png')}
          style={{ width: 200, height: 200, marginBottom: 50 }}
        />
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            autoFocus
            type="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            type="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={handleSignIn}
          />
        </View>
        <Button
          containerStyle={styles.button}
          title='Login'
          onPress={handleSignIn}
        />
        <Button
          containerStyle={styles.button}
          type="outline"
          title='Register'
          onPress={() => navigation.navigate('Register')}
        />
        <View style={{ height: 100 }} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white'
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  }
});