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

async function authLogin(email, password) {
  try {
    let user = await firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password);

    const uid = (firebaseApp.auth().currentUser || {}).uid;
    return uid;
  } catch (e) {
    console.log(e);
    return "";
  }
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

export function linkToChatRoomList({ onAdded, onRemoved }) {
  const chatRoomsRef = db.collection("chatRooms");
  chatRoomsRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const newDoc = change.doc.data();
      newDoc.id = change.doc.id;
      if (change.type === "added") {
        onAdded(newDoc);
      } else if (change.type === "removed") {
        onRemoved(newDoc);
      }
    });
  });
}

export function linkToChatList({ roomId, onAdded, onRemoved, onModified }) {
  const chatsRef = db
    .collection("chatRooms")
    .doc(roomId)
    .collection("messages")
    .orderBy("created");

  const unscribe = chatsRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const newChat = change.doc.data();
      newChat.id = change.doc.id;
      if (change.type === "added") {
        onAdded(newChat);
      } else if (change.type === "removed") {
        onRemoved(newChat);
      } else if (change.type === "modified") {
        onModified(newChat);
      }
    });
  });

  return unscribe;
}

export async function addChatToRoom({ chatRoomId, userId, content }) {
  console.log(chatRoomId);
  const chatRoomsRef = db.collection("chatRooms").doc(chatRoomId);
  await chatRoomsRef.collection("messages").add({
    userId,
    content,
    created: firebase.firestore.Timestamp.now().seconds,
  });
}

export async function getUserNameById(id) {
  const userRef = db.collection("google").where("uid", "==", id);
  const snapshot = await userRef.get();
  let user;
  snapshot.forEach((doc) => (user = doc.data()));
  if (user && user.nickname !== "") {
    return user.nickname;
  }
  return "noname";
}

export { authLogin, authLogout, authJoin, authSaveUser };
