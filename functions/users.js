/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const init = require("./initialize");
const cors = require("cors")({origin: true});
// const { FieldValue } = require('firebase/firestore');

class User {
  constructor(id, email, name, photoURL, createdDate) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.photoURL = photoURL;
    this.createdDate = createdDate;
    this.login_history = [];
  }

  getuser() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      photoURL: this.photoURL,
      createdDate: this.createdDate,
      login_history: this.login_history,
    };
  }
}

exports.createuser = init.functions.auth.user().onCreate(async (userInfo) => {
  console.log("userInfo >>", userInfo);
  const newUser = new User(userInfo.uid, userInfo.email, userInfo.displayName, userInfo.photoURL, new Date());
  const userDbRef = init.admin.firestore().collection("users").doc(userInfo.uid);

  await userDbRef.set(newUser.getuser());

  return true;
});

exports.updateuser = init.functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method != "POST") {
      res.json({"message": "not using POST"});
      res.send();
      return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.json({"message": "authorization headers missing"});
      res.send();
      return;
    }
    const idToken = authHeader.split(" ")[1];
    init.admin.auth().verifyIdToken(idToken).then(async (decodedToken) => {
      const user_id = req.body.user_id;

      if (!user_id) {
        res.json({"message": "no user_id"});
        res.send();
        return;
      }

      const displayName = req.body.name;
      const photoURL = req.body.photo_url;

      // if image found, upload to cloud storage and store the url in auth and firestore

      await init.admin.auth()
          .updateUser(user_id, {
            displayName,
            photoURL,
          });

      await init.admin.firestore().collection("users").doc(user_id).set({
        name: displayName,
        photoURL: photoURL,
      }, {
        merge: true,
      });

      res.json({
        message: "User data updated",
      });
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "verifyIdToken error"});
      res.send();
    });
  });
});

exports.updateuserloginhistory = init.functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    if (req.method != "POST") {
      res.json({"message": "not using POST"});
      res.send();
      return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.json({"message": "authorization headers missing"});
      res.send();
      return;
    }
    const idToken = authHeader.split(" ")[1];
    init.admin.auth().verifyIdToken(idToken).then(async (decodedToken) => {
      const user_id = req.body.user_id;

      if (!user_id) {
        res.json({"message": "no user_id"});
        res.send();
        return;
      }

      const userDbRef = init.admin.firestore().collection("users").doc(user_id);

      console.log("FieldValue.serverTimestamp() >>", init.admin.firestore.FieldValue.serverTimestamp());

      await userDbRef.update({
        login_history:
          init.admin.firestore.FieldValue.arrayUnion(
              {
                action: "login",
                timestamp: new Date(),
              },
          ),
      });

      res.json({
        message: "User login history updated",
      });
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "verifyIdToken error"});
      res.send();
    });
  });
});

exports.updateuserdataincomments = init.functions.firestore.document("users/{userId}").onUpdate(async (change, context) => {
  // init.admin.auth().verifyIdToken(idToken).then((decodedToken) => {
  const prevData = change.before.data();
  const afterData = change.after.data();
  const user_id = context.params.userId;

  if (prevData.name !== afterData.name || prevData.photoURL !== afterData.photoURL) {
    console.log("name or photo changed. updating comments and replies");

    // fetch websites

    const websitesRef = init.admin.firestore().collection("websites");

    const websites = await websitesRef.get();
    if (websites.empty) {
      return true;
    }

    // 1. functions/comments.js - 205
    // 2. update visitors, comments, replies subcollection

    const userComments = await init.admin.firestore().collectionGroup("comments").where("user_id", "==", user_id).get();
    const userReplies = await init.admin.firestore().collectionGroup("replies").where("user_id", "==", user_id).get();
    const userVisitors = await init.admin.firestore().collectionGroup("visitors").where("user_id", "==", user_id).get();

    try {
      userComments.docs.forEach((c) => {
        console.log("updatying comment: ", c.id);
        c.ref.update({
          user_name: afterData.name,
          user_image: afterData.photoURL,
        });
      });

      userReplies.docs.forEach((r) => {
        console.log("updating reply: ", r.id);
        r.ref.update({
          user_name: afterData.name,
          user_image: afterData.photoURL,
        });
      });

      userVisitors.docs.forEach((v) => {
        console.log("updating visitors: ", v.id);
        v.ref.update({
          user_name: afterData.name,
          user_image: afterData.photoURL,
        });
      });

      return true;
    } catch (e) {
      console.log("Error", e);
      return true;
    }
  } else {
    console.log("No change. Return true");
    return true;
  }
  // }).catch((error) => {
  //   console.log('verifyIdToken :', { error });
  // });
});
