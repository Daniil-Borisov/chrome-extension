/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable camelcase */
const init = require("./initialize");
const cors = require("cors")({origin: true});
const {incrementCounter, getCount} = require("./util");

class comment {
  constructor(user_id, id, createdDate, views, data, position, num_replies, user_image, user_name, score, reactions, attachments, giffs, user_emoji) {
    this.user_id = user_id;
    this.createdDate = createdDate;
    this.id = id;
    this.views = views;
    this.data = data;
    this.position = position;
    this.num_replies = num_replies;
    this.user_image = user_image;
    this.user_name = user_name;
    this.score = score;
    this.reactions = reactions;
    this.attachments = attachments || [];
    this.giffs = giffs || [];
    this.user_emoji = user_emoji;
  }

  add_view() {

  }
}

// Firestore data converter
const commentsConverter = {
  toFirestore: (comment) => {
    return {
      id: comment.id,
      data: comment.data,
      createdDate: comment.createdDate,
      views: comment.views,
      position: comment.position,
      user_id: comment.user_id,
      num_replies: comment.num_replies || 0,
      user_image: comment.user_image,
      user_name: comment.user_name,
      score: comment.score || 0,
      reactions: comment.reactions || {},
      attachments: comment.attachments || [],
      giffs: comment.giffs || [],
      user_emoji: comment.user_emoji || 0,
    };
  },
  fromFirestore: (snapshot, reactions, views, options) => {
    const data = snapshot.data(options);
    return new comment(data.user_id, snapshot.id, data.createdDate, views, data.data, data.position, data.num_replies, data.user_image, data.user_name, data.score, reactions, data.attachments, data.giffs, data.user_emoji);
  },
  sendResponse: (res, comments) => {
    // console.log(toFirestore(web));
    commentsList = [];
    for (let i = 0; i < comments.length; i++) {
      commentsList.push(commentsConverter.toFirestore(comments[i]));
    }
    // console.log(commentsList)

    res.json(commentsList);
    res.send();
  },


};

const getCommentsLimit = 8;

const processReactions = async (websiteId, docId, commentId, userId) => {
  let dbRef;
  if (commentId) {
    dbRef = init.admin.firestore().collection("websites").doc(websiteId).collection("comments").doc(commentId).collection("replies").doc(docId).collection("reactions");
  } else {
    dbRef = init.admin.firestore().collection("websites").doc(websiteId).collection("comments").doc(docId).collection("reactions");
  }

  const reactions = await dbRef.get();

  if (reactions.empty) {
    return {};
  } else {
    const emojiMap = {};
    reactions.docs.forEach((r) => {
      emojiMap[r.id] = {
        count: r.data().count || 0,
        me: r.data() && r.data().reacted_users && r.data().reacted_users[userId] ? true : false,
      };
    });
    return emojiMap;
  }
};

const retrieveResultList = async (isComment, web_id, comment_id, lastId, limit, user_id, res) => {
  let dbRef;

  if (isComment) {
    dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments");
  } else {
    dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).collection("replies");
  }
  let queryRef = dbRef.orderBy("createdDate", "desc").limit(limit);

  let lastItemSnap;
  if (lastId) {
    if (isComment) {
      lastItemSnap = await init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(lastId).get();
    } else {
      lastItemSnap = await init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).collection("replies").doc(lastId).get();
    }
    queryRef = dbRef.orderBy("createdDate", "desc").startAfter(lastItemSnap).limit(limit);
  }

  comments_list = [];
  queryRef.get().then(async (docsRef) => {
    if (!docsRef.empty) {
      console.log("found >>", docsRef.size);

      for (const doc of docsRef.docs) {
        try {
          console.log(web_id, comment_id, doc.id, user_id);
          const reactionsData = await processReactions(web_id, doc.id, comment_id, user_id);
          let commentViewCounter;
          if (isComment) {
            console.log("Comment ID,", comment_id);
            commentViewCounter = await getCount(doc.ref, "commentViewsCounter");
          }
          comments_list.push(commentsConverter.fromFirestore(doc, reactionsData, commentViewCounter));
        } catch (e) {
          console.log(e);
          res.json({
            error: e.message,
          });
          return;
        }
      }


      commentsConverter.sendResponse(res, comments_list);
      // docsRef.docs.forEach(doc => {
      // });
    } else {
      // doc.data will be undefined in this case
      console.log("No comments!");
      res.json({"message": isComment ? "no comments" : "no replies"});
      res.send();
    }
  });
};

class Visitor {
  constructor(user_id, id, recentDate, views, user_image, user_name, user_ip) {
    this.user_id = user_id;
    this.id = id;
    this.recentDate = recentDate;
    this.views = views;
    this.user_image = user_image;
    this.user_name = user_name;
    this.user_ip = user_ip;
  }
}

// Firestore data converter
const visitorConverter = {
  toFirestore: (visitor) => {
    return {
      id: visitor.id,
      recentDate: visitor.recentDate,
      views: visitor.views,
      user_id: visitor.user_id,
      user_image: visitor.user_image,
      user_name: visitor.user_name,
      user_ip: visitor.user_ip,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new visitor(data.user_id, snapshot.id, data.recentDate, data.views, data.user_image, data.user_name, data.user_ip);
  },

};

const recordVisitor = async (web_id, user_id, user_ip) => {
  console.log("record visitor %s %s", user_id, user_ip);
  if (!user_id && !user_ip) {
    return;
  }
  if (!user_id) {
    user_id = "";
  }
  if (!user_ip || user_id) {
    user_ip = "";
  }

  let visitor; let visitorRef;

  // find existing entry
  if (user_id) {
    visitorRef = await init.admin.firestore().collectionGroup("visitors").where("user_id", "==", user_id).limit(1).get();
  } else if (user_ip) {
    visitorRef = await init.admin.firestore().collectionGroup("visitors").where("user_ip", "==", user_ip).limit(1).get();
  }

  // create new entry
  if (!visitorRef || visitorRef.empty) {
    const dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("visitors");
    let user_name = ""; let user_image = "";

    // get user name and photo
    if (user_id) {
      await init.admin.auth().getUser(user_id).then((user) => {
        user_name = user.displayName;
        user_image = user.photoURL;
      }).catch((error) => {
        console.log("Error fetching user data:", error);
      });
    }

    // user_id, id, createdDate, views, user_image, user_name, IP
    visitor = new Visitor(user_id, "", new Date(), 1, user_image, user_name, user_ip);
    init.admin.firestore().collection("websites").doc(web_id).collection("visitors").add(visitorConverter.toFirestore(visitor));
    const countRef = init.admin.firestore().collection("utils").doc("visitor_shard_0");
    const count = await countRef.get();
    countRef.update({
      count: count.data().count + 1,
    });
    console.log("new user");
  } else {
    // add view and update date
    visitorRef.docs.forEach((v) => {
      console.log("update user %d", v.data().views);
      v.ref.update({views: v.data().views + 1, recentDate: new Date()});
    });
  }
  return;
};

exports.getcomments = init.functions.https.onRequest((req, res) => {
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
      const web_id = req.body.web_id;
      const limit = getCommentsLimit;
      const lastId = req.body.last_id;
      const userId = req.body.user_id;

      if (!web_id) {
        res.json({"message": "no web_id"});
        res.send();
        return;
      }

      if (!lastId) {
        try {
          return await retrieveResultList(true, web_id, null, lastId, limit, userId, res);
        } catch (e) {
          console.log(e);
          res.json({
            error: e.message,
          });
        }
      }

      try {
        return await retrieveResultList(true, web_id, null, lastId, limit, userId, res);
      } catch (e) {
        console.log(e);
        res.json({
          error: e.message,
        });
      }
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "verifyIdToken error"});
      res.send();
    });
  });
});

exports.getreplies = init.functions.https.onRequest((req, res) => {
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
      const web_id = req.body.web_id;
      const limit = getCommentsLimit;
      const lastId = req.body.last_id;
      const comment_id = req.body.comment_id;
      const userId = req.body.user_id;

      if (!web_id) {
        res.json({"message": "no web_id"});
        res.send();
        return;
      }

      if (!lastId) {
        const commentRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id);
        await incrementCounter(commentRef, "commentViewsCounter");
      }

      await retrieveResultList(false, web_id, comment_id, lastId, limit, userId, res);
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
    });
  });
});

exports.setcomments = init.functions.https.onRequest(async (req, res) => {
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
      const user_id = req.body.user_id;
      const web_id = req.body.web_id;

      const user_image = req.body.user_image;
      const user_name = req.body.user_name;
      const user_emoji = req.body.user_emoji;

      if (!web_id) {
        res.json({"message": "no web_id"});
        res.send();
        return;
      }

      if (!user_id) {
        res.json({"message": "no user_id"});
        res.send();
        return;
      }

      if (!user_emoji) {
        res.json({"message": "no user_emoji"});
        res.send();
        return;
      }

      const data = req.body.data;
      const position = req.body.position || null;
      const attachments = req.body.attachments || [];
      const giffs = req.body.giffs || [];

      if (!data && attachments.length === 0 && giffs.length === 0) {
        res.json({"message": "no data"});
        res.send();
        return;
      }

      try {
        const dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments");
        new_comment = new comment(user_id, "", new Date(), 0, data || "", position, 0, user_image, user_name, 0, {}, attachments, giffs, user_emoji);
        return dbRef.add(commentsConverter.toFirestore(new_comment)).then(async (add_res) => {
          new_comment.id = add_res.id;
          await incrementCounter(init.admin.firestore().collection("websites").doc(web_id), "commentCounter");
          res.json({"message": "comment added"});
          res.send();
        });
      } catch (e) {
        console.log(e);
        res.json({
          error: e.message,
        });
        return;
      }
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "verifyIdToken error"});
      res.send();
    });
  });
});

exports.setreply = init.functions.https.onRequest((req, res) => {
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
      const web_id = req.body.web_id;
      const comment_id = req.body.comment_id;
      if (!web_id) {
        res.json({"message": "no web_id"});
        res.send();
        return;
      }

      if (!user_id) {
        res.json({"message": "no user_id"});
        res.send();
        return;
      }

      const data = req.body.data;
      const user_image = req.body.user_image;
      const user_name = req.body.user_name;

      const attachments = req.body.attachments || [];

      if (!data) {
        res.json({"message": "no data"});
        res.send();
        return;
      }

      try {
        const parentComment = await init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).get();

        if (parentComment) {
          const newNumOfComments = isNaN(parentComment.data().num_replies) ? 1 : parentComment.data().num_replies + 1;
          await init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).update({num_replies: newNumOfComments});
        } else {
          res.json({"message": "invalid comment ID"});
          res.send();
        }

        const dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).collection("replies");
        new_comment = new comment(user_id, "", new Date(), 0, data, null, 0, user_image, user_name, 0, {}, attachments, 0);
        dbRef.add(commentsConverter.toFirestore(new_comment)).then((add_res) => {
          new_comment.id = add_res.id;
          res.json({"message": "reply added"});
          res.send();
        });
      } catch (e) {
        console.log(e);
        res.json({
          error: e.message,
        });
        return;
      }
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
    });
  });
});

exports.getusercomments = init.functions.https.onRequest((req, res) => {
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

      const commentsList = [];
      const comments = await init.admin.firestore().collectionGroup("comments").where("user_id", "==", user_id).orderBy("createdDate", "desc").get();
      if (!comments.empty) {
        comments.docs.forEach((doc) => {
          commentsList.push(doc.data());
        });
      }

      const repliesList = [];
      const replies = await init.admin.firestore().collectionGroup("replies").where("user_id", "==", user_id).orderBy("createdDate", "desc").get();
      if (!replies.empty) {
        replies.docs.forEach((doc) => {
          repliesList.push(doc.data());
        });
      }

      res.json({
        comments: commentsList,
        replies: repliesList,
      });
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "verifyIdToken error"});
      res.send();
    });
  });
});

exports.react = init.functions.https.onRequest((req, res) => {
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
      const web_id = req.body.web_id;
      const comment_id = req.body.comment_id;
      const reaction_emoji = req.body.reaction_emoji;
      const reply_id = req.body.reply_id;

      if (!user_id) {
        res.json({"message": "no user_id"});
        res.send();
        return;
      }

      if (!web_id) {
        res.json({"message": "no web_id"});
        res.send();
        return;
      }

      if (!comment_id) {
        res.json({"message": "no comment_id"});
        res.send();
        return;
      }

      if (!reaction_emoji) {
        res.json({"message": "no reaction_emoji"});
        res.send();
        return;
      }

      try {
        if (reply_id) {
          dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).collection("replies").doc(reply_id).collection("reactions").doc(reaction_emoji);
        } else {
          dbRef = init.admin.firestore().collection("websites").doc(web_id).collection("comments").doc(comment_id).collection("reactions").doc(reaction_emoji);
        }

        const reaction = await dbRef.get();

        let reactionData = {};
        let message = "";

        if (!reaction.exists) {
          // this reaction emoji is never used on this comment/reply. use this for the first time and set the count: 1
          reactionData = {
            count: 1,
            reacted_users: {
              [user_id]: true,
            },
          };
          message = "reaction added";
        } else {
          // already used. add/remove user id into the map and update the count
          const alreadyReactedUsers = reaction.data().reacted_users;
          let count = reaction.data().count;
          if (alreadyReactedUsers[user_id]) {
            delete alreadyReactedUsers[user_id];
            count = count - 1;
            message = "reaction removed";
          } else {
            alreadyReactedUsers[user_id] = true;
            count = count + 1;
            message = "reaction added";
          }

          reactionData = {
            count,
            reacted_users: alreadyReactedUsers,
          };
        }

        await dbRef.set(reactionData);

        res.json({
          message,
        });
      } catch (e) {
        console.log(e);
        res.json({
          error: e.message,
        });
        return;
      }
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
    });
  });
});
