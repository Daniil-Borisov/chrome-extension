import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { LOG } from '../../Utils/debug';

const ProfilePageUtil = () => {
  const { appState } = useContext(AppContext)

  const updateUser = (name, photo) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "updateuser",
      data: {
        user_id: appState.googleUser.uid,
        name: name || appState.googleUser?.displayName,
        photo_url: photo || appState.googleUser?.photoURL
      }
    }, ({ res, err }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `ProfilePageUtil - updateUser:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        LOG(4, 'ProfilePageUtil - updateUser:res:', res.data);
      } else if (err) {
        LOG(2, 'ProfilePageUtil - updateUser:err:', err);
      }
      LOG(4, 'ProfilePageUtil - updateUser:setreply');
    });
  }

  return { updateUser }

}

export default ProfilePageUtil;