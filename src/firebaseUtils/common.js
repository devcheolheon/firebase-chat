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
