/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-template-curly-in-string */
import { LOG } from './debug';

const setExtensionStorage = (data) => new Promise((resolve, reject) => {
    chrome.storage.local.set(data, () => {
      // eslint-disable-next-line no-unused-expressions
      if (chrome.runtime.lastError) {
        LOG(2, "Service worker - setExtensionStorage:err ${JSON.stringify(chrome.runtime.lastError)}");
        reject(`Ext lastError: ${JSON.stringify(chrome.runtime.lastError)}`)
      } else {
        LOG(4, "Service worker - setExtensionStorage:res ", data);
        resolve(data);
      }
    })
  })
  
  const getExtensionStorage = (key) => new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      // eslint-disable-next-line no-unused-expressions
      if (chrome.runtime.lastError) {
        LOG(4, "Service worker - getExtensionStorage:err ${JSON.stringify(chrome.runtime.lastError)}");
        reject(`Ext lastError: ${JSON.stringify(chrome.runtime.lastError)}`)
      } else {
        LOG(4, "Service worker - getExtensionStorage:res ", resolve);
        resolve(result);
      }
    })
});

export const extUtil = {
  setStorageData: setExtensionStorage,
  getStorageData: getExtensionStorage
}
