import { db, firebase, firebaseApp } from "../firebase";

async function authSaveUser({ email, password, uid, nickname }) {
  await db.collection("google").add({
    email,
    password,
    uid,
    nickname,
    created: firebase.firestore.Timestamp.now().seconds,
  });
}

async function authJoin({ email, password }) {
  const user = await firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password);
  const uid = (firebaseApp.auth().currentUser || {}).uid;
  return uid;
}

async function authLogin({ email, password }) {
  let uid = "";

  await firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(() => {});

  uid = (firebaseApp.auth().currentUser || {}).uid || "";
  return uid;
}

async function authLogout() {
  await firebaseApp.auth().signOut();
}

async function linkToAuthState({ onLogin, onLogout }) {
  firebase.auth().onAuthStateChanged(function (user) {
    console.log("???? - sync");
    if (user) {
      onLogin(user.uid);
    } else onLogout();
  });
}

export { authLogin, authLogout, authJoin, authSaveUser, linkToAuthState };
