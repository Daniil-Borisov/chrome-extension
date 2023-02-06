/* eslint-disable react/jsx-no-constructed-context-values */
import '../firebase-config'
import React, { createContext, useEffect, useState } from 'react'
import { LOG } from '../Utils/debug';

export const AppContext = createContext({})
let tried = false;

const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState({
    web_id: null,
    comments_count: null,
    likes: null,
    uid: null,
    btnPosition: null,
  })

  const [ loading, setLoading] = useState(true)

  // const setAuth = async (user) => {
  //   setAppState({
  //     ...appState,
  //     googleUser: user
  //   });
  //   if (user) {
  //       chrome.runtime.sendMessage({
  //         from: "CS",
  //         action: "updateuserloginhistory",
  //         data: {
  //           user_id: user.uid,
  //         }
  //       }, ({ res, err }) => {
  //         const lastErr = chrome.runtime.lastError;
  //         if (lastErr) {
  //           LOG(4, `lastError: ${JSON.stringify(lastErr)}`);
  //         } else if (res) {
  //           LOG(4, 'Login history updated');
  //         } else if (err) {
  //           LOG(4, err)
  //         }
  //       });
  //   }
  // }

  const fetchWebsiteId = (id) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "geturl",
      data: {
        url: window.location.origin,
        user_id: id,
      }
    }, ({ res }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `AppContext - fetchWebsiteId:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        LOG(4, "AppContext - fetchWebsiteId:fetchWebsiteId return ", res);
        setAppState({
          ...appState,
          web_id: res?.data?.id,
          comments_count: res?.data?.comments_count,
          likes: res?.data?.likes,
          id: res?.data?.id,
          user_liked: res?.data?.user_liked
        });
      }
    });
  }

  useEffect(() => {
    if (!appState.googleUser && !tried) {
        tried = true;
        LOG(4, "AppContext - retreiveGoogleToken");
        chrome.runtime.sendMessage({
          from: "CS",
          action: "retreiveGoogleToken",
          data: {}
        }, ({ googleUser }) => {
          LOG(4, "AppContext - retreiveGoogleToken:res ", googleUser || null);
          // Add googleUser object to AppContext
          if (googleUser) {
            setAppState({
              ...appState,
              googleUser,
            });
          }
          setLoading(false);
        });
      }
    })
    
  useEffect(() => {
    if(!appState.googleUser) {
        LOG(4, "AppContext - fetchWebsiteId:visitor");
        fetchWebsiteId()
      }
    }, [])
    
  useEffect(() => {
    if(appState.googleUser) {
      LOG(4, "AppContext - fetchWebsiteId:authed", appState.googleUser);
      fetchWebsiteId(appState.googleUser.uid);
      // await setAuth(appState.googleUser);
    }
  }, [loading])

  return (
    <AppContext.Provider value={{ appState, setAppState, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
