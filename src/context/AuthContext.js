// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import React, { createContext, useEffect, useState } from 'react';
// import '../firebase-config'
// import { LOG } from '../Utils/debug';
// export const AuthContext = createContext({})

// const AuthProvider = ({ children }) => {
//   const [auth, setAuthc] = useState(null)
//   const authc = getAuth()

//   const setAuth = async (user) => {
//     setAuthc(user)
//     if (user) {
//         chrome.runtime.sendMessage({
//           from: "CS",
//           action: "updateuserloginhistory",
//           data: {
//             user_id: user.uid,
//           }
//         }, ({ res, err }) => {
//           const lastErr = chrome.runtime.lastError;
//           if (lastErr) {
//             LOG(4, `lastError: ${JSON.stringify(lastErr)}`);
//           } else if (res) {
//             LOG(4, 'Login history updated');
//           } else if (err) {
//             LOG(4, err)
//           }
//         });
//     }
//   }

//   // 2. if object with key 'authData' exists in localStorage, we are putting its value in auth.data and we set loading to false.

//   // This function will be executed every time component is mounted (every time the user refresh the page);
//   useEffect(() => {
//     LOG(4, "AuthConteonAuthStateChanged fn");
//     onAuthStateChanged(authc, async (user) => {
//       if (user) {
//         // const idTokenResult = await user.getIdTokenResult();
//         setAuthc(authc.currentUser)
//       } else {
//         setAuthc(null);
//       }
//     }, (err) => LOG(4, err)
//     )
//   }, [])

//   // 1. when **auth.data** changes we are setting **auth.data** in localStorage with the key 'authData'.

//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export default AuthProvider
