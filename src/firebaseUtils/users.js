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
