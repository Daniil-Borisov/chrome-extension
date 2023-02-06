import { useContext, useState } from 'react'
import { AppContext } from '../../../context/AppContext'
import { LOG } from '../../../Utils/debug';

const UserDetailsUtils = () => {
  const [myReplies, setMyReplies] = useState([])
  const [myComments, setMyComments] = useState([])
  const [loader, setLoader] = useState(false)
  const { appState } = useContext(AppContext)

  const fetchMyReplies = () => {
    setLoader(true)
    chrome.runtime.sendMessage({
      from: "CS",
      action: "getusercomments",
      data: {
        user_id: appState.googleUser ? appState.googleUser.uid : ''
      }
    }, ({ res, err }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `UserDetailsUtils - fetchMyReplies:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        const { data } = res;
        setMyComments(data.comments);
        setMyReplies(data.replies);
      } else if (err) {
        LOG(2, 'UserDetailsUtils - fetchMyReplies:err:', err);
      }
      setLoader(false)
    });
  }

  return { fetchMyReplies, myReplies, myComments, loader }
}

export default UserDetailsUtils;