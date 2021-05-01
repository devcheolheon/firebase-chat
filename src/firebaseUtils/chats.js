import { db, firebase, firebaseApp } from "../firebase";
import { emitOnSnapshot } from "./common";
// chats collection과 관련된 firebase 작업들이 모여있습니다.

//////
//chat 객체
//

// chats 에 저장되는 채팅방에 해당되는 객체
// 다음 형태가 될것이지만 처음 생성할 때에는 name과 users만 세팅
// recentMessage에는 최근에 게시된 메시지의 id가 저장됨

/*   
{
  name : "채팅방1",
  users : ["피카츄", "라이츄", "꼬부기"],
  totalMessages: 10,

  recentMessage? : messageId  // 최근에 게시된 메시지 document의 id  
  
  messages : [{id, created}... ]  
  // firebase에서는 채팅방 document 내부에 messages 컬렉션이 있다. 
  // 로컬의 리덕스 스토어에서는 해당 채팅방 내부에 {id, created} 의 리스트로 세팅한다.
  
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
    recentMessage: null,
    totalMessages: 0,
  };
}

// createChat

// @input : { name : 채팅방 이름 , userId : 채팅방을 생성한 사람의 id }
// @output : 생성된 채팅방의 id || ""

// 같은 이름의 채팅방에 없으면 chats 콜렉션에 새 객체 생성
// 생성된 채팅방의 id를 반환

export async function createChat({ name, userId }) {
  name = name.trim();

  let chatRoomSnapshot = await db
    .collection("chats")
    .where("name", "==", name)
    .get();

  if (!chatRoomSnapshot.empty) return "";

  let docRef = await db
    .collection("chats")
    .add(makeChat({ name, userId }))
    .catch((e) => false);

  if (!docRef) return "";
  else return docRef.id;
}

// getAllChats

// @input  : 없음
// @output : 생성된 모든 chat 객체 배열

export async function getAllChats() {
  let chatsSnapshot = await db.collection("chats").get();
  let result = [];
  chatsSnapshot.forEach((doc) => {
    let chat = doc.data();
    chat.id = doc.id;
    result.push(chat);
  });
  return result;
}

// joinChat

// @input : { chat : 채팅방 아이디, uid : 입장한 사용자의 아이디 , join : (입장 일때 true )}
// @output : 없음

// join값에 따라 사용자를 채팅방에 입장 또는 퇴장시킨다.
// ( 해당되는 chat document에 users리스트에 uid를 추가 또는 제거한다 )
// ( 해당되는 user document에 chats리스트에 chat을 추가 또는 제거한다 )
//   * (( user api에 해당되는 기능이지만, 같이 일어나야 할 일이라 여기다 작성했다 ))

export async function joinChats({ chat, uid, join = true }) {
  let targetFunc = join
    ? firebase.firestore.FieldValue.arrayUnion
    : firebase.firestore.FieldValue.arrayRemove;

  let chatRef = await db.collection("chats").doc(chat);
  let result = await chatRef
    .update({
      users: targetFunc(uid),
    })
    .catch((error) => false);

  let userQuery = await db.collection("google").where("uid", "==", uid).get();
  let userDocs = userQuery.docs;
  if (userDocs.length == 0) return;

  let userRef = userDocs[0].ref;

  result = await userRef
    .update({
      chats: targetFunc(chat),
    })
    .catch((error) => false);

  return result;
}

// unJoinChat

// @input : payload : { chat : 채팅방 아이디, uid : 입장한 사용자의 아이디 }
// @output : 없음

//  join값만 바꿔서 joinChat을 호출한다.

export async function unjoinChats(payload) {
  return joinChats({ ...payload, join: false });
}

// chatsSnapshotChannel

// @input : emitter  : 변화의 상태에 맞춰 액션을 발생시킬 함수
// @output : unscribe  : 구독을 취소할 수 있는 함수

//  chats 컬렉션의 변화를 구독하고 변화가 있을시 emitter를 호출한다

export function chatsSnapshotChannel(emitter) {
  const chatRoomsRef = db.collection("chats");
  const unscribe = emitOnSnapshot(emitter, chatRoomsRef);
  return unscribe;
}
