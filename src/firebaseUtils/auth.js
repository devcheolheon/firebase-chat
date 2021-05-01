import { db, firebase, firebaseApp } from "../firebase";
// 인증과정과  관련된 firebase 작업들이 모여있습니다.
// user 객체를 생성하고 저장하는 함수도 여기에 있습니다.

// authSaveUser

// @input  : { email: 이메일 (아이디에 해당), uid: 인증아이디 , nickname : 닉네임 }
// @output :  없음

// 인증과정의 id와 사용자가 입력한 정보를 함께 users 컬렉션에 저장

async function authSaveUser({ email, uid, nickname }) {
  await db.collection("google").add({
    email,
    uid,
    nickname,
    created: firebase.firestore.Timestamp.now().seconds,
  });
}

// authSaveUser

// @input  : { email: 이메일 (아이디에 해당), password : 비밀번호 }
// @output :  uid

// firebase의 인증과정에 이메일과 비밀번호를 등록하고 해당되는 uid를 받아옴

async function authJoin({ email, password }) {
  const user = await firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password);
  const uid = (firebaseApp.auth().currentUser || {}).uid;
  return uid;
}

// authLogin

// @input  : { email: 이메일 (아이디에 해당), password : 비밀번호 }
// @output :  uid || ""

// firebase의 인증과정에 email 과 password를 제출하고 이에 해당되는 아이디를 받아옴

async function authLogin({ email, password }) {
  let uid = "";

  await firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password)
    .catch(() => {});

  uid = (firebaseApp.auth().currentUser || {}).uid || "";
  return uid;
}

// authLogin

// @input  : ""
// @output :  ""

// firebase의 인증과정에 로그아웃 api를 호출함

async function authLogout() {
  await firebaseApp.auth().signOut();
}

// linkToAuthState

// @input  : { onLogin (로그인시 호출될 함수 ), onLogout (로그아웃시 호출될 함수) }
// @output :  uid || ""

// firebase의 인증상태를 구독하고 인증상태 변화에 따라
// onLogin 또는 onLogout을 호출함

async function linkToAuthState({ onLogin, onLogout }) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      onLogin(user.uid);
    } else onLogout();
  });
}

export { authLogin, authLogout, authJoin, authSaveUser, linkToAuthState };
