import "regenerator-runtime/runtime.js";
import AxiosAPIHelper from '../Utils/ApiHelperWithAxios';
import { authorizeGetAuthToken, authorizeLaunchWebAuthFlow } from './auth';
import { GoogleAuthProvider, getAuth, signInWithCredential, User, signOut } from "firebase/auth";
import { extUtil } from '../Utils/ExtensionFunctions';
import { LOG } from '../Utils/debug';

type ChromeSendRes = { (response?: any): void; (arg0: { res?: any; }): void; };

var googleToken = '';
let googleUser = ({} as any) as User;
var firebaseIdToken = ''
var firebaseAuth = getAuth();

try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.from === "CS") {
      LOG(4,'Service worker - ' + request.action);
      switch (request.action) {
        case "getcomments":
          getcomments(request.data, sendResponse);
          break;
        case "setComments":
          setComments(request.data, sendResponse);
          break;
        case "likeWebsite":
          likeWebsite(request.data, sendResponse);
          break;
        case "getreplies":
          getreplies(request.data, sendResponse);
          break;
        case "setreply":
          setreply(request.data, sendResponse);
          break;
        case "react":
          react(request.data, sendResponse);
          break;
        case "getNumOfPeople":
          getNumOfPeople(sendResponse);
          break;
        case "geturl":
          geturl(request.data, sendResponse);
          break;
        case "getusercomments":
          getusercomments(request.data, sendResponse);
          break;
        case "updateuser":
          updateuser(request.data, sendResponse);
          break;
        case "updateuserloginhistory":
          updateuserloginhistory(request.data, sendResponse);
          break;
        case "continueWithGoogle":
          continueWithGoogle(sendResponse);
          break;
        case "retreiveGoogleToken":
          retreiveGoogleToken(sendResponse);
          break;
        case "signOut":
          logout(sendResponse);
          break;
      }
    }
    return true;
  });
} catch (error) {
  LOG(2,'Service worker - listener broken ', error);
}

function continueWithGoogle(sendResponse: ChromeSendRes) {
  // Or authorizeGetAuthToken as alternative
  authorizeLaunchWebAuthFlow(async ({ token, error }) => {
    if (token) {
      LOG(4, "Service worker - continueWithGoogle:token ", token);
      //auth at background
      googleToken = token;
      // extUtil.setStorageData({
      //   googleToken
      // });
      signInFireBase(googleToken, sendResponse);
    } else {
      LOG(2, "Service worker - continueWithGoogle:err ", error);
      sendResponse({ err: error });
      googleToken = '';
      // extUtil.setStorageData({
      //   googleToken: ''
      // });
      extUtil.setStorageData({
        googleUser: ''
      });
      googleUser = ({} as any) as User; 
    }
  })
}

function signInFireBase(gToken: string | null | undefined, sendResponse: any = null) {
  const credential = GoogleAuthProvider.credential(null, gToken)
  signInWithCredential(firebaseAuth, credential)
    .then((result) => {
      googleUser = result?.user;
      LOG(4, "Service worker - signInWithCredential:googleUser ", googleUser, firebaseAuth);
      if (firebaseAuth && firebaseAuth.currentUser) {
        firebaseAuth.currentUser.getIdToken(true).then((idToken) => {
          if (idToken) {
            firebaseIdToken = idToken;
            extUtil.setStorageData({
              firebaseIdToken
            });
            extUtil.setStorageData({
              googleUser
            });
          }
        }).catch((error) => {
          LOG(2, 'Service worker - getIdToken:err', error.code);
        });
      }

      sendResponse && sendResponse({ 
        googleUser : {
        uid: googleUser?.uid,
        displayName: googleUser?.displayName,
        photoURL: googleUser?.photoURL,
        }
      });
    })
    .catch((error: any) => {
      LOG(2, "Service worker - signInWithCredential error ", error);
      sendResponse({ error });
    });
}

function retreiveGoogleToken(sendResponse: ChromeSendRes) {
  LOG(4, "Service worker - retreiveGoogleToken: ", googleUser?googleUser:null, firebaseAuth.currentUser);
  if (googleUser?.uid && firebaseAuth && firebaseAuth.currentUser) {
    sendResponse({ 
      googleUser : {
      uid: googleUser.uid,
      displayName: googleUser.displayName,
      photoURL: googleUser.photoURL,
      }
    });
  } else {
    // extUtil.getStorageData(['googleToken']).then(({ googleToken }) => {
    //   LOG(4, 'Service worker - retreiveGoogleToken getStorageData', googleToken);
    //   if (googleToken) {
    //     googleToken.
    //     LOG(4, 'Service worker - retreiveGoogleToken signInFireBase', googleToken);
    //     // signInFireBase(googleToken, sendResponse);
    //   }
    // });
    extUtil.getStorageData(['firebaseIdToken']).then(({ firebaseToken_from_storage }) => {
      LOG(4, 'Service worker - retreiveGoogleToken getStorageData firebaseIdToken:', firebaseToken_from_storage);
      if (firebaseToken_from_storage) {
        firebaseIdToken = firebaseToken_from_storage;
      }
    });;
    
    extUtil.getStorageData(['googleUser']).then(({ googleUser_from_storage }) => {
      LOG(4, 'Service worker - retreiveGoogleToken getStorageData googleUser:', googleUser_from_storage);
      if (googleUser_from_storage) {
        googleUser = googleUser_from_storage;
      };
    });

    // if we have both, reply pass
    if (googleUser && firebaseIdToken) {
      sendResponse && sendResponse({ 
        googleUser : {
        uid: googleUser?.uid,
        displayName: googleUser?.displayName,
        photoURL: googleUser?.photoURL,
        }
      });
    } else {
      googleUser = ({} as any) as User;
      firebaseIdToken = '';
      sendResponse({err: "token lost"});
    }
  }
}

async function logout(sendResponse: ChromeSendRes) {
  googleToken = ''
  firebaseIdToken = ''
  googleUser = ({} as any) as User;
  LOG(4, 'Service worker - logout:', googleUser.uid);
  extUtil.setStorageData({
    googleToken: '',
    firebaseIdToken: '',
    googleUser: ''
  });
  signOut(firebaseAuth).then(() => {
    // chrome.identity.launchWebAuthFlow(
      //   { 'url': 'https://accounts.google.com/logout' },
      //   function () {
        //     LOG(4, 'identity logout');
        //   }
        // );
      LOG(4, 'Service worker - logout:successful');
      sendResponse({ res: "logged out" });
    })
    .catch((err) => {
      LOG(2, 'Service worker - logout:err: ', err);
      sendResponse({ err });
    });
}

function getcomments(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/getcomments',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - getcomments:res ", res);
      sendResponse({ res });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - getcomments:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  })
}
function setComments(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/setcomments',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - setcomments:res ", res);
      sendResponse({ res });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - setcomments:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function likeWebsite(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/likeWebsite',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - likeWebsite:res ", res);
      sendResponse({ res });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - likeWebsite:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function getreplies(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/getreplies',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - getreplies:res ", res);
      sendResponse({ res });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - getreplies:err ", err);
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function setreply(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/setreply',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - setreply:res ", res);
      sendResponse({ res: "success" });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - setreply:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function react(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/react',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - react:res ", res);
      sendResponse({ res: "success" });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - react:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function getNumOfPeople(sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/getNumOfPeople',
    method: 'POST',
    body: {},
    successBlock: ({ data }: { data: any }) => {
      LOG(4, "Service worker - getNumOfPeople:res ", data);
      sendResponse({ res: data });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - getNumOfPeople:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function geturl(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/geturl',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - geturl:res ", res);
      if (!data.user_id && googleUser?.uid) {
        LOG(4, "Service worker - geturl:skip", googleUser.uid);
        sendResponse({ err: "skip" });
      } else {
        sendResponse({ res });
      }
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - geturl:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function getusercomments(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/getusercomments',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - getusercomments:res ", res);
      sendResponse({ res });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - getusercomments:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function updateuser(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/updateuser',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - updateuser:res ", res);
      sendResponse({ res });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - updateuser:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}
function updateuserloginhistory(data: any, sendResponse: ChromeSendRes) {
  AxiosAPIHelper.MakeRequestWithBody({
    endpoint: '/updateuserloginhistory',
    method: 'POST',
    body: data,
    successBlock: (res: any) => {
      LOG(4, "Service worker - updateuserloginhistory:res ", res);
      sendResponse({ res: "success" });
    },
    catchBlock: (err: any) => {
      LOG(2, "Service worker - updateuserloginhistory:err ", err);
      sendResponse({ err });
    },
    finallyBlock: false,
    isToken: true,
    firebaseIdToken: firebaseIdToken
  });
}


export { };