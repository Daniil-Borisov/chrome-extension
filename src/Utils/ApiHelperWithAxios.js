/* eslint-disable dot-notation */
import axios from 'axios'
import fetchAdapter from '@vespaiach/axios-fetch-adapter'
import '../firebase-config'
import { BaseURL } from './Constants/EnvConstants'
import { extUtil } from "./ExtensionFunctions";

const AxiosAPIHelper = {
  MakeRequest: (endpoint, method, SuccessBlock, CatchBlock, FinallyBlock) => {
    const url = BaseURL + endpoint;
    return axios({
      method,
      url,
    })
      .then((response) => {
        if (SuccessBlock) {
          return SuccessBlock(response)
        }
        return null
      })
      .catch((error) => {
        if (CatchBlock) {
          return CatchBlock(error)
        }
        return null
      })
      .finally(() => {
        if (FinallyBlock) {
          return FinallyBlock()
        }
        return null
      })
  },

  AxiosRequest: (body, method, url, successBlock, catchBlock, finallyBlock) => axios({
    data: body,
    method,
    url,
    adapter: fetchAdapter
  })
    .then((response) => {
      if (successBlock) {
        return successBlock(response)
      }
      return null;
    })
    .catch((error) => {
      if (catchBlock) {
        return catchBlock(error)
      }
      return null;
    })
    .finally(() => {
      if (finallyBlock) {
        return finallyBlock()
      }
      return null;
    }),

  MakeRequestWithBody: async ({ endpoint, method, body, successBlock, catchBlock, finallyBlock, isToken, firebaseIdToken }) => {
    const url = BaseURL + endpoint;
    if (isToken) {
      if (!firebaseIdToken)
        firebaseIdToken = await extUtil.getStorageData(['firebaseIdToken']);

      if (firebaseIdToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${firebaseIdToken}`;
      } else {
        return catchBlock({ status: "error", message: "Firebase idToken missing"});
      }

      return AxiosAPIHelper.AxiosRequest(body, method, url, successBlock, catchBlock, finallyBlock);
    }
    return AxiosAPIHelper.AxiosRequest(body, method, url, successBlock, catchBlock, finallyBlock);
  },

  MakeRequestQuery: (endpoint, params, SuccessBlock, CatchBlock, FinallyBlock) => {
    const url = BaseURL + endpoint;
    return axios.post(
      url,
      {},
      {
        params
      }
    )
      .then((response) => {
        if (SuccessBlock) {
          return SuccessBlock(response);
        }
        return null
      })
      .catch((error) => {
        if (CatchBlock) {
          return CatchBlock(error);
        }
        return null
      })
      .finally(() => {
        if (FinallyBlock) {
          return FinallyBlock();
        }
        return null
      });
  },
};

export default AxiosAPIHelper
