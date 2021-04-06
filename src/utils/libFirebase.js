import { db, firebase, firebaseApp } from "../firebase";
import ChatRooms from "../pages/ChatRooms";

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

export async function createRoom(name) {
  name = name.trim();

  let chatRoomSnapshot = await db
    .collection("chatRooms")
    .where("name", "==", name)
    .get();

  if (!chatRoomSnapshot.empty) return;

  await db.collection("chatRooms").add({ name });
}

export { authLogin, authLogout, authJoin, authSaveUser };
