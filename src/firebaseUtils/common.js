// firebaseUtils  함수중에서 공통으로 쓰일 함수를 뽑음

// emitOnSnapshot

// @input : emitter - ref의 변화를 구독하고 action을 발생시킬 함수
//          ref - 변화를 구독할 collection reference (firebase 객체)

// @output : unscribe - 구독을 취소할 함수

// emitter를 ref에 변화를 구독하도록 하고
// 전달 인자에 해당 document의 아이디를 포함하도록 함

export function emitOnSnapshot(emitter, ref) {
  const unscribe = ref.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const newDoc = change.doc.data();
      newDoc.id = change.doc.id;
      emitter({ payload: newDoc, type: change.type });
    });
  });
  return unscribe;
}
