import { db, firebase, firebaseApp } from "../firebase";

// makeMessage

// @input  : { content : 메시지 내용, chat : 채팅방 id, user: 쓴사람 id  }
// @output : { content : 메시지 내용, chat : 채팅방 id, user: 쓴사람 id,
//             readUsers : [ uid] 읽은 유져 배열 , created: 생성 날짜    }

// chat 객체를 생성

function makeMessage({ content, chat, user }) {
  return {
    content,
    chat,
    user,
    readUsers: [user],
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
