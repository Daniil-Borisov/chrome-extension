/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const init = require("./initialize");
const cors = require("cors")({origin: true});
const {incrementCounter, getCount} = require("./util");

class website {
  constructor(url, createdDate, id, views, comments_count, likes) {
    this.url = url;
    this.createdDate = createdDate;
    this.id = id;
    this.views = views;
    this.comments_count = comments_count;
    this.likes = likes;
  }
  toString() {
    return this.url + ", " + this.createdDate + ", " + this.id + ", ", this.likes;
  }
}

class like {
  constructor(user_id, createdDate) {
    this.user_id = user_id;
    this.createdDate = createdDate;
  }
  toString() {
    return this.user_id + ", " + this.createdDate;
  }
}

const likeConverter = {
  toFirestore: (like) => {
    return {
      user_id: like.user_id,
      createdDate: like.createdDate,
    };
  },
};

// Firestore data converter
const websiteConverter = {
  toFirestore: (website) => {
    return {
      url: website.url,
      createdDate: website.createdDate,
      id: website.id,
      views: website.views || 1,
      comments_count: website.comments_count || 0,
      likes: website.likes || 0,
      user_liked: website.user_liked || false,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new website(data.url, data.createdDate.toDate(), snapshot.id, data.views, data.comments_count, data.likes);
  },
  sendResponse: (res, website) => {
    // console.log(toFirestore(web));
    res.json(websiteConverter.toFirestore(website));
    res.send();
  },
};

exports.geturl = init.functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
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
    init.admin.auth().verifyIdToken(idToken).then((decodedToken) => {
      const url = req.body.url;
      if (!url) {
        res.json({"message": "no URL"});
        res.send();
        return;
      }

      const dbRef = init.admin.firestore().collection("websites");
      const queryRef = dbRef.where("url", "==", url);
      let user_liked = false;
      try {
        queryRef.limit(1).get().then((docsRef) => {
          if (!docsRef.empty) {
            // url found. increment the counter
            docsRef.docs.forEach(async (doc) => {
              const web = websiteConverter.fromFirestore(doc);
              await incrementCounter(doc.ref, "viewCounter");
              const viewCount = await getCount(doc.ref, "viewCounter");
              const comments_count = await getCount(doc.ref, "commentCounter");
              console.log("views:" + viewCount + " " + web.views);
              doc.ref.update({
                views: viewCount,
                comments_count: comments_count,
                likes: web.likes || 0,
              });
              let like_dbRef;
              if (user_id) {
                like_dbRef = await init.admin.firestore().collection("websites").doc(web.id).collection("likes").where("user_id", "==", user_id).limit(1).get();
                if (!like_dbRef.empty) {
                  user_liked = true;
                }
              }
              websiteConverter.sendResponse(res, {...web, views: viewCount || web.views, comments_count: comments_count, likes: 0 || web.likes, user_liked: user_liked});
            });
          } else {
            // url not found. create a new doc
            console.log("No such document!");
            new_web = new website(url, new Date(), "", 0, 0, 0);
            dbRef.add(websiteConverter.toFirestore(new_web)).then(async (add_res) => {
              new_web.id = add_res.id;
              // await incrementCounter(add_res.ref, 'viewCounter');
              new_web.user_liked = user_liked;
              websiteConverter.sendResponse(res, new_web);
            });
          }
        });
      } catch (e) {
        console.log(e);
        res.json({
          error: e.message,
        });
      }
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "geturl verifyIdToken error"});
      res.send();
    });
  });
});

exports.addEmail = init.functions.https.onRequest(async (req, res) => {
  cors(req, res, () => {
    if (req.method != "POST") {
      res.json({"message": "not using POST"});
      res.send();
      return;
    }

    const email = req.body.email;

    if (!email) {
      res.json({"message": "no email"});
      res.send();
      return;
    }
    try {
      const date = new Date();
      const dbRef = init.admin.firestore().collection("email");
      dbRef.add({email, date}).then((add_res) => {
        console.log("email added");
        res.json({"message": "email added"});
        res.send();
        return;
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: e.message,
      });
    }
  });
});
