import { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { LOG } from '../../../Utils/debug';

const AddUserReviewUtil = () => {
  const { appState } = useContext(AppContext);

  const postComment = (comment, attachments, giffs, userEmoji, fetchCmntDataFromZero, handleSubmit) => {
    const data = {
      web_id: appState?.web_id,
      user_id: appState?.googleUser.uid,
      data: comment,
      user_image: appState?.googleUser.photoURL,
      user_name: appState?.googleUser.displayName,
      attachments,
      giffs: giffs.id,
      user_emoji: userEmoji
    };
    LOG(4, "AddUserReviewUtil - postComment", comment);
    chrome.runtime.sendMessage({
      from: "CS",
      action: "setComments",
      data
    }, ({ res }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(4, `AddUserReviewUtil - postComment:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        LOG(4, 'AddUserReviewUtil - postComment:res', res);
        handleSubmit(true);
      }
      if (fetchCmntDataFromZero) {
        fetchCmntDataFromZero();
      }
      // history.goBack();
    });
  };

  return { postComment };
};

export default AddUserReviewUtil;
