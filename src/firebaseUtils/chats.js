import { db, firebase, firebaseApp } from "../firebase";

// chats collection과 관련된 firebase 작업들이 모여있습니다.

// chat
// chats 에 저장되는 채팅방에 해당되는 객체
// 다음 형태가 될것이지만 처음 생성할 때에는 name과 users만 세팅

/*   
{
  name : "채팅방1",
  users : ["피카츄", "라이츄", "꼬부기"],
  totalMessages: 10,
  recentMessage : {
    user: "피카츄",
    content: "안녕하세요우",
    createdAt: "",
  },
  messages : // firebase 콜렉션 
},
*/

// makeChat

// @input : { name : 채팅방 이름 , userId : 채팅방을 생성한 사람의 id }
// @output : { name : 채팅방 이름, users : [ ... userId ] 배열 }

// chat 객체를 생성

function makeChat({ name, userId }) {
  return {
    name,
    users: [userId],
    recentMessage: "",
    totalMessages: 0,
  };
}

// createChat

// @input : { name : 채팅방 이름 , userId : 채팅방을 생성한 사람의 id }
// @output : Promise < DocumentReference < T > >

// 반환값 참고 (https://firebase.google.com/docs/reference/js/firebase.firestore.CollectionReference?hl=ko#add)
// 같은 이름의 채팅방에 없으면 chats 콜렉션에 새 객체 생성

async function createChat({ name, userId }) {
  name = name.trim();

  let chatRoomSnapshot = await db
    .collection("chats")
    .where("name", "==", name)
    .get();

  if (!chatRoomSnapshot.empty) return true;

  let docRef = await db
    .collection("chats")
    .add(makeChat({ name, userId }))
    .catch((e) => false);

  if (!docRef) return "";
  else return docRef.id;
}

function linkToChatsList({ onAdded }) {
  const chatRoomsRef = db.collection("chats");
  chatRoomsRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const newDoc = change.doc.data();
      newDoc.id = change.doc.id;
      if (change.type === "added") {
        onAdded(newDoc);
      }
    });
  });
}

export { createChat, linkToChatsList };

/*
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
  const chatRoomsRef = db.collection("chatRooms").doc(chatRoomId);
  await chatRoomsRef.collection("messages").add({
    userId,
    content,
    readids: [userId],
    created: firebase.firestore.Timestamp.now().seconds,
  });
}

export async function addReadIds({ chatRoomId, chatId, userId }) {
  const chatRef = db
    .collection("chatRooms")
    .doc(chatRoomId)
    .collection("messages")
    .doc(chatId);

  chatRef.update({
    readids: firebase.firestore.FieldValue.arrayUnion(userId),
  });
}

export async function getUnReadCount({ chatRoomId, chatId, userId }) {
  const chatRef = db
    .collection("chatRooms")
    .doc(chatRoomId)
    .collection("messages")
    .doc(chatId);

  const members = await db.collection("google").get();
  const chat = (await chatRef.get()).data();
  console.log(members);
  console.log(chat);
  return members.size - chat.readids.length;
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
*/
