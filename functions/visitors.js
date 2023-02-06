/* eslint-disable camelcase */
/* eslint-disable max-len */

const init = require("./initialize");
const cors = require("cors")({origin: true});

// class Visitor {
//   constructor(user_id, id, recentDate, views, user_image, user_name, ip) {
//     this.user_id = user_id
//     this.id = id;
//     this.recentDate = recentDate;
//     this.views = views;
//     this.user_image = user_image;
//     this.user_name = user_name;
//     this.ip = ip;
//   }
// }

// Firestore data converter
// const visitorConverter = {
//   toFirestore: (visitor) => {
//     return {
//       id: visitor.id,
//       recentDate: visitor.recentDate,
//       views: visitor.views,
//       user_id: visitor.user_id,
//       user_image: visitor.user_image,
//       user_name: visitor.user_name,
//       ip: visitor.ip
//     };
//   },
//   fromFirestore: (snapshot, options) => {
//     const data = snapshot.data(options);
//     return new visitor(data.user_id, snapshot.id, data.recentDate, data.views, data.user_image, data.user_name, data.ip);
//   },
//   // sendResponse: (res, visitors, count) => {
//   //   // console.log(toFirestore(web));
//   //   visitors_list = []
//   //   for (let i = 0; i < visitors.length; i++) {
//   //     visitors_list.push(visitorConverter.toFirestore(visitors[i]));

//   //   }
//   //   // console.log(visitors_list)

//   //   res.json({count, visitors_list});
//   //   res.send();
//   // }
// }

module.exports.getNumOfPeople = init.functions.https.onRequest(async (req, res) => {
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
      // const uid = decodedToken.uid;
      // return count + most recent 5 image urls, limit 15 mins
      const visitorRef = await init.admin.firestore().collectionGroup("visitors").where("user_ip", "==", "").orderBy("recentDate", "desc");

      const visitors_list = [];
      const visitors = await visitorRef.limit(5).get();
      if (!visitors.empty) {
        visitors.docs.forEach((doc) => {
          visitors_list.push(doc.data());
        });
      }

      const countRef = init.admin.firestore().collection("utils").doc("visitor_shard_0");
      const count = await countRef.get();
      // console.log(visitors_list);
      res.json({
        count: count.data().count,
        visitors: visitors_list,
      });
      res.send();
      // visitorConverter.sendResponse(res, visitors_list, count.data().count);
    }).catch((error) => {
      console.log("verifyIdToken :", {error});
      res.json({"message": "getNumOfPeople verifyIdToken error"});
      res.send();
    });
  });
});

module.exports.emptyVisitors = init.functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const visitorList = [];
    const visitors = await init.admin.firestore().collectionGroup("visitors").orderBy("recentDate", "desc").get();
    if (!visitors.empty) {
      visitors.docs.forEach((doc) => {
        const timeDiff = new Date() - doc.data().recentDate.toDate();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        console.log(daysDiff);
        if (daysDiff > 15) {
          doc.ref.delete();
        } else {
          visitorList.push(doc.data());
        }
      });
      const countRef = init.admin.firestore().collection("utils").doc("visitor_shard_0");
      countRef.update({
        count: visitorList.length,
      });
      res.json({
        visitors: visitorList,
      });
    }
  });
});
