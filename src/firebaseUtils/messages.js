import { db, firebase, firebaseApp } from "../firebase";
import { emitOnSnapshot } from "./common";
// messages collection과 관련된 firebase 작업들이 모여있습니다.
// messages 컬렉션은 해당되는 chat document 내부에 존재합니다.

//////
//message 객체
//
/*   
{
  content : // 메시지 내용
  chat : // 메시지가 속한 채팅방의 아이디 
  user : // 작성한 user의 아이디 
  readUsers : [] // 채팅을 읽은 user의 리스트 ( 기본으로 쓴 user의 아이디를 갖고 있다 )
  targets: []    // 생성될 당시 채팅방에 속해있는 user의 리스트
  created : 생성 날짜
},
*/

// makeMessage

// @input  : { content : 메시지 내용, chat : 채팅방 id, user: 쓴사람 id , targets : 채팅방에 현재 인원  }
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

// sendMessage

// @input  : message : { content : 메시지 내용, chat : 채팅방 id, user: 쓴사람 id , targets : 채팅방에 현재 인원 }
// @output : { id ...message객체 } (id : firebase에서 메시지 document를 생성하면서 자동으로 생성한 아이디 )

// message 객체를 생성하고 해당되는 chat document내부의 messages 컬렉션에 저장한다.
// 이때 자동으로 할당된 id를 메시지 객체에 포함한 뒤 반환한다.

export async function sendMessage(message) {
  let chatRef = await db.collection("chats").doc(message.chat);
  let chat = await chatRef.get();

  message = makeMessage(message);

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

// getMessage

// @input  : { chat : 채팅방 id, uid: 쓴사람 id }
// @output : [... message객체 ]

// 채팅방에 모든 메시지를 읽어온다.
// chat 도큐먼트 내부에 messages 컬랙션의 모든 message document를 가져온다.
// 채팅방에 입장하거나, 초기화 과정에서 호출된다.

export async function getMessages({ chat, uid }) {
  let chatRef = db.collection("chats").doc(chat);
  let messageRef = chatRef
    .collection("messages")
    .where("targets", "array-contains", uid);
  let messages = [];
  const messageSnapshot = await messageRef.get().catch(() => []);
  messageSnapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() });
  });
  return messages;
}

// getMessage

// @input  : { chat : 채팅방 id, message: 메시지 id }
// @output :  message 객체

// 메시지의 아이디로 채팅방에 한 메시지를 읽어온다.
// 채팅방의 최신 메시지 미리보기 기능에서 쓰인다.

export async function getMessage({ chat, message }) {
  let chatRef = db.collection("chats").doc(chat);
  message = await chatRef
    .collection("messages")
    .doc(message)
    .get()
    .catch(() => null);

  if (!message) return message;
  return { ...message.data(), id: message.id };
}

// messagesSnapshotChannel

// @input : emitter - messages collection의 변화를 구독하고 action을 발생시킬 함수
// @output : unscribe - 구독을 취소할 함수

// 특정 채팅방에서 targets에 uid를 포함하고 있는 메시지들의
// 변경사항을 구독한다.

export function messagesSnapshotChannel(emitter, chatId, uid) {
  const messageRef = db
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .where("targets", "array-contains", uid);
  const unscribe = emitOnSnapshot(emitter, messageRef);
  return unscribe;
}

// setMessagesRead

// @input : {chat : 채팅방 아이디 , uid : 유져아이디 }
// @output : 없음

// 채팅방내 메시지를 읽음 처리한다.
// 채팅방내 targets에 uid를 포함하고 있는 모든 메시지에 readUsers에 uid를 추가한다

export async function setMessagesRead({ chat, uid }) {
  const messageRef = db.collection("chats").doc(chat).collection("messages");

  const messagesQuery = await messageRef
    .where("targets", "array-contains", uid)
    .get();

  messagesQuery.forEach((doc) => {
    let ref = doc.ref;
    ref.update({
      readUsers: firebase.firestore.FieldValue.arrayUnion(uid),
    });
  });
}
