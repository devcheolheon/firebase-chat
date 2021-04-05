import firebase from "firebase";

console.log(process.env.REACT_FireApiKey);
const firebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FireApiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
});

const db = firebaseApp.firestore();
export { db, firebaseApp, firebase };
