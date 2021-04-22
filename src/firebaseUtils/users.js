import { db, firebase, firebaseApp } from "../firebase";

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

export async function getUsers() {
  const userRef = db.collection("google");
  const snapshot = await userRef.get();
  let users = [];
  snapshot.forEach((doc) => users.push(doc.data()));
  return users;
}

export async function subscribeUsers({ onAdded, onRemoved, onModified }) {
  const usersRef = db.collection("google");
  const unscribe = usersRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const newUser = change.doc.data();
      newUser.id = change.doc.id;

      if (change.type === "added") {
        onAdded(newUser);
      } else if (change.type === "removed") {
        onRemoved(newUser);
      } else if (change.type === "modified") {
        onModified(newUser);
      }
    });
  });

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
