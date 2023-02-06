import { useState } from 'react'
import { User } from '../../types'
import { LOG } from '../../Utils/debug';

const HeaderUtils = () => {
  const [userProfiles, setUserProfiles] = useState<User[]>([])
  const [visitorNum, setVisitorNum] = useState<number>()

  const fetchNumOfPeople = () => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "getNumOfPeople"
    }, ({ res }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `HeaderUtils - fetchNumOfPeople:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        setUserProfiles(res.visitors);
        setVisitorNum(res.count);
      }
    });
  }

  return { fetchNumOfPeople, userProfiles, visitorNum }
}

export default HeaderUtils