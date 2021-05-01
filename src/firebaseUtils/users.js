import { db, firebase, firebaseApp } from "../firebase";
import { emitOnSnapshot } from "./common";
// google collection과 관련된 firebase 작업들이 모여있습니다.
// firebase의 인증과정에서 할당받은 아이디(uid) 와 그에 해당되는 유져의 정보를 저장하고 있습니다.

//////
//user 객체
//

// message, chat은 해당 객체의 아이디로 조회하지만,
// user 객체는 uid 를 가지고 조회합니다.
/*   
{
  uid : "",    // 유일 키 , firebase 인증과정에서 제공된 아이디
  nickname : "",
  email : "",  // 이 App에서 아이디와 같은 역할 
  created: "", // 가입 날짜
  chats : [],  // 현재 참여하고 있는 채팅방 id의 리스트 
},
*/

// getUserNameById

// @input :  id ( 인증과정에서 받은 uid )
// @output : user의 이름  || 'noname'

// 유져의 이름을 가져온다

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

// getUsers

// @input : 없음
// @output : [... user 객체 ]

// 현재 가입한 모든 유져의 정보를 받아온다.
// 최초 초기화 과정에 필요하다

export async function getUsers() {
  const userRef = db.collection("google");
  const snapshot = await userRef.get();
  let users = [];
  snapshot.forEach((doc) => users.push(doc.data()));
  return users;
}

// usersSnapshotChannel

// @input : emitter - google collection의 변화를 구독하고 action을 발생시킬 함수
// @output : unscribe - 구독을 취소할 함수

// 초기화 과정에서 호출하여 사용자의 정보 변경을 구독한다.

export function usersSnapshotChannel(emitter) {
  const usersRef = db.collection("google");
  const unscribe = emitOnSnapshot(emitter, usersRef);
  return unscribe;
}

/*
//  user 정보에 저장된 password를 일괄적으로 삭제하는 코드 
//  user 일괄 작업
async function batchUser() {
  let batch = db.batch();
  let querySnapshot = await db.collection("google").get();
  querySnapshot.forEach((userRef) => {
    batch.update(userRef.ref, {
      password: firebase.firestore.FieldValue.delete(),
    });
  });
  batch.commit().then(() => console.log("complete"));
}
batchUser();
*/
