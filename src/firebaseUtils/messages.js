import { db, firebase, firebaseApp } from "../firebase";
import { emitOnSnapshot } from "./common";

// makeMessage

// @input  : { content : 메시지 내용, chat : 채팅방 id, user: 쓴사람 id  }
// @output : { content : 메시지 내용, chat : 채팅방 id, user: 쓴사람 id,
//             readUsers : [ uid] 읽은 유져 배열 , created: 생성 날짜    }

// chat 객체를 생성

function makeMessage({ content, chat, user, targets }) {
  return {
    content,
    chat,
    user,
    readUsers: [user],
    targets,
    created: firebase.firestore.Timestamp.now().seconds,
  };
}

export async function sendMessage(payload) {
  let chatRef = await db.collection("chats").doc(payload.chat);
  let chat = await chatRef.get();

  const message = makeMessage(payload);

  let messageRef = await chatRef
    .collection("messages")
    .add(message)
    .catch((error) => false);

  await chatRef
    .update({
      recentMessage: messageRef.id,
      totalMessages: chat.data().totalMessages + 1,
    })
    .catch((error) => false);

  let id = messageRef && messageRef.id;

  return { ...message, id };
}

export async function getMessages(payload) {
  let chatRef = db.collection("chats").doc(payload.chat);
  let messageRef = chatRef
    .collection("messages")
    .where("targets", "array-contains", payload.uid);
  let messages = [];
  const messageSnapshot = await messageRef.get().catch(() => []);
  messageSnapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() });
  });
  return messages;
}

export function messagesSnapshotChannel(emitter, chatId, uid) {
  const messageRef = db
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .where("targets", "array-contains", uid);
  const unscribe = emitOnSnapshot(emitter, messageRef);
  return unscribe;
}

export async function setMessagesRead(payload) {
  const messageRef = db
    .collection("chats")
    .doc(payload.chat)
    .collection("messages");

  const messagesQuery = await messageRef
    .where("targets", "array-contains", payload.uid)
    .get();

  messagesQuery.forEach((doc) => {
    let ref = doc.ref;
    ref.update({
      readUsers: firebase.firestore.FieldValue.arrayUnion(payload.uid),
    });
  });
}
