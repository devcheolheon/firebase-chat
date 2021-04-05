import { db, firebase, firebaseApp } from "../firebase";

async function authSaveUser({ email, password, uid }) {
  await db.collection("google").add({
    email,
    password,
    uid,
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

async function authLogin(email, password) {
  let user = await firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password);

  const uid = (firebaseApp.auth().currentUser || {}).uid;

  return uid;
}

async function authLogout() {
  await firebaseApp.auth().signOut();
}

export { authLogin, authLogout, authJoin, authSaveUser };
