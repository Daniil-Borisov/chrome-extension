const init = require("./initialize");
const numberOfViewCountShards = 3;

exports.incrementCounter = async (docRef, collectionName) => {
  const shardId = Math.floor(Math.random() * numberOfViewCountShards);
  const shardRef = docRef.collection(collectionName).doc(shardId.toString());
  return await shardRef.set({
    count: init.admin.firestore.FieldValue.increment(1),
  }, {merge: true});
};

exports.getCount = async (docRef, collectionName) => {
  const querySnapshot = await docRef.collection(collectionName).get();
  const documents = querySnapshot.docs;

  let count = 0;
  for (const doc of documents) {
    count += doc.get("count");
  }
  return count;
};
