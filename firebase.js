import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDdWi7qzraZ7431U1k9nELn9PQDaZbfnPE',
  authDomain: 'signal-chat-app-9e04e.firebaseapp.com',
  projectId: 'signal-chat-app-9e04e',
  storageBucket: 'signal-chat-app-9e04e.appspot.com',
  messagingSenderId: '950913106038',
  appId: '1:950913106038:web:9040e29776ea8898f7df57',
  measurementId: 'G-8B9328HK83'
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };