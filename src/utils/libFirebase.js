import { firebaseApp } from "../firebase";

async function authLogin(email, password) {
  let user = await firebaseApp
    .auth()
    .signInWithEmailAndPassword(email, password);

  const uid = (firebaseApp.auth().currentUser || {}).uid;

  return uid;
}

async function authLogout() {
  await firebaseApp.auth().signOut();
}

export { authLogin, authLogout };
