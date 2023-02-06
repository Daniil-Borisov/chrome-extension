import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { LOG } from '../../Utils/debug';

const CommentsUtils = () => {
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState([])
  const [loadMore, setLoadMore] = useState(true)

  const { appState, setAppState } = useContext(AppContext)

  const fetchReplies = (id, refresh) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "getreplies",
      data: {
        web_id: appState?.web_id,
        comment_id: id,
        last_id: refresh ? undefined : replies[replies.length - 1]?.id,
        user_id: appState.googleUser ? appState?.googleUser.uid : ''
      }
    }, ({ res, err }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `CommentsUtils - fetchReplies:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        const { data } = res;
        LOG(4, 'CommentsUtils - fetchReplies:res', data);
        if (data.length > 0) {
          setReplies(data);
        } else {
          setLoadMore(false);
        }
      } else if (err) {
        LOG(2, 'CommentsUtils - fetchReplies:err', err);
      }
    });
  };

  const postReply = (id, reply) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "setreply",
      data: {
        web_id: appState?.web_id,
        user_id: appState?.googleUser.uid,
        data: reply,
        comment_id: id,
        user_image: appState?.googleUser.photoURL,
        user_name: appState?.googleUser.displayName,
      }
    }, ({ res }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `CommentsUtils - postReply:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        LOG(4, 'CommentsUtils - postReply:res:', res);
      }
    });
  };

  const reactWithEmoji = (emoji, commentId, replyId) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "react",
      data: {
        user_id: appState?.googleUser.uid,
        web_id: appState?.web_id,
        comment_id: commentId,
        reply_id: replyId,
        reaction_emoji: emoji
      }
    }, ({ res }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `CommentsUtils - reactWithEmoji:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        LOG(4, 'CommentsUtils - reactWithEmoji:finally - setreply')
      }
    });
  }
  
  const setLike = (webId, userId) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "likeWebsite",
      data: { web_id: webId, user_id: userId, like: 1 }
    }, ({ res }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `CommentsUtils - setLike:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        const { data } = res;
        setAppState({...appState, likes:data.likes, user_liked: data.user_liked})
      }
    });
  }

  const isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  }

  const secondsToTime = (secs) => {
    let date = new Date(1970, 0, 1)
    date.setUTCSeconds(secs)
    if (isDstObserved) {
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 60)
    } else {
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    }
    const day = date.getDate() < 10 ? `0${date.getDate()}`: `${date.getDate()}`
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}`: `${date.getMonth() + 1}`
    const year = date.getFullYear()
    const formattedDate = `${day}.${month}.${year}`
    return formattedDate
  }

  const secondToHours = (secs) => {
    let date = new Date(1970, 0, 1)
    date.setUTCSeconds(secs)
    if (isDstObserved) {
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset() - 60)
    } else {
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    }
    const hours = date.getHours()
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}`: `${date.getMinutes()}`
    const formattedTime = `${hours}:${minutes}`
    return formattedTime
  }

  const timeSince = (date) => {
    const dateM = new Date(1970, 0, 1); // Epoch
    dateM.setSeconds(date);
    const dateUTC = dateM.getUTCDate()
    
    LOG(4, 'CommentsUtils - timeSince', dateUTC, dateM.getTimezoneOffset());
    dateM.setHours(dateM.getHours());

    date = dateM

    const seconds = (Math.floor((new Date() - date) / 1000)+ (dateM.getTimezoneOffset()*60));
  
    let interval = (seconds + (dateM.getTimezoneOffset()*60))/ 31536000;
    // seconds += seconds + (dateM.getTimezoneOffset()*60);
  
    if (interval > 1) {
      return `${Math.floor(interval)  } years`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return `${Math.floor(interval)  } months`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return `${Math.floor(interval)  } days`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return `${Math.floor(interval)  } hours`;
    }
    interval = seconds / 60;
    if (interval > 1) {
      return `${Math.floor(interval)  } minutes`;
    }
    return `${Math.floor(seconds)  } seconds`;
  }

  return { showReplies, setShowReplies, setReplies, loadMore, fetchReplies, replies, postReply, reactWithEmoji, setLike, secondsToTime, timeSince, secondToHours }
}

export default CommentsUtils