const comments = require("./comments");
const website = require("./website");
const users = require("./users");
const visitors = require("./visitors");

// visitors
exports.getNumOfPeople = visitors.getNumOfPeople;
exports.emptyVisitors = visitors.emptyVisitors;
// exports.scheduledFunction = visitors.scheduledFunction;
// exports.recordVisitor = visitors.recordVisitor;

// websites
exports.geturl = website.geturl;
exports.likeWebsite = website.likeWebsite;
exports.addEmail = website.addEmail;

// comments
exports.getcomments = comments.getcomments;
exports.setcomments = comments.setcomments;
exports.setreply = comments.setreply;
exports.getreplies = comments.getreplies;
exports.getusercomments = comments.getusercomments;
exports.react = comments.react;

// users
exports.createuser = users.createuser;
exports.updateuser = users.updateuser;
exports.updateuserloginhistory = users.updateuserloginhistory;
exports.updateuserdataincomments = users.updateuserdataincomments;
